import { normalizeEpochDate } from "thetyster-utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
// Components
import DogTree from "@/components/dog-tree/dog-tree";
import AdoptionBanner from "@/components/adoption-banner/adoption-banner";
//import DogTreeError from "./error";

// Constants
import { GlobalNameSpaces as G } from "@/constants/data";
import {
  familyQuery,
  type familyQueryData,
  adultDogsQuery,
  type adultDogsQueryData,
  dogsQuery,
  type dogsQueryData,
  litterQuery,
  type litterQueryData,
} from "@/constants/queries";

// Types
import type { DogData, DogTreeData } from "@/types/dog-tree";

export const runtime = "edge";

export default async function WhiteSection() {
  const D1 = getRequestContext().env.dogsDB;

  const entryPoint = await D1.prepare(familyQuery())
    .bind()
    .all<familyQueryData>()
    .then((res) => res.results);

  // Reversed so that the most recent litters are displayed first.
  entryPoint.reverse();

  // Asynchronous loading of all the dogs is probably faster than one big query.
  // https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
  /**
   * All data related to the Dogtree component.
   **/
  const D1Queries = await Promise.all(
    entryPoint.map(async (familyTableData) => {
      return {
        [G.Group_Photos]: familyTableData[G.Group_Photos],
        [G.litterId]: familyTableData[G.litterId],
        ...(await Promise.all([
          D1.prepare(adultDogsQuery)
            .bind(familyTableData[G.mother])
            .first<adultDogsQueryData>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Mother's data in Adult Table for ID: " +
                    familyTableData.mother
                );
              const dogData = await D1.prepare(dogsQuery)
                .bind(res[G.dogId])
                .first<dogsQueryData>();
              if (!dogData)
                throw new Error(
                  "Missing Mother's data in Dogs Table for ID: " +
                    familyTableData.mother
                );
              return { ...dogData, ...res };
            }),
          D1.prepare(adultDogsQuery)
            .bind(familyTableData[G.father])
            .first<adultDogsQueryData>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Father's data in Adult Table for ID: " +
                    familyTableData.father
                );
              const dogData = await D1.prepare(dogsQuery)
                .bind(res[G.dogId])
                .first<dogsQueryData>();
              if (!dogData)
                throw new Error(
                  "Missing Father's data in Dogs Table for ID: " +
                    familyTableData.father
                );
              return { ...dogData, ...res };
            }),
          D1.prepare(litterQuery)
            .bind(familyTableData[G.litterId])
            .first<litterQueryData>()
            .then((res) => {
              if (!res)
                throw new Error(
                  "Missing Litter's data in Litters Table for ID: " +
                    familyTableData.litterId
                );

              return {
                litterData: {
                  [G.dueDate]: new Date(res[G.dueDate]),
                  [G.litterBirthday]: res[G.litterBirthday]
                    ? new Date(res[G.litterBirthday])
                    : null,
                  [G.applicantsInQueue]: Number.parseFloat(
                    res[G.applicantsInQueue]
                  ),
                  [G.availablePuppies]: res[G.availablePuppies],
                },
                ids: {
                  [G.litterId]: familyTableData[G.litterId],
                  [G.Group_Photos]: familyTableData[G.Group_Photos],
                  [G.mother]: familyTableData[G.mother],
                  [G.father]: familyTableData[G.father],
                },
              };
            }),
        ])),
      };
    })
  );

  /**
   * All data in D1 regarding families for the Dogtree
   **/
  const families = D1Queries.map((result) => {
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
    else if (!result[G.Group_Photos])
      throw new Error(
        "Missing Group Photos from the Families table. Group_Photos === " +
          result[G.Group_Photos]
      );
    else if (!result[G.litterId])
      throw new Error(
        "Missing Litter ID from the Families table. litterId === " +
          result[G.litterId]
      );
    return {
      [G.mother]: { ...result[0] } satisfies DogData,
      [G.father]: { ...result[1] } satisfies DogData,
      litterData: { ...result[2] }
        .litterData satisfies DogTreeData["litterData"],
      ids: { ...result[2] }.ids satisfies DogTreeData["ids"],
    } satisfies DogTreeData;
  });

  return families.map((family) => {
    return (
      <>
        <DogTree
          key={JSON.stringify(family.ids[G.litterId])}
          familyData={family}
        />
        <AdoptionBanner />
      </>
    );
  });
}
