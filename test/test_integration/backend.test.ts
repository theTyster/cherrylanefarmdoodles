import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";
import { D1Tables } from "../../src/constants/data";

type D1_TABLES<T> = T extends typeof D1Tables.Group_Photos
  ? D1GroupPhotos
  : T extends typeof D1Tables.Headshots_Sm
  ? D1HeadshotsSm
  : T extends typeof D1Tables.Headshots_Lg
  ? D1HeadshotsLg
  : T extends typeof D1Tables.Litters
  ? D1Litters
  : T extends typeof D1Tables.Dogs
  ? D1Dogs
  : T extends typeof D1Tables.Adults
  ? D1Adults
  : T extends typeof D1Tables.Puppies
  ? D1Puppies
  : T extends typeof D1Tables.Families
  ? D1Families
  : T extends typeof D1Tables.Dog_To_Group_Photos
  ? D1DogToGroupPhotos
  : never;

describe("Backend Systems", async () => {
  // D1QueryAll Function {
  /**
   * @param @see D1Tables
   * @returns Promise<D1RawTable<T>>
   */
  async function D1QueryAll<T extends D1Tables>(query: T) {
    const queryResult = await env.dogsDB
      .prepare(`SELECT * FROM ${query}`)
      .bind()
      .raw<D1_TABLES<T>>(/*{ columnNames: true }*/);
    if (queryResult) return queryResult;
    else return queryResult as D1_TABLES<T>[];
  }
  // }

  function R2Setup() {
    return Object.keys(env.TEST_IMAGES).map((file: string) => {
      return env.dogImages.put(file, env.TEST_IMAGES[file]);
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
  };

  const D1 = D1Raw.reduce(function getNewD1(
    newD1: (Record<string, unknown> & TestD1Type) | Record<string, never>,
    table
  ) {
    const key = tableName.next().value as string;
    newD1[key] = table;
    return newD1;
  },
  {}) as TestD1Type;

  const R2BuildingInProgress = {
    uploads: R2Raw.reduce(function getNewR2(newR2: Record<string, R2Object>, upload:R2Object | null | undefined) {
      if (!upload) return newR2;
      newR2[upload.key] = upload;
      return newR2;
    }, {}),
    keys: Object.keys(env.TEST_IMAGES),
  };

  const offsiteTestPicMocks = [
    "hashed_Chili_Sm",
    "hashed_Bandit_Sm",
    "hashed_Bluey_Sm",
    "hashed_Bingo_Sm",
    "hashed_Chili",
    "hashed_Bandit",
    "hashed_Bluey",
    "hashed_Bingo",
    "hashed_Old1",
    "hashed_Old2",
    "Not shown in front end",
    "The Heelers",
  ];

  const offsiteTestPicMockR2Object = offsiteTestPicMocks.reduce((mock: Record<string, R2Object>, hash: R2Object | string) => {
    mock[hash as string] = (hash as R2Object);
    return mock;
  }, {} as Record<string, R2Object>);

  // Adds offsite test pictures to the R2 object.
  const R2 = {
    keys: [

      ...R2BuildingInProgress.keys,
      ...offsiteTestPicMocks,
    ],
    uploads: {
      ...R2BuildingInProgress.uploads,
      ...offsiteTestPicMockR2Object,
    },
  }
  describe("R2", () => {
    describe.each(R2.keys)("%s", (key) => {
      test("is uploaded", () => {
        expect(key, "Did not upload").toBeTruthy();
        expect(key, "Incorrect Key Types").toStrictEqual(expect.any(String));
      });

      test.skipIf(offsiteTestPicMocks.some(hash => key === hash))("is readable", async () => {
        const read = await env.dogImages.get(key);
        const meta = await env.dogImages.head(key);
        if (!read) throw new Error(`${key} not found in R2 Bucket`);
        if (!meta) throw new Error(`No meta information found for ${key}`);

        const readText = await read.text(); // Must consume the body or the test will hang/fail.

        expect(readText).toBeTruthy();
        expect(
          readText,
          "Files in R2 Bucket do not match the uploads object"
        ).toBe(env.TEST_IMAGES[key]);
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
        R2.keys.length - offsiteTestPicMocks.length
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
              ).toStrictEqual(expect.any(String));
            expect(
              headshotLarge,
              "Large Headshot should be an integer."
            ).toStrictEqual(expect.any(String));
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

          test(`Headshots_Lg contains`, () => {
            expect(R2.keys).toContain(
              D1.Headshots_Lg.find((photo) => photo[0] === headshotLarge)![1]
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
          headshotUrl,
          /**Index: 1*/
          hash //
        ) => {
          test(`Type Checks`, () => {
            expect(headshotUrl, "ID should be a string.").toStrictEqual(
              expect.any(String)
            );
            expect(hash, "Headshot Name should be a string.").toStrictEqual(
              expect.any(String)
            );
          });

          test(`Is in R2 as: ${hash}`, () => {
            expect(R2.keys).toContain(hash);
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
              "Group photo should be a string."
            ).toStrictEqual(expect.any(String));
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

          test.runIf(groupPhotoID)(
            "All group photos should be in R2 Bucket.",
            () => {
              expect(
                R2.keys,
                `R2 doesn't contain an image for ${groupPhotoID}.`
              ).toContain(
                D1.Group_Photos.find((photo) => photo[0] === groupPhotoID)![1]
              );
            }
          );
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
            expect(D1Changes.dogsAfterDeleted[0]).not.toBe(1);
            expect
              .soft(D1Changes, "Database structure is unexpected.")
              .toMatchSnapshot();
          });
          test("Should also delete Adults.", async () => {
            const newAdults = await D1QueryAll("Adults");

            expect(newAdults[9], "Adult should have been deleted.").not.toBe(1);
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
            expect(D1Changes.dogsAfterDeleted[0]).not.toBe(3);
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
            .prepare(
              "UPDATE Headshots_Lg SET transformUrl = 'new' WHERE transformUrl = ?"
            )
            .bind(D1.Headshots_Lg[7][0])
            .all();

          const newHeadshotsLg = await D1QueryAll("Headshots_Lg");
          const newDogs = await D1QueryAll("Dogs");

          D1Changes.headshotsAfterUpdated = newHeadshotsLg;
          D1Changes.dogsAfterUpdated = newDogs;

          expect(updated.success).toBe(true);
          expect(
            D1Changes.headshotsAfterUpdated[7],
            `\n${D1Changes.headshotsAfterUpdated[7]} \nis the same as\n${D1.Headshots_Lg[7]}`
          ).not.toMatchObject(D1.Headshots_Lg[7]);
          expect(updated.meta.rows_written).toBeGreaterThan(1);
          expect(
            D1Changes.dogsAfterUpdated.some((dog) => dog[6] === "new"),
            `${D1Changes.dogsAfterUpdated.join("\n")}\n\ndoes not contain 'new'`
          ).toBe(true);
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
