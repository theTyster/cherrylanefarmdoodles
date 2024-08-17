import { D1Tables as D1T, GlobalNameSpaces as G } from "@/constants/data";
/**
 * Frequently used Queries.
 * Where possible try to re-use these as much as you can to help improve
 * caching.
 **/
const preparedQueries = {
  /**These queries use indexes.*/
  familyQuery: {
    /**Get family data using the Mother.
     * This has been used now: NO*/
    father: `SELECT
  ${G.Group_Photos},
  mother,
  father,
  litterId
  FROM
    Families
  WHERE 
  mother = ?` as const,

    /**Get family data using the father.
     * This has been used now: NO*/
    mother: `SELECT
  ${D1T.Group_Photos},
  mother,
  father,
  litterId
  FROM
    Families
  WHERE 
  father = ?` as const,

    /**Get family data using the litter ID.
     * This has been used now: NO*/
    litter: `SELECT
  ${D1T.Group_Photos},
  mother,
  father,
  litterId
  FROM
    Families
  WHERE 
  litterId = ?` as const,
  },

  /**Get Dogs with a given ID.*/
  dogsQuery: `SELECT *
  FROM
    Dogs
  WHERE id = ?` as const,

  /**
   * Get all info about a specified Adult Dog.
   * utilizes indexes. Requires ID.
   **/
  adultDogsQuery: `SELECT 
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
  WHERE id = ?` as const,

  /**Get all info about a specified litter.*/
  litterQuery: `SELECT
   ${G.dueDate} as dueDate,
   ${G.litterBirthday} as litterBirthday,
   ${G.applicantsInQueue} as applicantsInQueue,
   count(Pups.isAvailable) as availablePuppies
   FROM
     Litters
     LEFT JOIN Puppies AS Pups ON Litters.id = Pups.litterId
   WHERE Litters.id = ? 
     AND 
   Pups.isAvailable = 1` as const,
};

export default preparedQueries;
