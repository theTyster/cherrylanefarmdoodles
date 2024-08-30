import { GlobalNameSpaces as G } from "@/constants/data";
import { AdultData } from "@/types/dog-about";
export { getMostRecentFamily } from "./family-constants";

// Constants for the constants
import {
  adultDogsQuery,
  dogsQuery,
  type D1DogsQueryData as D1DQ,
  type DogsQueryData as DQ,
  type D1AdultDogsQueryData as D1AQ,
  type AdultDogsQueryData as AQ,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";
type Parent = D1DQ & D1AQ;
type ParentData = [Parent] | [Parent, Parent];

export async function connectParentData(
  D1: D1Database,
  mostRecentFamily: D1FQ,
  adultId: number[],
  primaryParent: "mother" | "father",
  secondaryParent?: "mother" | "father"
): Promise<AdultData> {
  if (!adultId) throw new Error("No adultId provided.");
  if (!primaryParent) throw new Error("No primaryParent provided.");
  const parents = secondaryParent ? [primaryParent, secondaryParent] : [primaryParent] as const;
  const parentData = await getParentData(D1, parents, adultId);

  return formatParentData(parentData, mostRecentFamily);
}
/**
 * Data for both parents. Order is consistent with the {@see parents}
 * First Dog is the primary dog of interest for this page.
 **/
export async function getParentData(
  D1: D1Database,
  parents: readonly ("mother" | "father")[],
  parentIds: number[]
): Promise<ParentData> {
  const parentData = await Promise.all(
    parents.map(async (role, index) => {
      return await D1.prepare(adultDogsQuery)
        .bind(parentIds[index])
        .first<D1AQ>()
        .then(async (adultsTableData) => {
          if (!adultsTableData)
            throw new Error(
              "Missing " +
                role +
                " data in Adult Table for ID: " +
                parentIds[index]
            );
          const completedData = await D1.prepare(dogsQuery)
            .bind(adultsTableData[G.dogId])
            .first<D1DQ>()
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
export function formatParentData(
  parentData: ParentData,
  mostRecentFamily: D1FQ
): AdultData {
  const convertParent = (i: number) =>
    ({
      [G.adultName]: parentData[i][G.adultName],
      [G.breeder]: parentData[i][G.breeder],
      [G.adultBirthday]: new Date(parentData[i][G.adultBirthday]),
      [G.eyeColor]: parentData[i][G.eyeColor],
      [G.activityStatus]: parentData[i][G.activityStatus] as
        | "Active"
        | "Retired"
        | "Break",
      [G.favActivities]: parentData[i][G.favActivities],
      [G.weight]: Number.parseFloat(parentData[i][G.weight]),
      [G.energyLevel]: parentData[i][G.energyLevel] as
        | "Low"
        | "Medium-low"
        | "Medium"
        | "Medium-high"
        | "High",
      [G.gender]: parentData[i][G.gender] as "M" | "F",
      [G.noseColor]: parentData[i][G.noseColor],
      [G.coat]: parentData[i][G.coat],
      [G.personality]: parentData[i][G.personality],
      [G.Headshots_Lg]: parentData[i][G.Headshots_Lg],
      [G.Headshots_Sm]: parentData[i][G.Headshots_Sm],
      [G.dogId]: Number.parseFloat(parentData[i][G.dogId]),
      [G.certifications]: parentData[i][G.certifications] as
        | "Embark"
        | "Embark-equivalent"
        | null,
    } satisfies DQ & AQ);
  const dogAboutData: AdultData = {
    dogData: convertParent(0),
    partnerData:undefined,
    litterData: {
      [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
      [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
      [G.applicantsInQueue]: Number.parseFloat(
        mostRecentFamily[G.applicantsInQueue]
      ),
      [G.availablePuppies]: Number.parseFloat(
        mostRecentFamily[G.availablePuppies]
      ),
      [G.totalPuppies]: Number.parseFloat(mostRecentFamily[G.totalPuppies]),
    },
    ids: {
      [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
      [G.mother]: Number.parseFloat(mostRecentFamily[G.mother]),
      [G.father]: Number.parseFloat(mostRecentFamily[G.father]),
      [G.litterId]: Number.parseFloat(mostRecentFamily[G.litterId]),
    },
  };

  if (parentData.length > 1) dogAboutData.partnerData = convertParent(1);
  else delete dogAboutData.partnerData;


  Object.freeze(dogAboutData);
  Object.freeze(dogAboutData.dogData);
  Object.freeze(dogAboutData.partnerData);
  Object.freeze(dogAboutData.litterData);
  Object.freeze(dogAboutData.ids);
  return { ...dogAboutData };
}
