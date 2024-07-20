import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";

describe("Cloudflare Environment", async () => {
  let tables = await env.dogsDB
    .prepare('SELECT name FROM sqlite_master WHERE type="table"')
    .bind()
    .raw();
  // Clip off the first three tables, which are always sqlite internal tables.
  tables = tables.slice(3, tables.length);

  test("Should be running inside Miniflare.", async () => {
    const testQuery = await env.dogsDB
      .prepare("SELECT id FROM Dogs LIMIT 1")
      .bind()
      .all();
    expect(testQuery.meta.served_by).toBe("miniflare.db");
  });

  test("Should have D1 database.", () => {
    expect(env).toHaveProperty("dogsDB");
  });

  test("Should have R2 Bucket.", () => {
    expect(env).toHaveProperty("dogImages");
  });

  test.each(tables)("D1 should contain %s", (tb) => {
    expect(tb).toMatchSnapshot();
  });
});
