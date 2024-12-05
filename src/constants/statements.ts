import { GlobalNameSpaces as G, D1TablesType as D1TT } from "@/constants/data";

import type { D1Schema } from "@/types/data";

import {
  dogsQuery,
  adultDogsQuery,
  familyQuery,
  litterQuery,
  previousLittersQuery,
  puppyQuery,
  type D1LitterQueryData,
  type LitterQueryData,
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
  dogsQuery = dogsQuery;
  adultDogsQuery = adultDogsQuery;
  previousLittersQuery = previousLittersQuery;
  puppyQuery = puppyQuery;

  familyQuery = familyQuery;
  litterQuery = litterQuery;
  getLitterNamesQuery = MenuData.prototype.getLitterQuery;

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
    id: number
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

    return `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${values})`;
  }
}
