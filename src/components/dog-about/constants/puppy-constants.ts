import { GlobalNameSpaces as G } from "@/constants/data";
import { type PuppyData as PuppyDataType } from "@/types/dog-about";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  litterQuery,
  puppyQuery,
  dogsQuery,
  type D1LitterQueryData as D1LQ,
  type D1PuppyQueryData as D1PQ,
  type D1FamilyQueryData as D1FQ,
  type D1DogsQueryData as D1DQ,
} from "@/constants/queries";

export default class PuppyData {
  litterId: number;
  D1: D1Database;
  mostRecentFamily: D1FQ;

  pup?: PuppyDataType;

  constructor(D1: D1Database, mostRecentFamily: D1FQ) {
    this.D1 = D1;
    this.litterId = mostRecentFamily[G.litterId];
    this.mostRecentFamily = mostRecentFamily;
  }

  async getPuppyFromLitter(): Promise<D1PQ[]> {
    const puppies = await this.D1.prepare(litterQuery)
      .bind(this.litterId)
      .all<D1LQ>()
      .then((res) => res.results);

    if (puppies.length > 24)
      throw new Error(
        "This litter has set a world record for the most puppies in a single litter. We can't load that many on a page."
      );
    return puppies;
  }

  async getAllPuppies(): Promise<PuppyDataType[]> {
    const puppies = await this.getPuppyFromLitter();
    return await Promise.all(puppies.map((pup) => this.mergeData(pup)));
  }

  /**
   * A query to the puppy table for every puppy in this litter.
   * Feels like O(n) but it's actually O(~10) because a dog can only have so many puppies in a litter.
   **/
  async mergeData(puppyData: D1PQ): Promise<PuppyDataType> {
    const puppyDogDataQuery = await this.D1.prepare(dogsQuery)
      .bind(puppyData[G.dogId])
      .first<D1DQ>()
      .then(async (puppyDogsTable) => {
        if (!puppyDogsTable)
          throw new Error(
            "Missing data in the Dogs Table for ID: " + puppyData[G.dogId]
          );
        return {
          ...puppyDogsTable,
          ...puppyData,
        };
      });
    return PuppyData.castFromD1({
      ...puppyDogDataQuery,
      ...puppyData,
      ...this.mostRecentFamily,
    });
  }

  static async getPuppyFromPuppies(
    D1: D1Database,
    puppyId: string
  ): Promise<PuppyDataType> {
    return await D1.prepare(puppyQuery)
      .bind(puppyId)
      .first<D1PQ>()
      .then((res) =>
        res
          ? PuppyData.castFromD1(res)
          : Promise.reject("No puppy data found for ID: " + puppyId)
      );
  }

  /**Queries to Obtain this object can be found in adult-constants.*/
  static castFromD1(pup: D1DQ & D1LQ & D1FQ): PuppyDataType {
    const puppyData = {
      dogData: {
        [G.puppyName]: pup[G.puppyName],
        [G.collarColor]: pup[G.collarColor],
        [G.availability]: pup[G.availability] as
          | "Available"
          | "Picked"
          | "Adopted"
          | "Held Back",
        [G.gender]: pup[G.gender] as "M" | "F",
        [G.noseColor]: pup[G.noseColor],
        [G.coat]: pup[G.coat],
        [G.personality]: pup[G.personality],
        [G.Headshots_Lg]: pup[G.Headshots_Lg],
        [G.Headshots_Sm]: pup[G.Headshots_Sm],
      },
      litterData: {
        [G.dueDate]: new Date(pup[G.dueDate]),
        [G.litterBirthday]: new Date(pup[G.litterBirthday]),
        [G.applicantsInQueue]: pup[G.applicantsInQueue],
        [G.availablePuppies]: pup[G.availablePuppies],
        [G.totalPuppies]: pup[G.totalPuppies],
      },
      ids: {
        [G.Group_Photos]: pup[G.Group_Photos],
        [G.dogId]: pup[G.dogId],
        [G.litterId]: pup[G.litterId],
        [G.mother]: pup[G.mother],
        [G.father]: pup[G.father],
      },
    } satisfies PuppyDataType;

    Object.freeze(puppyData);
    Object.freeze(puppyData.dogData);
    Object.freeze(puppyData.litterData);
    Object.freeze(puppyData.ids);

    return { ...puppyData };
  }
}
