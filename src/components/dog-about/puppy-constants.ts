import { GlobalNameSpaces as G } from "@/constants/data";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  puppyQuery,
  dogsQuery,
  type D1DogsQueryData as DQ,
  type D1PuppyQueryData as PQ,
  type D1FamilyQueryData as FQ,
} from "@/constants/queries";

/**
 * Data for both parents. Order is consistent with the {@see parents}
 * First Dog is the primary dog of interest for this page.
 **/
export async function getPuppyData(
  D1: D1Database,
  /**Queries to Obtain this object can be found in adult-constants.*/
  mostRecentFamily: FQ
) {
  /**A query to the puppy table for every puppy in this litter.*/
  const puppies = await D1.prepare(puppyQuery)
    .bind(mostRecentFamily[G.litterId])
    .all<PQ>()
    .then((res) => res.results);

  return await Promise.all(
    puppies.map(async (puppy) => {
      return await D1.prepare(dogsQuery)
        .bind(puppy[G.dogId])
        .first<DQ>()
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
