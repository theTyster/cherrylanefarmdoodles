import { GlobalNameSpaces as G } from "@/constants/data";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  type familyQueryData,
  adultDogsQuery,
  type adultDogsQueryData,
  dogsQuery,
  type dogsQueryData,
} from "@/constants/queries";

type ParentData = readonly [dogsQueryData & adultDogsQueryData, dogsQueryData & adultDogsQueryData];

/**
 * Data for both parents. Order is consistent with the {@see parents}
 * First Dog is the primary dog of interest for this page.
 **/
export async function getParentData(
  D1: D1Database,
  parents: readonly ["mother" | "father", "mother" | "father"],
  mostRecentFamily: familyQueryData
): Promise<ParentData> {
const parentData = await Promise.all(
    parents.map(async (role) => {
      return await D1.prepare(adultDogsQuery)
        .bind(mostRecentFamily[role])
        .first<adultDogsQueryData>()
        .then(async (adultsTableData) => {
          if (!adultsTableData)
            throw new Error(
              "Missing " +
                role +
                " data in Adult Table for ID: " +
                mostRecentFamily[role]
            );
          const completedData = await D1.prepare(dogsQuery)
            .bind(adultsTableData[G.dogId])
            .first<dogsQueryData>()
            .then((dogTableData) => {
              if (!dogTableData)
                throw new Error(
                  "Missing " +
                    role +
                    " data in Dogs Table for ID: " +
                    adultsTableData[G.dogId]
                );
              return { ...dogTableData, ...adultsTableData };
            });
          return completedData;
        });
    })
  );

  if (parentData.length !== 2) throw new Error("There should be two parents.");
  return parentData as unknown as ParentData;
}
