// Constants for the constants
import {
  familyQuery,
  type familyQueryData,
} from "@/constants/queries";

/**
 * Queries for the most recent family relationship of the primary dog on this page.
 **/
export const getMostRecentFamily = async (
  D1: D1Database,
  primaryParent?: "mother" | "father",
  adultId?: number,
) => {
  if (!adultId) 
    throw new Error("No adultId provided.");
  if (!primaryParent)
    throw new Error("No primaryParent provided.");

  return await D1.prepare(familyQuery(primaryParent))
    .bind(adultId)
    .first<familyQueryData>()
    .then((familyTableData) => {
      if (!familyTableData)
        throw new Error(
          "Missing data sourced through the Families Table for ID: " + adultId
        );
      return familyTableData;
    });

}
