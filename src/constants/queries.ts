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

export interface dogsQueryData extends Omit<D1Dogs, D1Dogs[typeof G.id]> {}

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

export interface adultDogsQueryData
  extends Omit<D1Adults, D1Adults[typeof G.id]> {}

/**Get all info about a specified litter.*/
export const litterQuery = `SELECT
   ${G.dueDate} as dueDate,
   ${G.litterBirthday} as litterBirthday,
   ${G.applicantsInQueue} as applicantsInQueue,
   COUNT(Pups.isAvailable) as availablePuppies
   FROM
     Litters
     LEFT JOIN Puppies AS Pups ON Litters.id = Pups.litterId
   WHERE Litters.id = ? 
     AND 
   Pups.isAvailable = 1` as const;

export interface litterQueryData extends Omit<D1Litters, typeof G.id | typeof G.litterBirthday | typeof G.applicantsInQueue> {
  readonly applicantsInQueue: string;
  /**Not in D1. Calculation made in the query.*/
  readonly availablePuppies: string;
  readonly litterBirthday: string | Date;
}

/**
 * Almost the same as litterQuery but extends with family table and
 * does not calculate available puppies.
 **/
export const familyQuery = (parentRole?: "mother" | "father") =>
  `SELECT
  ${G.Group_Photos},
  ${G.mother} as mother,
  ${G.father} as father,
  ${D1T.Families}.${G.litterId} as litterId,
  ${G.dueDate} as dueDate,
  ${G.litterBirthday} as litterBirthday,
  ${G.applicantsInQueue} as applicantsInQueue
  FROM
    ${D1T.Families}
  Left JOIN ${D1T.Litters} ON ${D1T.Families}.${G.litterId} = ${D1T.Litters}.${G.id}
  ${parentRole ? `WHERE ${parentRole} = ?` : ""}
  GROUP BY ${G.mother}
  ORDER BY ${D1T.Litters}.${G.dueDate} DESC
  ` as const;

export interface familyQueryData extends D1Families, D1Litters {
  Group_Photos: D1Families[typeof G.Group_Photos];
  dueDate: Date;
  applicantsInQueue: D1Litters[typeof G.applicantsInQueue];
  litterBirthday: D1Litters[typeof G.litterBirthday];
  /**Not in D1. Calculation made in the query.*/
  availablePuppies: number | string;
}
