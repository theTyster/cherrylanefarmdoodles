import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import {
  D1Adults,
  D1Dogs,
  D1Families,
  D1Litters,
  D1Puppies,
} from "@/types/data";

/**Utility type for this file.*/
type QueryStringify<T> = {
  [key in keyof T]: T[key] extends number & null
    ? number | null
    : T[key] extends string & null
    ? string | null
    : T[key];
};

/**
 * Frequently used Queries.
 * Where possible try to re-use these as much as you can to help improve
 * caching.
 **/
/**Get Dogs with a given Dog ID.*/
export const dogsQuery = `SELECT
  ${G.gender},
  ${G.noseColor},
  ${G.coat},
  ${G.personality},
  ${G.Headshots_Sm},
  ${G.Headshots_Lg}
  FROM
    Dogs
  WHERE id = ?` as const;

/**Describes data in Dogs Table after being converted to a usable type.*/
export type DogsQueryData = Omit<D1Dogs, typeof G.id>;
/**Describes data in the Dogs Table as it is when queried from D1.*/
export type D1DogsQueryData = QueryStringify<DogsQueryData>;

/**
 * Get all info about a specified Adult Dog.
 * utilizes indexes. Requires Adult ID.
 **/
export const adultDogsQuery = `SELECT
  ${G.adultName},
  ${G.breeder},
  ${G.adultBirthday},
  ${G.eyeColor},
  ${G.activityStatus},
  ${G.favActivities},
  ${G.weight},
  ${G.energyLevel},
  ${G.dogId}
  FROM
    Adults
  WHERE id = ?` as const;

/**Describes data in Adults Table after being converted to a usable type.*/
export type AdultDogsQueryData = Omit<D1Adults, typeof G.id>;
/**Describes data in the Adults table as it is when queried from D1.*/
export type D1AdultDogsQueryData = QueryStringify<AdultDogsQueryData>;

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
export const familyQuery = (
  litterId?: string /**litterId is not used in the actual query.*/
) =>
  `SELECT
  ${G.Group_Photos},
  ${G.mother},
  ${G.father},
  ${D1T.Families}.${G.litterId} as ${G.litterId},
  ${G.dueDate},
  ${G.litterBirthday},
  ${G.applicantsInQueue},
  ${G.availability},
  SUM(CASE WHEN Pups.${G.availability} LIKE '%Available%' THEN 1 ELSE 0 END) AS ${
    G.availablePuppies
  },
   COUNT(Pups.${G.id}) as ${G.totalPuppies}
  FROM
    ${D1T.Families}
    Left JOIN
      ${D1T.Litters}
      ON
      ${D1T.Families}.${G.litterId} = ${D1T.Litters}.${G.id}
    LEFT JOIN
      ${D1T.Puppies}
      AS Pups ON
      ${D1T.Litters}.${G.id} = Pups.${G.litterId}
  ${litterId ? `WHERE ${D1T.Families}.${G.litterId} = ?` : ""}
  GROUP BY ${D1T.Families}.${G.mother}
  ORDER BY ${D1T.Litters}.${G.dueDate} DESC
  ` as const;

/**Describes Data in D1 After being converted to a usable type.*/
export type FamilyQueryData = Omit<D1Families, typeof G.id> &
  Omit<D1Litters, typeof G.id> & {
    readonly [G.availablePuppies]: number;
    readonly [G.totalPuppies]: number;
  };
/**
 * Describes the type of these data points as they are when they are extracted
 * from D1.
 **/
export type D1FamilyQueryData = QueryStringify<FamilyQueryData>;

/**
 * Gets data for all puppies in a litter.
 * Utilizes indexes. Requires Litter ID.
 **/
export const litterQuery = `
  SELECT
  ${G.id} as ${G.puppyId},
  ${G.dogId},
  ${G.puppyName},
  ${G.collarColor},
  ${G.availability}
  FROM
    Puppies
  WHERE litterId = ?` as const;
/**Describes data in the Puppies Table after being converted to a usable type.*/
export type LitterQueryData = Omit<
  D1Puppies,
  typeof G.id | typeof G.litterId
> & {
  readonly [G.puppyId]: string;
};

/**Describes the types of data as they are when queried from D1*/
export type D1LitterQueryData = QueryStringify<PuppyQueryData>;

/**
 * Gets all previous litters from a specified dog as a collection of Group_Photos.
 * Utilizes indexes. Requires a father or mother Id.
 **/
export const previousLittersQuery = `
  SELECT
  ${G.Group_Photos},
  ${G.litterId}
  FROM
    ${D1T.Families}
  WHERE ${G.mother} = ?` as const;
/**Describes data in the Families Table after being converted to a usable type.*/
export type PreviousLittersQueryData = [
  D1Families[typeof G.Group_Photos],
  D1Families[typeof G.litterId]
];

/**
 * Gets all info about a specified Puppy.
 * Utilizes indexes. Requires Puppy ID.
 *
 * This joined together from the most atomic data in the database. Thus, all
 * joins for data related to puppies are made in SQL.
 * Nothing else in the database has as many datapoints as a puppy. This is the
 * most complex query in the database.
 * */
export const puppyQuery = `
WITH AggregateCounts AS (
  SELECT 
    COUNT(*) AS totalPuppies,
    SUM(CASE WHEN availability LIKE "%Available%" THEN 1 ELSE 0 END) AS availablePuppies
  FROM Puppies
WHERE litterId = (SELECT litterId FROM Puppies WHERE id = ?1)
)
SELECT
  Puppies.id AS puppyId,
  puppyName,
  collarColor,
  availability,
  gender,
  noseColor,
  coat,
  personality,
  Headshots_Lg,
  Headshots_Sm,
  Group_Photos,
  dueDate,
  litterBirthday,
  applicantsInQueue,
  Puppies.dogId AS dogId,
  Families.litterId AS litterId,
  mother,
  father,
  AggregateCounts.availablePuppies,
  AggregateCounts.totalPuppies
FROM
  Puppies
  LEFT JOIN Families ON Families.litterId = Puppies.litterId
  LEFT JOIN Litters ON Litters.id = Puppies.litterId
  LEFT JOIN Dogs ON Dogs.id = Puppies.dogId
  CROSS JOIN AggregateCounts 
WHERE
${D1T.Puppies}.${G.id} = ?1` as const;

export type PuppyQueryData = LitterQueryData & FamilyQueryData & DogsQueryData;
export type D1PuppyQueryData = QueryStringify<PuppyQueryData>;
