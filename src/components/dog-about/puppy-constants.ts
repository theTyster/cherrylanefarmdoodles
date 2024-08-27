import { GlobalNameSpaces as G } from "@/constants/data";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  type familyQueryData,
  dogsQuery,
  type dogsQueryData,
  puppyQuery,
  type puppyQueryData,
} from "@/constants/queries";

/**
 * Data for both parents. Order is consistent with the {@see parents}
 * First Dog is the primary dog of interest for this page.
 **/
export async function getPuppyData<F extends familyQueryData>(
  D1: D1Database,
  /**Queries to Obtain this object can be found in adult-constants.*/
  mostRecentFamily: F
) {
  /**A query to the puppy table for every puppy in this litter.*/
  const puppies = await D1.prepare(puppyQuery)
    .bind(mostRecentFamily[G.litterId])
    .all<puppyQueryData>()
    .then((res) => res.results);

  return await Promise.all(
    puppies.map(async (puppy) => {
      return await D1.prepare(dogsQuery)
        .bind(puppy[G.dogId])
        .first<dogsQueryData>()
        .then(async (puppyDogsTable) => {
          if (!puppyDogsTable)
            throw new Error(
              "Missing " +
                puppy[G.puppyName] +
                "'s data in the Dogs Table for ID: " +
                puppy[G.dogId]
            );
          return { puppyDogsTable, puppy } as const;
        });
    })
  );
}
