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
 *
 * @param D1 The database to query.
 * @param litterId The ID of the litter to get data for.  If <'first'> is specified in the type parameter, and the litterId is provided, The first family with that Id is returned.  If <'first'> is specified in the type parameter, and the litterId is not provided, The first family in the database is returned.  If <'all'> is specified in the type parameter, the litterId must be provided. All families will be returned sorted from newest to oldest.
 * @param T The type of data to return. Should be <'first'>, <'all'>, or <never>.
 **/
export async function getMostRecentFamily<T extends FamilyQueryParam = never>(
  D1: D1Database,
  litterId?: string,
): Promise<D<T>> {
  const T = litterId ? "all" : "first";
  if (T === "all") {
    return await D1.prepare(familyQuery(litterId))
      .bind(litterId)
      [T]<D1FQ>()
      .then((res) => {
        if (!res) {
          throw new Error("No family found for litterId: " + litterId);
        }
        return res.results[0] as D<T>;
      });
  }

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
  throw new Error("Invalid Query in getMostRecentFamily");
}

export async function getAllRecentFamilies(D1: D1Database, litterId: string) {
  return await D1.prepare(familyQuery(litterId))
    .bind(litterId)
    .all<D1FQ>()
    .then((res) => {
      if (!res) {
        throw new Error("No family found for litterId: " + litterId);
      }
      return res;
    });
}

export async function getFirstRecentFamily(D1: D1Database, litterId: string) {
  return await D1.prepare(familyQuery(litterId))
    .bind(litterId)
    .first<D1FQ>()
    .then((res) => {
      if (!res) {
        throw new Error("No families found.");
      }
      return res;
    });
}
