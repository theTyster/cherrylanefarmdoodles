// Constants for the constants
import {
  familyQuery,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";

type FamilyQueryParam = "first" | "all" | never;
type D<T extends FamilyQueryParam> = T extends "first"
  ? D1FQ
  : T extends "all"
  ? D1FQ[]
  : never;

/**
 * Gathers all the most recent data for each family unit in the database.
 *
 * A family unit consists of a unique mother and a father for each litter.
 *
 * This query is the entry point for the other queries on the website.
 * After this query is run, we can filter the returned object down to get
 * the data we need for a specific parent, or puppy.
 *
 * Litters are filtered by SQL to simply return the same data but only for
 * the specified litterId.
 *
 * The front page uses the entire object without a litterId filter to display
 * all of the most recent families.
 **/
export async function getMostRecentFamily<T extends FamilyQueryParam = never>(
  D1: D1Database,
  litterId: T extends "first" ? number : T extends "all" ? undefined : never
): Promise<D<T>> {
  const T = litterId ? "first" : "all";
  if (T === "first") {
    return await D1.prepare(familyQuery(litterId))
      .bind(litterId)
      [T]<D1FQ>()
      .then((res) => {
        if (!res) {
          throw new Error("No family found for litterId: " + litterId);
        }
        return res as D<T>;
      });
  }
  if (T === "all") {
    return await D1.prepare(familyQuery(litterId))
      .bind(litterId)
      [T]<D1FQ>()
      .then((res) => {
        if (!res) {
          throw new Error("No family found for litterId: " + litterId);
        }
        return res.results as D<T>;
      });
  }
  throw new Error("Invalid Query in getMostRecentFamily and " + getMostRecentFamily.caller.name);
}
