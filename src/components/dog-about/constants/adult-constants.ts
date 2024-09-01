import { GlobalNameSpaces as G } from "@/constants/data";
import { type ParentData } from "@/types/dog-about";
export { getMostRecentFamily } from "./family-constants";

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
    secondaryParent?: ParentRole,
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
      [G.adultName]: parentDog[G.adultName],
      [G.breeder]: parentDog[G.breeder],
      [G.adultBirthday]: new Date(parentDog[G.adultBirthday]),
      [G.eyeColor]: parentDog[G.eyeColor],
      [G.activityStatus]: parentDog[G.activityStatus] as
        | "Active"
        | "Retired"
        | "Break",
      [G.favActivities]: parentDog[G.favActivities],
      [G.weight]: Number.parseFloat(parentDog[G.weight]),
      [G.energyLevel]: parentDog[G.energyLevel] as
        | "Low"
        | "Medium-low"
        | "Medium"
        | "Medium-high"
        | "High",
      [G.gender]: parentDog[G.gender] as "M" | "F",
      [G.noseColor]: parentDog[G.noseColor],
      [G.coat]: parentDog[G.coat],
      [G.personality]: parentDog[G.personality],
      [G.Headshots_Lg]: parentDog[G.Headshots_Lg],
      [G.Headshots_Sm]: parentDog[G.Headshots_Sm],
      [G.dogId]: Number.parseFloat(parentDog[G.dogId]),
      [G.certifications]: parentDog[G.certifications] as
        | "Embark"
        | "Embark-equivalent"
        | null,
    };
  }

  async adultTableQuery(adultId: number) {
    return await this.D1.prepare(adultDogsQuery).bind(adultId).first<D1AQ>();
  }

  async dogsTableQuery(dogId: number) {
    return await this.D1.prepare(dogsQuery).bind(dogId).first<D1DQ>();
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
      this.adultTableQuery(adultId).then((adultDogsTable) =>
        !adultDogsTable
          ? Promise.reject(
              "Missing " +
                adultDogsTable +
                " data in Adult Table for Litter ID: " +
                this.adultId
            )
          : adultDogsTable
      ),
      this.dogsTableQuery(dogId).then((dogTableData) =>
        !dogTableData
          ? Promise.reject(
              "Missing " +
                dogTableData +
                " data in Dogs Table for ID: " +
                this.dogId
            )
          : dogTableData
      ),
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
    adultId = adultId || this.adultId;
    if (!this.adultId) throw new Error("No adult ID provided.");
    const adultData = await this.adultTableQuery(adultId).then(
      async (adultTableData) =>
        !adultTableData
          ? Promise.reject(
              "Missing " +
                adultTableData +
                " data in Adult Table for Litter ID: " +
                this.adultId
            )
          : await this.dogsTableQuery(Number.parseFloat(adultTableData[G.dogId])).then(
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
  async getParentData(mostRecentFamily?: D1FQ, primaryParent?:ParentRole, secondaryParent?: ParentRole): Promise<ParentData> {
    mostRecentFamily = mostRecentFamily || this.mostRecentFamily;
    primaryParent = primaryParent || this.primaryParent;
    secondaryParent = secondaryParent || this.secondaryParent;
    if (!mostRecentFamily) throw new Error("No family data provided.");
    if (!primaryParent) throw new Error("No primary parent provided.");
    if (!secondaryParent) throw new Error("No secondary parent provided.");
    const secondaryParentId = Number.parseFloat(mostRecentFamily[secondaryParent]);

    this.parents = [primaryParent, secondaryParent] as const;
    
    const parentDogsData:ParentDataArray<ParentTypified> = await Promise.all([
      this.getAdultData(this.adultId),
      this.getAdultData(secondaryParentId),
    ]);

    this.parentData = {
      dogData: parentDogsData[0],
      partnerData: parentDogsData[1],
      litterData: {
        [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
        [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
        [G.applicantsInQueue]: Number.parseFloat(
          mostRecentFamily[G.applicantsInQueue]
        ),
        [G.availablePuppies]: Number.parseFloat(
          mostRecentFamily[G.availablePuppies]
        ),
        [G.totalPuppies]: Number.parseFloat(
          mostRecentFamily[G.totalPuppies]
        ),
      },
      ids: {
        [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
        [G.mother]: Number.parseFloat(mostRecentFamily[G.mother]),
        [G.father]: Number.parseFloat(mostRecentFamily[G.father]),
        [G.litterId]: Number.parseFloat(mostRecentFamily[G.litterId]),
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
