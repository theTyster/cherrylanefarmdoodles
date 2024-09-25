// Constants for the constants
import {
  familyQuery,
  type D1FamilyQueryData as D1FQ,
} from "@/constants/queries";
import fetchDataWithCache from "@/constants/caching";

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
 * @param litterId The ID of the litter to get data for.
 **/
export async function getAllRecentFamilies(D1: D1Database) {
  return await fetchDataWithCache(
    "all-families__familyQuery",
    async () =>
      await D1.prepare(familyQuery())
        .bind()
        .all<D1FQ>()
        .then((res) => {
          if (!res) {
            throw new Error("No families found. 💀");
          }
          return res.results;
        })
  );
}

/**
 * Gathers the most recent data for the family specified with the Id.
 *
 * A family unit consists of a unique mother and a father for each litter.
 *
 * This query is the entry point for most single page content on the website.
 * After this query is run, we can filter the returned object down to get
 * the data we need for a specific parent, or puppy.
 *
 * @param D1 The database to query.
 * @param litterId The ID of the litter to get data for.
 **/
export async function getFirstRecentFamily(D1: D1Database, litterId: string) {
  return fetchDataWithCache(
    "first-family__" + litterId + "__familyQuery",
    async () => {
      return await D1.prepare(familyQuery(litterId))
        .bind(litterId)
        .first<D1FQ>()
        .then((res) => {
          if (!res) {
            throw new Error("No families found.");
          }
          return res;
        });
    });
}
