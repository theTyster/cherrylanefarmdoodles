// Constants for the constants
import {
  familyQuery,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";

/**
 * Queries for the most recent family relationship of the primary dog on this page.
 **/
export const getMostRecentFamily = async (
  D1: D1Database,
  primaryParent: "mother" | "father",
  adultId: number,
) => {
  return await D1.prepare(familyQuery(primaryParent))
    .bind(adultId)
    .first<D1FQ>()
    .then((familyTableData) => {
      if (!familyTableData)
        throw new Error(
          "Missing data sourced through the Families Table for ID: " + adultId
        );
      return familyTableData;
    });

}
