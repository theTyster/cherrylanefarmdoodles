import { getRequestContext } from "@cloudflare/next-on-pages";
// KV Binding: __NEXT_ON_PAGES__KV_SUSPENSE_CACHE

const CACHE_EXPIRATION_TTL = 8 * 60 * 60; // 8 hours in seconds

type FetchFromDB<T> = () => Promise<T>;

export default async function fetchDataWithCache<T>(
  key: string,
  fetchFromDB: FetchFromDB<T>
): Promise<T> {
  const KV = getRequestContext().env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE;

  if (!KV) {
    console.log("KV is not available. Fetching data from the database.");
    return await fetchFromDB();
  }

  // Step 1: Check if data is already cached
  const cachedData = await KV.get(key);

  if (cachedData) {
    // Step 2: If cached data is found, return it
    return JSON.parse(cachedData);
  }

  // Step 3: Fetch data from the database
  const data = await fetchFromDB();

  // Step 4: Cache the data in KV for 8 hours
  try {
    await KV.put(key, JSON.stringify(data), {
      expirationTtl: CACHE_EXPIRATION_TTL, // 8 hours TTL
    });
  } catch (e) {
    console.error(e);
  }

  // Step 5: Return the freshly fetched data
  return data;
}
