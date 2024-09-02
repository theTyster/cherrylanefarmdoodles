import { GlobalNameSpaces as G } from "@/constants/data";
import { PuppyData } from "@/types/dog-about";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  puppyQuery,
  dogsQuery,
  type D1DogsQueryData as D1DQ,
  type D1PuppyQueryData as D1PQ,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";

/**Connects data for one puppy.*/
export function connectPuppyData(
  mostRecentFamily: D1FQ,
  pup: {
    puppyDogsTable: D1DQ;
    puppy: D1PQ;
  }
) {
  if (!pup) throw new Error("No puppy data provided.");
  return formatPupData(pup, mostRecentFamily);
}

export async function getPuppyData(
  D1: D1Database,
  /**Queries to Obtain this object can be found in adult-constants.*/
  litterId: string
): Promise<
  readonly {
    puppyDogsTable: D1DQ;
    puppy: D1PQ;
  }[]
> {
  /**A query to the puppy table for every puppy in this litter.*/
  const puppies = await D1.prepare(puppyQuery)
    .bind(litterId)
    .all<D1PQ>()
    .then((res) => res.results);

  return await Promise.all(
    puppies.map(async (puppy) => {
      const puppyId: number = puppy[G.dogId];
      return await D1.prepare(dogsQuery)
        .bind(puppyId)
        .first<D1DQ>()
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
export function formatPupData(
  pup: { puppyDogsTable: D1DQ; puppy: D1PQ },
  mostRecentFamily: D1FQ
): PuppyData {
  const puppyData = {
    dogData: {
      [G.puppyName]: pup.puppy[G.puppyName],
      [G.collarColor]: pup.puppy[G.collarColor],
      [G.availability]: pup.puppy[G.availability] as
        | "Available"
        | "Picked"
        | "Adopted"
        | "Held Back",
      [G.gender]: pup.puppyDogsTable[G.gender] as "M" | "F",
      [G.noseColor]: pup.puppyDogsTable[G.noseColor],
      [G.coat]: pup.puppyDogsTable[G.coat],
      [G.personality]: pup.puppyDogsTable[G.personality],
      [G.Headshots_Lg]: pup.puppyDogsTable[G.Headshots_Lg],
      [G.Headshots_Sm]: pup.puppyDogsTable[G.Headshots_Sm],
    },
    litterData: {
      [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
      [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
      [G.applicantsInQueue]: mostRecentFamily[G.applicantsInQueue],
      [G.availablePuppies]: mostRecentFamily[G.availablePuppies],
      [G.totalPuppies]: mostRecentFamily[G.totalPuppies],
    },
    ids: {
      [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
      [G.dogId]: pup.puppy[G.dogId],
      [G.litterId]: mostRecentFamily[G.litterId],
      [G.mother]: mostRecentFamily[G.mother],
      [G.father]: mostRecentFamily[G.father],
    },
  } satisfies PuppyData;

  Object.freeze(puppyData);
  Object.freeze(puppyData.dogData);
  Object.freeze(puppyData.litterData);
  Object.freeze(puppyData.ids);

  return { ...puppyData };
}
