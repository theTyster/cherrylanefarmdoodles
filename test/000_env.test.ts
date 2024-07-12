import { env } from "cloudflare:test";
import { R2Object } from "@cloudflare/workers-types";
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
    const expectedTables = [
      ["Group_Photos"],
      ["Headshots_Sm"],
      ["Headshots_Lg"],
      ["Litters"],
      ["Dogs"],
      ["Adults"],
      ["Puppies"],
      ["Families"],
      ["Dog_Group_Photos"],
    ];
    expect(expectedTables).toContainEqual([tb]);
  });
});

describe("D1", async () => {
  const groupPhotos = await env.dogsDB
    .prepare("SELECT * FROM Group_Photos")
    .bind()
    .raw();

  const headshotsSm = await env.dogsDB
    .prepare("SELECT * FROM Headshots_Sm")
    .bind()
    .raw();

  const headshotsLg = await env.dogsDB
    .prepare("SELECT * FROM Headshots_Lg")
    .bind()
    .raw();

  const families = await env.dogsDB
    .prepare("SELECT * FROM Families")
    .bind()
    .raw<number[]>();

  const litters = await env.dogsDB
    .prepare("SELECT * FROM Litters")
    .bind()
    .raw<[number, string, string, ...any]>();

  describe("Photo Data", async () => {
    test("All group photos should be unique.", () => {
      const groupPhotoUrls = groupPhotos.map((photo) => photo[1]);
      const uniquePhotos = new Set(groupPhotoUrls);
      expect(uniquePhotos.size).toBe(groupPhotoUrls.length);
    });

    test("All small headshots should be unique.", () => {
      const headshotUrls = headshotsSm.map((photo) => photo[1]);
      const uniquePhotos = new Set(headshotUrls);
      expect(uniquePhotos.size).toBe(headshotUrls.length);
    });

    test("All large headshots should be unique.", () => {
      const headshotUrls = headshotsLg.map((photo) => photo[1]);
      const uniquePhotos = new Set(headshotUrls);
      expect(uniquePhotos.size).toBe(headshotUrls.length);
    });
  });

  describe("Litters Data", async () => {
    test.each(litters)("Litter ID: %s", (...litter) => {
      expect(litter[0], "ID should be an integer.").toBeTypeOf("number");
      expect(
        new Date(litter[1]),
        "Due date should be a valid date."
      ).toBeInstanceOf(Date);
      expect(
        new Date(litter[2]),
        "Birthday should be a valid date."
      ).toBeInstanceOf(Date);
      if (litter[3])
        expect(
          new Date(litter[3]),
          "Go home date should be a valid date."
        ).toBeInstanceOf(Date);
      if (litter[4]) throw new Error("Litter should only have 4 columns.");
    });

    test("All litters should be unique.", () => {
      const litterValues = litters.map((litter) => litter.slice(1, 4));
      const litterUUIDs = litterValues.map((litter) => litter.join(""));
      const uniqueLitters = new Set(litterUUIDs);
      expect(uniqueLitters.size).toBe(litters.length);
    });
  });

  describe("Families Data", async () => {
    test.each(families)(
      "Family ID: %s",
      (ID, groupPhoto, mother, father, litterId, ...rest) => {
        expect(ID, "ID should be an integer.").toBeTypeOf("number");
        expect(groupPhoto, "Group photo should be an integer.").toBeTypeOf(
          "number"
        );
        expect(mother, "Mother should be an integer.").toBeTypeOf("number");
        expect(father, "Father should be an integer.").toBeTypeOf("number");
        expect(litterId, "Litter ID should be an integer.").toBeTypeOf(
          "number"
        );
        if (rest.length) throw new Error("Family should only have 5 columns.");

        //  "Litter ID should be found in Litters"

        expect(
          litters.some((litter) => litter[0] === litterId),
          "Litter ID should be found in Litters."
        ).toBe(true);
      }
    );

    test("All families should be unique.", () => {
      const familyValues = families.map((family) => family.slice(1, 5));
      const familyUUIDs = familyValues.map((family) => family.join(""));
      const uniqueFamilies = new Set(familyUUIDs);
      expect(uniqueFamilies.size).toBe(families.length);
    });
  });
});

describe("R2", async () => {
  const upload = await env.dogImages.put("test", "test") as R2Object;
  test("Should be able to upload a file.", () => {

    expect(upload).toBeTruthy();
    expect(upload.key).toBeTypeOf("string");
    expect(upload.key).toBe("test");
    expect(upload.size).toBe(4);
  });

  test("Should be able to list files.", async () => {
    const list = await env.dogImages.list();

    expect(list).toBeTruthy();
    expect(list.objects).toBeInstanceOf(Array);
    expect(list.objects.length).toBe(1);
    expect(list.objects[0].key).toBe("test");
  })

  test("Should be able to get metadata for an object.", async () => {
    const meta = await env.dogImages.head("test") as globalThis.R2Object;

    expect(meta).toBeTruthy();
    expect(meta.key).toBeTypeOf("string");
    expect(meta.key).toBe("test");
    expect(meta.size).toBe(4);
  })
});
