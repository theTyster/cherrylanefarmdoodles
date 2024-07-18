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

describe("Backend Systems", async () => {
  const R2 = {
    //type TestR2 = keyof typeof R2; << May need this one day?
    uploads: (await Promise.all(
      Object.keys(env.R2_TEST_FILES).map((file: string) => {
        const res = env.dogImages.put(file, env.R2_TEST_FILES[file]);
        if (res) return res;
      })
    )) as R2Object[],
    keys: Object.keys(env.R2_TEST_FILES),
  } as const;

  const r2Raw = R2.uploads.reduce((acc: [string, R2Object][], cur) => {
    const secondDimension: [string, R2Object] = [cur.key, cur];
    acc.push(secondDimension);
    return acc;
  }, []);

  describe("R2", () => {
    describe.each(r2Raw)(`%s`, (key, upload) => {
      test(`is uploaded`, () => {
        expect(key, "Did not upload").toBeTruthy();
        expect(key, "Incorrect Key Types").toBeTypeOf("string");
        expect(key, "Incorrect Keys").toContain(upload.key);
      });

      test(`is readable`, async () => {
        const read = await env.dogImages.get(key);
        const meta = await env.dogImages.head(key);
        if (!read) throw new Error(`${key} not found in R2 Bucket`);
        if (!meta) throw new Error(`No meta information found for ${key}`);

        const readText = await read.text(); // Must consume the body or the test will hang/fail.

        expect(readText).toBeTruthy();
        expect(
          readText,
          "Files in R2 Bucket do not match the uploads object"
        ).toBe(env.R2_TEST_FILES[key]);

        expect(meta).toBeTruthy();
        expect(meta.key).toBeTypeOf("string");
        expect(meta.key).toBe(key);
      });
    });

    test("List all files in R2 Bucket.", async () => {
      const list = await env.dogImages.list();

      expect(list).toBeTruthy();
      expect(list.objects).toBeInstanceOf(Array);
      expect(list.objects.length, "Not listing all uploads").toBe(
        R2.uploads.length
      );
    });
  });

  describe("D1", async () => {
    // Group_Photos {
    const D1GroupPhotos = (await env.dogsDB
      .prepare("SELECT * FROM Group_Photos")
      .bind()
      .raw()) as D1GroupPhotosRaw;
    // }

    // Headshots_Sm {
    const D1HeadshotsSm = (await env.dogsDB
      .prepare("SELECT * FROM Headshots_Sm")
      .bind()
      .raw()) as D1HeadshotsSmRaw;
    // }

    // Headshots_Lg {
    const D1HeadshotsLg = (await env.dogsDB
      .prepare("SELECT * FROM Headshots_Lg")
      .bind()
      .raw()) as D1HeadshotsLgRaw;
    // }

    // Litters {
    const D1Litters = (await env.dogsDB
      .prepare("SELECT * FROM Litters")
      .bind()
      .raw()) as D1LittersRaw;
    // }

    // Dogs {
    const D1Dogs = (await env.dogsDB
      .prepare("SELECT * FROM Dogs")
      .bind()
      .raw()) as D1DogsRaw;
    // }

    // Adults {
    //    const D1Adults = (await env.dogsDB
    //      .prepare("SELECT * FROM Adults")
    //      .bind()
    //      .raw()) as D1AdultsRaw;
    //
    //    const D1Puppies = (await env.dogsDB
    //      .prepare("SELECT * FROM Puppies")
    //      .bind()
    //      .raw()) as D1PuppiesRaw;
    // }

    // Families {
    const D1Families = (await env.dogsDB
      .prepare("SELECT * FROM Families")
      .bind()
      .raw()) as D1FamiliesRaw;
    // }

    // Group Photos{
    //    const D1DogToGroupPhotos = (await env.dogsDB
    //      .prepare("SELECT * FROM Dog_To_Group_Photos")
    //      .bind()
    //      .raw()) as D1DogToGroupPhotosRaw;
    // }

    describe("Litters Data", () => {
      describe.each(D1Litters)(
        "Litter ID: %s",
        (ID, dueDate, birthday, applicantsInQueue) => {
          test(`Row: ${ID}`, () => {
            expect(ID, "ID not an integer.").toBeTypeOf("number");
            expect(
              new Date(dueDate),
              "Due date not a valid date."
            ).toBeInstanceOf(Date);
            if (birthday)
              expect(
                new Date(birthday),
                "Birthday not a valid date."
              ).toBeInstanceOf(Date);
            expect(
              applicantsInQueue,
              "Applicants can't be negative."
            ).toBeGreaterThanOrEqual(0);
          });
        }
      );

      test("All litters should be unique.", () => {
        const litterUUIDs = D1Litters.map((litter) => litter.join(""));
        const uniqueLitters = new Set(litterUUIDs);
        expect(uniqueLitters.size).toBe(D1Litters.length);
      });
    });

    describe("Dogs Data", () => {
      describe.each(D1Dogs)("Dog ID: %s", (...rest) => {
        const largeHeadshotID = rest[6];

        test(`Has Large Headshot: ${
          largeHeadshotID + "_" + D1HeadshotsLg[largeHeadshotID - 1][1]
        }`, () => {
          expect(R2.keys).toContain(
            largeHeadshotID + "_" + D1HeadshotsLg[largeHeadshotID - 1][1]
          );
        });
      });
    });

    describe("Family Data", () => {
      describe.each(D1Families)(
        "Family ID: %s",
        (ID, groupPhotoID, motherID, fatherID, litterID) => {
          test("All group photos should be in R2 Bucket.", () => {
            const groupPhoto = D1GroupPhotos[groupPhotoID - 1]
              .flat(1)
              .join("_");
            expect(R2.keys).toContain(groupPhoto);
          });
          test(`Row: ${ID}`, () => {
            expect(ID, "ID should be an integer.").toBeTypeOf("number");
            expect(
              groupPhotoID,
              "Group photo should be an integer."
            ).toBeTypeOf("number");
            expect(motherID, "Mother should be an integer.").toBeTypeOf(
              "number"
            );
            expect(fatherID, "Father should be an integer.").toBeTypeOf(
              "number"
            );
            expect(litterID, "Litter ID should be an integer.").toBeTypeOf(
              "number"
            );
            expect(
              D1Litters.some((litter) => litter[0] === litterID),
              "Litter ID should be found in Litters."
            ).toBe(true);
          });
        }
      );
    });

    test("All families should be unique.", () => {
      const familyUUIDs = D1Families.map((family) => family.join(""));
      const uniqueFamilies = new Set(familyUUIDs);
      expect(uniqueFamilies.size).toBe(D1Families.length);
    });
  });
});
