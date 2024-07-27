import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";
import { D1Tables } from "../../src/utils";


describe("Backend Systems", async () => {
  // D1QueryAll Function {
  /**
   * @param @see D1Tables
   * @returns Promise<D1RawTable<T>>
   */
  async function D1QueryAll<T extends D1Tables>(query: T ){

    const queryResult = await env.dogsDB
      .prepare(`SELECT * FROM ${query}`)
      .bind()
      .raw<D1_TABLES<T>>(/*{ columnNames: true }*/);
    if (queryResult) return queryResult;
    else return queryResult as D1_TABLES<T>[];
  }
  // }

  function R2Setup() {
    return Object.keys(env.R2_TEST_FILES).map((file: string) => {
      const res = env.dogImages.put(file, env.R2_TEST_FILES[file]);
      if (res) return res;
    });
  }

  function D1Setup() {
    const keys = Object.keys(D1Tables) as D1Tables[];
    return keys.map((table) => D1QueryAll(table));
  }

  const [R2Raw, D1Raw] = await Promise.all([
    Promise.all(R2Setup()),
    Promise.all(D1Setup()),
  ]);

  function* moveThroughD1() {
    for (const table of Object.keys(D1Tables)) {
      yield table;
    }
  }
  const tableName = moveThroughD1();

  type TestD1Type = {
    [P in D1Tables]: D1_TABLES<P>[];
  }

  const D1 = D1Raw.reduce(function getNewD1(newD1: Record<string, unknown> & TestD1Type | Record<string, never>, table) {
    const key = tableName.next().value as string;
    newD1[key] = table;
    return newD1;
  }, {}) as TestD1Type;

  const R2 = {
    uploads: R2Raw.reduce(function getNewR2(newR2, upload) {
      newR2[upload.key] = upload;
      return newR2;
    }, {}),
    keys: Object.keys(env.R2_TEST_FILES),
  };

  describe("R2", () => {
    describe.each(R2.keys)('%s', (key) => {
      test('is uploaded', () => {
        expect(key, "Did not upload").toBeTruthy();
        expect(key, "Incorrect Key Types").toStrictEqual(
          expect.any(String)
        );
      });

      test('is readable', async () => {
        const read = await env.dogImages.get(key);
        const meta = await env.dogImages.head(key);
        if (!read) throw new Error(`${key} not found in R2 Bucket`);
        if (!meta)
          throw new Error(`No meta information found for ${key}`);

        const readText = await read.text(); // Must consume the body or the test will hang/fail.

        expect(readText).toBeTruthy();
        expect(
          readText,
          "Files in R2 Bucket do not match the uploads object"
        ).toBe(env.R2_TEST_FILES[key]);
        expect(readText, "Files should be unchanged").toMatchSnapshot();
        expect(meta).toBeTruthy();
        expect(meta.key).toStrictEqual(expect.any(String));
        expect(meta.key).toBe(key);
        expect(
          meta.etag,
          "Caching should be strengthened by default."
        ).and.toStrictEqual(expect.any(String));
        expect(
          meta.httpEtag,
          "Caching should be strengthened by default."
        ).and.toStrictEqual(expect.any(String));
      });
    });

    test("List all files in R2 Bucket.", async () => {
      const list = await env.dogImages.list();

      expect(list).toBeTruthy();
      expect(list.objects).toBeInstanceOf(Array);
      expect(list.objects.length, "Not listing all uploads").toBe(
        R2.keys.length
      );
    });

    describe("Check for extra files.", async () => {
      const allD1Photos = [
        ...D1.Group_Photos,
        ...D1.Headshots_Lg,
        ...D1.Headshots_Sm,
      ].map((data) => data[0] + "_" + data[1]);
      let hasExtraFiles = false;

      /**Accounts for potential duplicates that may be in Prod.*/
      test("R2 should have 1/3rd more photo entries than D1", () => {
        expect(R2.keys.length).toEqual(R2Raw.length);
        expect
          .soft(
            R2Raw.length,
            `R2 has ${
              R2Raw.length - R2Raw.length / 3
            } real photos, but D1 has ${allD1Photos.length}.`
          )
          .toEqual(allD1Photos.length + R2Raw.length / 3);
        if (R2Raw.length !== allD1Photos.length) hasExtraFiles = true;
      });
      test.skipIf(hasExtraFiles).each(allD1Photos)(
        "Checking whether D1 object '%s' is in R2.",
        (D1) => {
          expect(R2.keys, `R2 does not contain ${D1}`).toContain(D1);
        }
      );
    });
  });

  describe("D1", async () => {
    describe("Litters Data", () => {
      describe.each(D1.Litters)(
        "Litter ID: %s",
        (
          /*0*/ ID, //
          /*1*/ dueDate, //
          /*2*/ birthday, //
          /*3*/ applicantsInQueue //
        ) => {
          test("Type Checks", () => {
            expect(ID, "ID not an integer.").toStrictEqual(expect.any(Number));
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
        const litterUUIDs = D1.Litters.map((litter) => litter.join(""));
        const uniqueLitters = new Set(litterUUIDs);
        expect(uniqueLitters.size).toBe(D1.Litters.length);
      });
    });

    describe("Dogs Data", () => {
      describe.each(D1.Dogs)(
        "Dog ID: %s",
        (
          /*0*/ ID, //
          /*1*/ gender, //
          /*2*/ noseColor, //
          /*3*/ coatColor, //
          /*4*/ personality, //
          /*5*/ headshotSmall, //
          /*6*/ headshotLarge //
        ) => {
          test("Type Checks", () => {
            expect(ID, "ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(gender, "Gender should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(noseColor, "Nose Color should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(coatColor, "Coat Color should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(
              personality,
              "Personality should be a string."
            ).toStrictEqual(expect.any(String));
            if (headshotSmall)
              expect(
                headshotSmall,
                "Small Headshot should be an integer."
              ).toStrictEqual(expect.any(Number));
            expect(
              headshotLarge,
              "Large Headshot should be an integer."
            ).toStrictEqual(expect.any(Number));
            expect(
              D1.Headshots_Lg.some((headshot) => headshot[0] === headshotLarge),
              "Large Headshot should be found in Headshots_Lg."
            ).toBe(true);
          });

          test("All dogIDs should be unique.", () => {
            const adultDogsUUID = D1.Adults.map((adult) => adult[9]);
            const puppyDogsUUID = D1.Puppies.map((puppy) => puppy[4]);
            const uniqueAdults = new Set([...adultDogsUUID]);
            const uniquePuppies = new Set([...puppyDogsUUID]);
            const uniqueDogs = new Set([...uniqueAdults, ...uniquePuppies]);

            expect(
              uniqueAdults.size,
              `dogID's are not unique within the Adult table. Adult IDs: ${adultDogsUUID}`
            ).toBe(D1.Adults.length);

            expect(
              uniquePuppies.size,
              `dogID's are not unique within the Puppy table. Puppy IDs: ${puppyDogsUUID}`
            ).toBe(D1.Puppies.length);

            expect(
              uniqueDogs.size,
              `dogID's are not unique across both Puppies and Adult tables. Adult and Puppy IDs ${[
                ...adultDogsUUID,
                ...puppyDogsUUID,
              ]}`
            ).toBe(D1.Adults.length + D1.Puppies.length);
          });

          test(`Headshots_Lg contains: ${
            headshotLarge + "_" + D1.Headshots_Lg[headshotLarge - 1][1]
          }`, () => {
            expect(R2.keys).toContain(
              headshotLarge + "_" + D1.Headshots_Lg[headshotLarge - 1][1]
            );
          });
        }
      );
    });

    describe("Adults Data", () => {
      describe.each(D1.Adults)(
        "Adult ID: %s, Name: %s",
        (
          /**Index: 0*/
          ID,
          /**Index: 1*/
          adultName,
          /**Index: 2*/
          breeder,
          /**Index: 3*/
          birthday,
          /**Index: 4*/
          eyeColor,
          /**Index: 5*/
          isRetired,
          /**Index: 6*/
          about,
          /**Index: 7*/
          weight,
          /**Index: 8*/
          energyLevel,
          /**Index: 9*/
          dogID //
        ) => {
          test("Type Checks", () => {
            expect(ID, "ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(adultName, "Adult Name should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(breeder, "Breeder should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(
              new Date(birthday),
              "Birthday should be a valid date."
            ).toBeInstanceOf(Date);
            expect(eyeColor, "Eye Color should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect([0, 1], "Is Retired should be a boolean.").toContain(
              isRetired
            );
            expect(about, "About should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(weight, "Weight should be a number.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              energyLevel,
              "Energy Level should be a string."
            ).toStrictEqual(expect.any(String));
            expect(dogID, "Dog ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
          });

          test(`Foreign Keys`, () => {
            const adultHeadshot = D1.Headshots_Lg.find(
              (headshot) => headshot[0] === dogID
            )![1];

            expect(
              adultHeadshot,
              "Adult Name should be in the Headshots_Lg table."
            ).toContain(adultName.replaceAll(/ /g, "-").toLowerCase());
            expect(
              D1.Dogs.some((dog) => dog[0] === dogID),
              "Dog ID should be in Dogs Table."
            ).toBe(true);
          });
        }
      );
    });

    describe("Headshots Data", () => {
      describe.each(D1.Headshots_Lg)(
        "Headshot %d",
        (
          /**Index: 0*/
          ID,
          /**Index: 1*/
          headshotName //
        ) => {
          test(`Type Checks`, () => {
            expect(ID, "ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              headshotName,
              "Headshot Name should be a string."
            ).toStrictEqual(expect.any(String));
          });

          test(`Is in R2 as: ${ID}_${headshotName}`, () => {
            expect(R2.keys).toContain(ID + "_" + headshotName);
          });
        }
      );
    });

    describe("Puppies Data", () => {
      describe.each(D1.Puppies)(
        "ID: %s, Name: %s",
        (
          /**Index: 0*/
          ID,
          /**Index: 1*/
          puppyName,
          /**Index: 2*/
          collarColor,
          /**Index: 3*/
          isAvailable,
          /**Index: 4*/
          dogID,
          /**Index: 5*/
          litterID //
        ) => {
          test("Type Checks", () => {
            expect(ID, "ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            if (puppyName) {
              expect(puppyName, "Puppy Name should be a string.").toStrictEqual(
                expect.any(String)
              );
            } else {
              expect(
                puppyName,
                "Puppy Name should either be a string or null."
              ).toBeNull();
            }
            expect(
              collarColor,
              "Collar Color should be a string."
            ).toStrictEqual(expect.any(String));
            expect([0, 1], "Is Available should be a boolean.").toContain(
              isAvailable
            );
            expect(dogID, "Dog ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
          });

          test("Foreign Keys", () => {
            const puppyHeadshot = D1.Headshots_Lg.find(
              (headshot) => headshot[0] === dogID
            )![1];
            if (puppyName)
              expect(
                puppyHeadshot,
                "Puppy name should be in Headshots_Lg."
              ).toContain(puppyName.replaceAll(/ /g, "-").toLowerCase());
            expect(
              D1.Dogs.some((dog) => dog[0] === dogID),
              "Dog ID should be found in Dogs."
            ).toBe(true);
            expect(litterID, "Litter ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              D1.Litters.some((litter) => litter[0] === litterID),
              "Litter ID should be found in Litters."
            ).toBe(true);
          });
        }
      );
    });

    describe("Family Data", () => {
      describe.each(D1.Families)(
        "Family ID: %s",
        (
          /**Index: 0*/
          ID,
          /**Index: 1*/
          groupPhotoID,
          /**Index: 2*/
          motherID,
          /**Index: 3*/
          fatherID, //
          /**Index: 4*/
          litterID //
        ) => {
          test("Type Checks", () => {
            expect(ID, "ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              groupPhotoID,
              "Group photo should be an integer."
            ).toStrictEqual(expect.any(Number));
            expect(motherID, "Mother should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(fatherID, "Father should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(litterID, "Litter ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              D1.Litters.some((litter) => litter[0] === litterID),
              "Litter ID should be found in Litters."
            ).toBe(true);
          });

          test("All group photos should be in R2 Bucket.", () => {
            const groupPhoto = D1.Group_Photos[groupPhotoID - 1]
              .flat()
              .join("_");
            expect(
              R2.keys,
              `R2 doesn't contain an image named ${groupPhoto}`
            ).toContain(groupPhoto);
          });
        }
      );
      test("All families should be unique.", () => {
        const familyUUIDs = D1.Families.map((family) => family.join(""));
        const uniqueFamilies = new Set(familyUUIDs);
        expect(uniqueFamilies.size).toBe(D1.Families.length);
      });
    });

    describe("D1 Modifications", () => {
      interface D1ChangesType {
        dogsAfterDeleted?: D1Dogs[];
        headshotsAfterUpdated?: D1HeadshotsLg[];
        dogsAfterUpdated?: D1Dogs[];
      }
      const D1Changes: D1ChangesType = {};

      describe("Deletes", () => {
        describe("Deleting Dogs", () => {
          test("Should also delete Headshots.", async () => {
            const deleted = await env.dogsDB
              .prepare("DELETE FROM Dogs WHERE id = 1") // Bella
              .bind()
              .all();
            const newDogs = await D1QueryAll("Dogs");

            D1Changes.dogsAfterDeleted = newDogs;

            expect(deleted.success, "Delete was unsuccessful.").toBe(true);
            expect(D1Changes.dogsAfterDeleted).not.toMatchObject(D1.Dogs);
            expect(D1Changes.dogsAfterDeleted[0][0]).not.toBe(1);
            expect
              .soft(D1Changes, "Database structure is unexpected.")
              .toMatchSnapshot();
          });
          test("Should also delete Adults.", async () => {
            const newAdults = await D1QueryAll("Adults");

            expect(newAdults[0][9], "Adult should have been deleted.").not.toBe(
              1
            );
            expect
              .soft(D1Changes, "Database structure is unexpected.")
              .toMatchSnapshot();
          });
          test("Should also delete Puppies.", async () => {
            const deleted = await env.dogsDB
              .prepare("DELETE FROM Dogs WHERE id = 3") // lil-blue
              .bind()
              .all();
            const newDogs = await D1QueryAll("Dogs");

            D1Changes.dogsAfterDeleted = newDogs;
            expect(deleted.success, "Delete was unsuccessful.").toBe(true);
            expect(D1Changes.dogsAfterDeleted).not.toMatchObject(D1.Dogs);
            expect(D1Changes.dogsAfterDeleted[0][0]).not.toBe(3);
            expect
              .soft(D1Changes, "Database structure is unexpected.")
              .toMatchSnapshot();
          });
          test.todo(
            "Deleting mothers and fathers should also delete Families?"
          );
          test.todo("Deleting Puppies should not delete Litters?");
        });
      });
      describe("Updates", () => {
        test("Updating Headshots Should also update Dogs.", async () => {
          const updated = await env.dogsDB
            .prepare("UPDATE Headshots_Lg SET ID = 10 WHERE id = 1")
            .bind()
            .all();

          const newHeadshotsLg = await D1QueryAll(
            "Headshots_Lg"
          );
          const newDogs = await D1QueryAll("Dogs");

          D1Changes.headshotsAfterUpdated = newHeadshotsLg;
          D1Changes.dogsAfterUpdated = newDogs;

          expect(updated.success).toBe(true);
          expect(D1Changes.headshotsAfterUpdated[7]).not.toMatchObject(
            D1.Headshots_Lg[7]
          );
          expect(
            D1Changes.dogsAfterUpdated[0][6],
            "Should change should have cascaded into Dogs."
          ).toBe(10);
          expect
            .soft(D1Changes, "Database structure is unexpected.")
            .toMatchSnapshot();
        });
      });
    });
  });
  test("Only nothing", () => {
    expect(true).toBe(true);
  });
});
