import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { D1Adults, D1Dogs, D1Families } from "@/types/data";
/**
 * Frequently used Queries.
 * Where possible try to re-use these as much as you can to help improve
 * caching.
 **/
/**Get Dogs with a given ID.*/
export const dogsQuery = `SELECT
  ${G.gender} as ${[G.gender]},
  ${G.noseColor} as ${[G.noseColor]},
  ${G.coatColor} as ${[G.coatColor]},
  ${G.personality} as ${[G.personality]},
  ${G.Headshots_Sm} as ${[G.Headshots_Sm]},
  ${G.Headshots_Lg} as ${[G.Headshots_Lg]}
  FROM
    Dogs
  WHERE id = ?` as const;

export type dogsQueryData = Omit<D1Dogs, typeof G.id>;

/**
 * Get all info about a specified Adult Dog.
 * utilizes indexes. Requires ID.
 **/
export const adultDogsQuery = `SELECT
  ${G.adultName} as ${[G.adultName]},
  ${G.breeder} as ${[G.breeder]},
  ${G.adultBirthday} as ${[G.adultBirthday]},
  ${G.eyeColor} as ${[G.eyeColor]},
  ${G.isRetired} as ${[G.isRetired]},
  ${G.favActivities} as ${[G.favActivities]},
  ${G.weight} as ${[G.weight]},
  ${G.energyLevel} as ${[G.energyLevel]},
  ${G.dogId} as ${[G.dogId]}
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
  ${G.mother} as ${[G.mother]},
  ${G.father} as ${[G.father]},
  ${D1T.Families}.${G.litterId} as ${[G.litterId]},
  ${G.dueDate} as ${[G.dueDate]},
  ${G.litterBirthday} as ${[G.litterBirthday]},
  ${G.applicantsInQueue} as ${[G.applicantsInQueue]},
  ${G.isAvailable} as availability,
  SUM(CASE WHEN Pups.${G.isAvailable} = 'Available' THEN 1 ELSE 0 END) AS ${G.availablePuppies},
   COUNT(Pups.${G.id}) as ${[G.totalPuppies]}
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
