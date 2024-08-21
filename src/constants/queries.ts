import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
/**
 * Frequently used Queries.
 * Where possible try to re-use these as much as you can to help improve
 * caching.
 **/
/**Get Dogs with a given ID.*/
export const dogsQuery = `SELECT
  ${G.gender}, gender,
  ${G.noseColor}, nosecolor,
  ${G.coatColor}, coatColor,
  ${G.personality}, personality,
  ${G.Headshots_Sm}, headshots_sm,
  ${G.Headshots_Lg}, headshots_lg
  FROM
    Dogs
  WHERE id = ?` as const;

export type dogsQueryData = Omit<D1Dogs, typeof G.id>;

/**
 * Get all info about a specified Adult Dog.
 * utilizes indexes. Requires ID.
 **/
export const adultDogsQuery = `SELECT
  ${G.adultName} as adultName,
  ${G.breeder} as breeder,
  ${G.adultBirthday} as adultBirthday,
  ${G.eyeColor} as eyeColor,
  ${G.isRetired} as isRetired,
  ${G.favActivities} as favActivities,
  ${G.weight} as weight,
  ${G.energyLevel} as energyLevel,
  ${G.dogId} as dogId
  FROM
    Adults
  WHERE id = ?` as const;

export type adultDogsQueryData = Omit<D1Adults, typeof G.id>;

/**
 * Gets all information about a grouping of Dogs (a family).
 * Utilizes indexes. Requires ID.
 *
 * This query is preferred over two asynchonous queries that handle the join
 * in-code because the number of families is not constant and managing the join
 * in-code could eventually become a memory leak. That join would be O(n) as
 * the families table grows. SQL can handle this faster.
 * */
export const familyQuery = (parentRole?: "mother" | "father") =>
  `SELECT
  ${G.Group_Photos},
  ${G.mother} as mother,
  ${G.father} as father,
  ${D1T.Families}.${G.litterId} as litterId,
  ${G.dueDate} as dueDate,
  ${G.litterBirthday} as litterBirthday,
  ${G.applicantsInQueue} as applicantsInQueue,
   SUM(Pups.${G.isAvailable}) as availablePuppies,
   COUNT(Pups.${G.id}) as totalPuppies
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
  ${parentRole ? `WHERE ${parentRole} = ?` : ""}
  GROUP BY ${D1T.Families}.${G.mother}
  ORDER BY ${D1T.Litters}.${G.dueDate} DESC
  ` as const;

/**
 * Describes the type of these data points as they are when they are extracted
 * from D1.
 **/
export interface familyQueryData {
  [D1T.Group_Photos]: string;
  [G.mother]: D1Families[typeof G.mother];
  [G.father]: D1Families[typeof G.father];
  [G.litterId]: string;
  /**Needs to be converted to Date.*/
  [G.dueDate]: Date;
  /**Needs to be converted to number.*/
  [G.applicantsInQueue]: string;
  /**Needs to be converted to Date.*/
  [G.litterBirthday]: string;
  /**
   * Not in D1. Calculation made in the query
   * Needs to be converted to number
   **/
  [G.availablePuppies]: string;
  /**
   * Not in D1. Calculation made in the query
   * Needs to be converted to number
   **/
  [G.totalPuppies]: string;
}
