import { GlobalNameSpaces as G } from "@/constants/data";
import { type PuppyData as PuppyDataType } from "@/types/dog-about";
import AdultDogData from "./adult-constants";
import fetchDataWithCache from "@/constants/caching";

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
  litterId?: number | string;
  D1: D1Database;
  mostRecentFamily?: D1FQ;

  pup?: PuppyDataType;

  constructor(D1: D1Database) {
    this.D1 = D1;
  }

  async getPuppyFromLitter(litterId?: number | string): Promise<D1PQ[]> {
    if (litterId) this.litterId = litterId;
    if (!this.litterId) throw new Error("No litter ID provided.");
    const puppies = await fetchDataWithCache(
      "puppy-" + this.litterId + '__litterQuery',
      async () => {
        return await this.D1.prepare(litterQuery)
          .bind(this.litterId)
          .all<D1LQ>()
          .then((res) => res.results);
      }
    );
    if (!puppies)
      throw new Error("No puppies found for litter ID: " + litterId);
    if (puppies.length > 24)
      throw new Error(
        "This litter has set a world record for the most puppies in a single litter. We can't load that many on a page."
      );
    return puppies;
  }

  async getAllPuppies(litterId?: number | string): Promise<PuppyDataType[]> {
    const puppies = await this.getPuppyFromLitter(litterId);
    return await Promise.all(puppies.map((pup) => this.mergeData(pup)));
  }

  /**
   * A query to the puppy table for every puppy in this litter.
   * Feels like O(n) but it's actually O(~10) because a dog can only have so many puppies in a litter.
   **/
  async mergeData(puppyData: D1PQ): Promise<PuppyDataType> {
    const puppyDogDataQuery = await fetchDataWithCache(
      "puppy-" + puppyData[G.dogId] + '__dogsQuery',
      async () => {
        return await this.D1.prepare(dogsQuery)
          .bind(puppyData[G.dogId])
          .first<D1DQ>()
          .then(async (puppyDogsTable) => {
            if (!puppyDogsTable)
              throw new Error(
                "Missing data in the Dogs Table for ID: " + puppyData[G.dogId]
              );
            return puppyDogsTable;
          });
      }
    );

    return PuppyData.castFromD1({
      ...puppyDogDataQuery,
      ...puppyData,
    });
  }

  async getPuppyFromPuppies(puppyId: string): Promise<PuppyDataType> {
    return await fetchDataWithCache(
      "puppy-" + puppyId + '__puppyQuery',
      async () => {
        return await this.D1.prepare(puppyQuery)
          .bind(puppyId)
          .first<D1PQ>()
          .then((res) => {
            if (!res) Promise.reject("No puppy data found for ID: " + puppyId);
            this.pup = PuppyData.castFromD1(res!);
            return this.pup!;
          });
      }
    );
  }

  async getFamily(): Promise<PuppyDataType> {
    if (!this.pup)
      throw new Error(
        "No puppy data found. You must first call getPuppyFromPuppies."
      );

    if (!this.mostRecentFamily) {
      // Cobble together a recent family from data gathered with the puppy.
      const mostRecentFamilyHack = {
        ...this.pup.ids,
        [G.litterBirthday]: this.pup.litterData[G.litterBirthday],
        [G.dueDate]: this.pup.litterData[G.dueDate],
        [G.applicantsInQueue]: this.pup.litterData[G.applicantsInQueue],
        [G.availablePuppies]: this.pup.litterData[G.availablePuppies],
        [G.totalPuppies]: this.pup.litterData[G.totalPuppies],
      };
      const A = new AdultDogData(
        this.D1,
        this.pup.ids[G.mother],
        G.mother,
        mostRecentFamilyHack,
        G.father
      );
      const adultData = await A.getParentData();

      return {
        ...this.pup,
        parentData: adultData,
      };
    }
    const A = new AdultDogData(
      this.D1,
      this.pup.ids[G.mother],
      G.mother,
      this.mostRecentFamily,
      G.father
    );
    const adultData = await A.getParentData();

    return {
      ...this.pup,
      parentData: adultData,
    };
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
          | "Available Guardian",
        [G.gender]: pup[G.gender] as "M" | "F",
        [G.noseColor]: pup[G.noseColor],
        [G.coat]: pup[G.coat],
        [G.personality]: pup[G.personality],
        [G.Headshots_Lg]: pup[G.Headshots_Lg],
        [G.Headshots_Sm]: pup[G.Headshots_Sm],
      },
      litterData: {
        [G.dueDate]: pup[G.dueDate] ? new Date(pup[G.dueDate]!) : null,
        [G.litterBirthday]: pup[G.litterBirthday]
          ? new Date(pup[G.litterBirthday]!)
          : null,
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
        [G.puppyId]: pup[G.puppyId],
      },
    } satisfies PuppyDataType;

    Object.freeze(puppyData);
    Object.freeze(puppyData.dogData);
    Object.freeze(puppyData.litterData);
    Object.freeze(puppyData.ids);

    return { ...puppyData };
  }
}
