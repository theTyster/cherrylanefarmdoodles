import { getAllRecentFamilies } from "@/components/dog-about/constants/family-constants";
import PupData from "@/components/dog-about/constants/puppy-constants";
import { type PuppyData } from "@/types/dog-about";
import { DogData } from "@/types/dog-about";
import { type DogTreeData } from "@/types/dog-tree";
import { GlobalNameSpaces as G } from "@/constants/data";
import {
  adultDogsQuery,
  type D1AdultDogsQueryData as D1AQ,
  dogsQuery,
  type D1DogsQueryData as D1DQ,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";
import fetchDataWithCache from "@/constants/caching";

export default class DogTreeDataClass {
  D1: D1Database;
  entryPoint?: D1FQ[];
  puppyData?: PuppyData[];

  constructor(D1: D1Database) {
    this.D1 = D1;
  }

  async getCachedFamily() {
    return fetchDataWithCache("dog-tree_all", this.getFamily.bind(this));
  }

  async getFamily() {
    const puppyData = new PupData(this.D1);
    this.entryPoint = await getAllRecentFamilies(this.D1);
    // Data Collection for the Dogtree component {
    // Reversed so that the most recent litters are displayed first.
    this.entryPoint.reverse();

    // Asynchronous loading of all the dogs is probably faster than one big query.
    // https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
    /**
     * All data related to the Dogtree component.
     **/
    const D1Queries = await Promise.all(
      this.entryPoint.map(async (familyTableData) => {
        return {
          [G.Group_Photos]: familyTableData[G.Group_Photos],
          [G.litterId]: familyTableData[G.litterId],
          ...(await Promise.all([
            this.D1.prepare(adultDogsQuery)
              .bind(familyTableData[G.mother])
              .first<D1AQ>()
              .then(async (res) => {
                if (!res)
                  throw new Error(
                    "Missing Mother's data in Adult Table for ID: " +
                      familyTableData.mother
                  );
                const dogData = await this.D1.prepare(dogsQuery)
                  .bind(res[G.dogId])
                  .first<D1DQ>();
                if (!dogData)
                  throw new Error(
                    "Missing Mother's data in Dogs Table for ID: " +
                      familyTableData.mother
                  );
                return { ...dogData, ...res };
              }),
            this.D1.prepare(adultDogsQuery)
              .bind(familyTableData[G.father])
              .first<D1AQ>()
              .then(async (res) => {
                if (!res)
                  throw new Error(
                    "Missing Father's data in Adult Table for ID: " +
                      familyTableData.father
                  );
                const dogData = await this.D1.prepare(dogsQuery)
                  .bind(res[G.dogId])
                  .first<D1DQ>();
                if (!dogData)
                  throw new Error(
                    "Missing Father's data in Dogs Table for ID: " +
                      familyTableData.father
                  );
                return { ...dogData, ...res };
              }),
            puppyData.getAllPuppies(familyTableData[G.litterId]),
          ])),
        };
      })
    );

    /**
     * All data in D1 regarding families for the Dogtree
     **/
    const families = D1Queries.map((result, D1QueriesIndex) => {
      if (!result[0])
        throw new Error(
          "Missing Mother's Data from the Adults table. result[0] === " +
            result[0]
        );
      else if (!result[1])
        throw new Error(
          "Missing Father's Data from the Adults table. result[1] === " +
            result[1]
        );
      else if (!result[G.litterId])
        throw new Error(
          "Missing Litter ID from the Families table. litterId === " +
            result[G.litterId]
        );

      const familyTableData = this.entryPoint![D1QueriesIndex];

      return {
        [G.mother]: { ...result[0] } satisfies DogData,
        [G.father]: { ...result[1] } satisfies DogData,
        puppies: result[2],
        litterData: {
          [G.dueDate]: familyTableData[G.dueDate],
          [G.litterBirthday]: familyTableData[G.litterBirthday],
          [G.applicantsInQueue]: familyTableData[G.applicantsInQueue],
          [G.availablePuppies]: familyTableData[G.availablePuppies],
          [G.totalPuppies]: familyTableData[G.totalPuppies],
        } satisfies DogTreeData["litterData"],
        ids: {
          [G.litterId]: familyTableData[G.litterId],
          [G.Group_Photos]: familyTableData[G.Group_Photos],
          [G.mother]: familyTableData[G.mother],
          [G.father]: familyTableData[G.father],
        } satisfies DogTreeData["ids"],
      } satisfies DogTreeData;
    });
    return families;
    // }
  }
}
