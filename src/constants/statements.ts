import {
  GlobalNameSpaces as G,
  D1TablesType as D1TT,
  D1Tables as D1T,
} from "@/constants/data";

import type { D1Schema } from "@/types/data";

import {
  dogsQuery,
  previousLittersQuery,
  puppyQuery,
  type D1LitterQueryData,
  type LitterQueryData,
  type AdultDogsQueryData,
  type D1AdultDogsQueryData,
  type D1PuppyQueryData,
  type PuppyQueryData,
  type D1FamilyQueryData,
  type FamilyQueryData,
  type D1DogsQueryData,
  type DogsQueryData,
} from "@/constants/queries";

import MenuData from "@/constants/nav";

export type D1LQ = D1LitterQueryData;
export type LQ = LitterQueryData;
export type D1AQ = D1AdultDogsQueryData;
export type AQ = AdultDogsQueryData;
export type D1PQ = D1PuppyQueryData;
export type PQ = PuppyQueryData;
export type D1FQ = D1FamilyQueryData;
export type FQ = FamilyQueryData;
export type D1DQ = D1DogsQueryData;
export type DQ = DogsQueryData;

/**
 * Takes a table name and creates a typed object based on the schema of that table.
 * Additional keys can be excluded by including a string literal as the second
 * type parameter.
 **/
export type DogsDBTableValTypes<
  T extends D1TT,
  O extends string = "",
  S = D1Schema[T]
> = Omit<S, O>;

/**
 * All functions from this class yield strings that are valid SQL statements.
 **/
export default class D1Statements {
  imageTables: [
    (typeof G)["Headshots_Sm"],
    (typeof G)["Headshots_Lg"],
    (typeof G)["Group_Photos"]
  ];

  constructor() {
    this.dogsQuery = dogsQuery;
    this.previousLittersQuery = previousLittersQuery;
    this.puppyQuery = puppyQuery;
    this.getLitterNamesQuery = MenuData.prototype.getLitterQuery;
    this.imageTables = [
      G["Headshots_Sm"],
      G["Headshots_Lg"],
      G["Group_Photos"],
    ] as const;
  }

  dogsQuery;
  previousLittersQuery;
  puppyQuery;
  getLitterNamesQuery;

  /**
   * Creates an SQL update statement for a given table.
   * The update statement is typed based on the table provided but excludes the
   * id of the row being updated.
   *
   * Additional keys can be excluded from the typed object being used to update
   * by providing a string literal type as the optional second type parameter.
   **/
  makeUpdateStmt<T extends D1TT, O extends string = "id">(
    table: T,
    data: DogsDBTableValTypes<T, O>,
    id: string | number
  ) {
    type K = keyof typeof data;
    const keys = Object.keys(data) as unknown as K[];

    return `UPDATE ${table} 
      SET ${keys
        .map((key) => `${String(key)} = '${data[key]}'`)
        .join(", ")} WHERE ${G.id} = ${id}`;
  }

  /**
   * Creates an SQL Insert statement for a given table.
   * The update statement is typed based on the table provided.
   *
   * Additional keys can be excluded from the typed object being used to update
   * by providing a string literal type as the optional second type parameter.
   **/
  makeInsertStatement<T extends D1TT, O extends string = "id">(
    table: T,
    data: DogsDBTableValTypes<T, O>
  ) {
    type K = keyof typeof data;
    const keys = Object.keys(data) as unknown as K[];

    const columns = keys.join(", ");

    const values = keys
      .map((key) => (data[key] ? `'${data[key]}'` : "NULL"))
      .join(", ");

    return `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${values}) RETURNING ${G.id};`;
  }

  /**
   * Creates an SQL Delete statement for a given table using an id.
   **/
  makeDeleteStmt<T extends D1TT>(table: T, id: string | number) {
    return `DELETE FROM ${table} WHERE ${G.id} = ${id};`;
  }

  /**
   * Gets all information about a grouping of Dogs (a family).
   * Utilizes indexes. Can use Litter ID.
   *
   * This is actually two different queries. One that returns all families and
   * one that returns a specific family based on litterId.
   *
   * This query is preferred over two asynchonous queries that handle the join
   * in-code because the number of families is not constant and managing the join
   * in-code could eventually become a memory leak. That join would be O(n) as
   * the families table grows. SQL can handle this faster.
   * */
  familyQuery(
    opts: {
      /**Provide a litterId to only return one family.*/
      litterId?: string;
      /**Group the families so that only the most recent pairings of adults are returned.*/
      onlyRecent?: boolean;
    } = {}
  ): string {
    return `SELECT
  ${G.Group_Photos},
  ${G.mother},
  ${G.father},
  ${D1T.Families}.${G.litterId} AS ${G.litterId},
  ${G.dueDate},
  ${G.litterBirthday},
  ${G.applicantsInQueue},
  ${G.availability},
  SUM(CASE WHEN Pups.${
    G.availability
  } LIKE '%Available%' THEN 1 ELSE 0 END) AS ${G.availablePuppies},
  COUNT(Pups.${G.id}) AS ${G.totalPuppies},
  CASE
    WHEN 
      COALESCE(${D1T.Litters}.${G.litterBirthday}, 1970-01-01) > 
      COALESCE(${D1T.Litters}.${G.dueDate}, 1970-01-01) 
      AND
      SUM(CASE WHEN 
          Pups.${G.availability} LIKE '%Available%' THEN 1 ELSE 0 END) > 0
      THEN 
      COALESCE(${D1T.Litters}.${G.litterBirthday}, 1970-01-01)
      ELSE
      COALESCE(${D1T.Litters}.${G.dueDate}, 1970-01-01)
    END AS mostRecentDate
  FROM
    ${D1T.Families}
    Left JOIN ${D1T.Litters}
      ON ${D1T.Litters}.${G.id} = ${D1T.Families}.${G.litterId}
    LEFT JOIN ${D1T.Puppies}
      AS Pups ON ${D1T.Litters}.${G.id} = Pups.${G.litterId}
  ${opts.litterId ? `WHERE ${D1T.Families}.${G.litterId} = ?` : ""}
  ${opts.onlyRecent ? `GROUP BY ${D1T.Families}.${G.mother}` : ""}
  ORDER BY mostRecentDate ASC
  ` as const;
  }

  /**
   * Gets data for all puppies in a litter.
   * Utilizes indexes. Requires Litter ID.
   **/
  litterQuery(opts: { litterId?: string } = {}) {
    return `SELECT
  ${G.id} as ${G.puppyId},
  ${G.dogId},
  ${G.puppyName},
  ${G.collarColor},
  ${G.availability}
  FROM
    Puppies
  ${opts.litterId ? "WHERE litterId = ?" : ""}` as const;
    /**Describes data in the Puppies Table after being converted to a usable type.*/
  }
  /**
   * Get all info about a specified Adult Dog.
   * utilizes indexes. Requires Adult ID.
   **/
  get adultDogsQuery() {
    return `SELECT
  ${G.adultName},
  ${G.breeder},
  ${G.adultBirthday},
  ${G.eyeColor},
  ${G.activityStatus},
  ${G.favActivities},
  ${G.weight},
  ${G.energyLevel},
  ${G.dogId},
  ${G.certifications}
  FROM
    Adults
  WHERE id = ?` as const;
  }
}
