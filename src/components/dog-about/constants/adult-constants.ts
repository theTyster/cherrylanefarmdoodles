import { GlobalNameSpaces as G } from "@/constants/data";
import { type ParentData } from "@/types/dog-about";
import fetchDataWithCache from "@/constants/caching";

// Constants for the constants
import {
  dogsQuery,
  adultDogsQuery,
  type D1DogsQueryData as D1DQ,
  type DogsQueryData as DQ,
  type D1AdultDogsQueryData as D1AQ,
  type AdultDogsQueryData as AQ,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";
type ParentExtracted = D1DQ & D1AQ;
type ParentTypified = DQ & AQ;
type ParentDataArray<T extends ParentExtracted | ParentTypified> = [T, T];
type ParentRole = "mother" | "father";
type ParentRoles = readonly [ParentRole, ParentRole] | readonly [ParentRole];

/**
 * Get's all data personally associated with an adult dog.
 *
 * @param D1 - The database to query.
 * @param adultId - The ID of the adult to get data for or the id of the primary parent in the case of two parents.
 * @param primaryParent - The role of the primary parent. Should be "mother" or "father".
 * @param mostRecentFamily - The most recent family data. Should be the result of a query with {@see getMostRecentFamily} using a litterId.
 **/
export default class AdultDogData {
  D1: D1Database;
  adultId: number;
  primaryParent: ParentRole;
  secondaryParent?: ParentRole;
  mostRecentFamily?: D1FQ;
  parents?: ParentRoles;
  litterId?: number;
  adult?: ParentTypified;
  parentData?: ParentData;
  dogId?: number;

  constructor(
    D1: D1Database,
    adultId: number,
    primaryParent: ParentRole,
    mostRecentFamily?: D1FQ,
    secondaryParent?: ParentRole
  ) {
    this.D1 = D1;
    this.adultId = adultId;
    this.primaryParent = primaryParent;
    this.secondaryParent = secondaryParent;
    this.mostRecentFamily = mostRecentFamily;
  }

  /**Typifies data for an adult Dog*/
  typifyParent(parentDog: ParentExtracted): ParentTypified {
    return {
      [G.adultName]: parentDog[
        G.adultName
      ] as ParentTypified[typeof G.adultName],
      [G.breeder]: parentDog[G.breeder] as ParentTypified[typeof G.breeder],
      [G.adultBirthday]: parentDog[G.adultBirthday]
        ? new Date(parentDog[G.adultBirthday]!)
        : null,
      [G.eyeColor]: parentDog[G.eyeColor],
      [G.activityStatus]: parentDog[
        G.activityStatus
      ] as ParentTypified[typeof G.activityStatus],
      [G.favActivities]: parentDog[G.favActivities],
      [G.weight]: parentDog[G.weight],
      [G.energyLevel]: parentDog[
        G.energyLevel
      ] as ParentTypified[typeof G.energyLevel],
      [G.gender]: parentDog[G.gender] as ParentTypified[typeof G.gender],
      [G.noseColor]: parentDog[G.noseColor],
      [G.coat]: parentDog[G.coat],
      [G.personality]: parentDog[G.personality],
      [G.Headshots_Lg]: parentDog[G.Headshots_Lg],
      [G.Headshots_Sm]: parentDog[G.Headshots_Sm],
      [G.dogId]: parentDog[G.dogId],
      [G.certifications]: parentDog[
        G.certifications
      ] as ParentTypified[typeof G.certifications],
    };
  }

  async adultTableQuery(adultId?: number): Promise<D1AQ> {
    if (!adultId) adultId = this.adultId;
    this.adultId = adultId;
    const cached = await fetchDataWithCache(
      "adult-" + adultId + "__adultDogsQuery",
      async () =>
        await this.D1.prepare(adultDogsQuery)
          .bind(adultId)
          .first<D1AQ>()
          .then((data) => {
            if (!data)
              throw new Error("No data found for adult ID: " + adultId);
            return data;
          })
    );
    return cached;
  }

  async dogsTableQuery(dogId?: number): Promise<D1DQ> {
    if (!dogId) dogId = this.dogId;
    this.dogId = dogId;
    const cached = await fetchDataWithCache(
      "dog-" + dogId + "__dogsQuery",
      async () =>
        await this.D1.prepare(dogsQuery)
          .bind(dogId)
          .first<D1DQ>()
          .then((data) => {
            if (!data) throw new Error("No data found for dog ID: " + dogId);
            return data;
          })
    );
    return cached;
  }

  /**
   * D1 queries for an Adult Dog run in parallel
   * Requires both adultId and dogId to already be known.
   **/
  async asyncAdultData(
    adultId: number,
    dogId: number
  ): Promise<ParentTypified> {
    const adultData: ParentTypified = await Promise.all([
      this.adultTableQuery(adultId).then((adultDogsTable) => {
        if (!adultDogsTable)
          throw new Error(
            "Missing " +
              adultDogsTable +
              " data in Adult Table for Litter ID: " +
              this.adultId
          );
        return adultDogsTable;
      }),
      this.dogsTableQuery(dogId).then((dogTableData) => {
        if (!dogTableData)
          throw new Error(
            "Missing " +
              dogTableData +
              " data in Dogs Table for ID: " +
              this.dogId
          );
        return dogTableData;
      }),
    ]).then(([adultDogsTable, dogTableData]) =>
      this.typifyParent({ ...dogTableData, ...adultDogsTable })
    );
    this.adult = adultData;
    return this.adult;
  }

  /**
   * D1 queries for an Adult Dog.
   * If both the adultId and dogId are known, then it is faster to use {@see asyncAdultData}.
   **/
  async getAdultData(adultId?: number): Promise<ParentTypified> {
    const adultData = await this.adultTableQuery(adultId ?? this.adultId).then(
      async (adultTableData) =>
        !adultTableData
          ? Promise.reject(
              "Missing " +
                adultTableData +
                " data in Adult Table for Litter ID: " +
                this.adultId
            )
          : await this.dogsTableQuery(adultTableData[G.dogId]).then(
              (dogTableData) =>
                !dogTableData
                  ? Promise.reject(
                      "Missing " +
                        dogTableData +
                        " data in Dogs Table for ID: " +
                        this.dogId
                    )
                  : this.typifyParent({ ...dogTableData, ...adultTableData })
            )
    );

    this.adult = adultData;
    return this.adult;
  }
  /**
   * Gets all of the data for a parent and any other related data that may
   * pertain to their relationship to a litter.
   *
   * @param adultData - The parent data to append to the family data. First parent is the primary parent for the page.
   * @param mostRecentFamily - The most recent family data. Should be the result of a query with {@see getMostRecentFamily} using a litterId.
   **/
  async getParentData(
    mostRecentFamily?: D1FQ,
    primaryParent?: ParentRole,
    secondaryParent?: ParentRole
  ): Promise<ParentData> {
    mostRecentFamily = mostRecentFamily || this.mostRecentFamily;
    primaryParent = primaryParent || this.primaryParent;
    secondaryParent = secondaryParent || this.secondaryParent;
    if (!mostRecentFamily) throw new Error("No family data provided.");
    if (!primaryParent) throw new Error("No primary parent provided.");
    if (!secondaryParent) throw new Error("No secondary parent provided.");
    const secondaryParentId = mostRecentFamily[secondaryParent];

    this.parents = [primaryParent, secondaryParent] as const;

    const parentDogsData: ParentDataArray<ParentTypified> = await Promise.all([
      this.getAdultData(this.adultId),
      this.getAdultData(secondaryParentId),
    ]);

    this.parentData = {
      dogData: parentDogsData[0],
      partnerData: parentDogsData[1],
      litterData: {
        [G.dueDate]: mostRecentFamily[G.dueDate]
          ? new Date(mostRecentFamily[G.dueDate]!)
          : null,
        [G.litterBirthday]: mostRecentFamily[G.litterBirthday]
          ? new Date(mostRecentFamily[G.litterBirthday]!)
          : null,
        [G.applicantsInQueue]: mostRecentFamily[G.applicantsInQueue],
        [G.availablePuppies]: mostRecentFamily[G.availablePuppies],
        [G.totalPuppies]: mostRecentFamily[G.totalPuppies],
      },
      ids: {
        [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
        [G.mother]: mostRecentFamily[G.mother],
        [G.father]: mostRecentFamily[G.father],
        [G.litterId]: mostRecentFamily[G.litterId],
      },
    };

    Object.freeze(this.parentData);
    Object.freeze(this.parentData.dogData);
    Object.freeze(this.parentData.partnerData);
    Object.freeze(this.parentData.litterData);
    Object.freeze(this.parentData.ids);
    return { ...this.parentData };
  }
}
