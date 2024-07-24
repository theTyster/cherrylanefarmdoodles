import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";

describe("Backend Systems", async () => {
  // R2 Setup {
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

  // }
  // D1 Setup {
  // D1QueryAll Function {
  /**
   * @param table string
   * @returns Promise<D1RawTable<T>>
   */
  const D1QueryAll = async function D1QueryAll<T = [number, string]>(
    table: string
  ) {
    const queryResult = await env.dogsDB
      .prepare(`SELECT * FROM ${table}`)
      .bind()
      .raw();
    return queryResult as D1RawTable<T>;
  };
  // }
  // Group_Photos {
  /**
   * [id, groupPhoto]
   */
  const D1GroupPhotos = await D1QueryAll<D1GroupPhotosRaw[0]>("Group_Photos");
  // }

  // Headshots_Sm {
  /**
   * [id, headshotSmall]
   */
  //const D1HeadshotsSm = await D1QueryAll<D1HeadshotsSmRaw[0]>("Headshots_Sm");
  // }

  // Headshots_Lg {
  /**
   * [id, headshotLarge]
   */
  const D1HeadshotsLg = await D1QueryAll<D1HeadshotsLgRaw[0]>("Headshots_Lg");
  // }

  // Litters {
  /**
   *  [
   *    number, //id
   *    string, //dueDate
   *    string, //birthday
   *    number  //applicantsInQueue
   *  ]
   */
  const D1Litters = await D1QueryAll<D1LittersRaw[0]>("Litters");
  // }

  // Dogs {
  /**
   *  [
   *    number, //id
   *    string, //gender
   *    string, //noseColor
   *    string, //coatColor
   *    string, //personality
   *    number, //headshotSmall
   *    number  //headshotLarge
   *  ]
   */
  const D1Dogs = await D1QueryAll<D1DogsRaw[0]>("Dogs");
  // }

  // Adults {
  /**
   *  [
   *    number,  //id
   *    string,  //adultName
   *    string,  //breeder
   *    string,  //birthday
   *    string,  //eyeColor
   *    boolean, //isRetired
   *    string,  //about
   *    number,  //weight
   *    string,  //energyLevel
   *    number   //dogId
   *  ]
   */
  const D1Adults = await D1QueryAll<D1AdultsRaw[0]>("Adults");
  //}

  // Puppies {
  /**
   *  [
   *    number,  //id
   *    string,  //puppyName
   *    string,  //collarColor
   *    boolean, //isAvailable
   *    number,  //dogId
   *    number   //litterId
   *  ]
   */
  const D1Puppies = await D1QueryAll<D1PuppiesRaw[0]>("Puppies");
  // }

  // Families {
  /**
   *  [
   *    number, //id
   *    number, //groupPhoto
   *    number, //mother
   *    number, //father
   *    number  //litterId
   *  ]
   */
  const D1Families = await D1QueryAll<D1FamiliesRaw[0]>("Families");
  // }

  // Dog To Group Photos{
  /**
   *  [
   *    number, //id
   *    string, //groupPhotoId
   *    number  //dogId
   *  ]
   */
  //const D1DogToGroupPhotos = await D1QueryAll<D1DogToGroupPhotosRaw[0]>("Dog_To_Group_Photos");
  // }
  // }

  describe("R2", () => {
    describe.each(r2Raw)(`%s`, (key, upload) => {
      test(`is uploaded`, () => {
        expect(key, "Did not upload").toBeTruthy();
        expect(key, "Incorrect Key Types").toStrictEqual(expect.any(String));
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
        expect(readText, "Files should be unchanged").toMatchSnapshot();
        expect(meta).toBeTruthy();
        expect(meta.key).toStrictEqual(expect.any(String));
        expect(meta.key).toBe(key);
        expect(meta.etag, "Caching should be strengthened by default.").and.toStrictEqual(expect.any(String));
        expect(meta.httpEtag, "Caching should be strengthened by default.").and.toStrictEqual(expect.any(String));
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
    describe("Litters Data", () => {
      describe.each(D1Litters)(
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
        const litterUUIDs = D1Litters.map((litter) => litter.join(""));
        const uniqueLitters = new Set(litterUUIDs);
        expect(uniqueLitters.size).toBe(D1Litters.length);
      });
    });

    describe("Dogs Data", () => {
      describe.each(D1Dogs)(
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
              D1HeadshotsLg.some((headshot) => headshot[0] === headshotLarge),
              "Large Headshot should be found in Headshots_Lg."
            ).toBe(true);
          });

          test("All dogIDs should be unique.", () => {
            const adultDogsUUID = D1Adults.map((adult) => adult[9]);
            const puppyDogsUUID = D1Puppies.map((puppy) => puppy[4]);
            const uniqueAdults = new Set([...adultDogsUUID]);
            const uniquePuppies = new Set([...puppyDogsUUID]);
            const uniqueDogs = new Set([...uniqueAdults, ...uniquePuppies]);

            expect(
              uniqueAdults.size,
              `dogID's are not unique within the Adult table. Adult IDs: ${adultDogsUUID}`
            ).toBe(D1Adults.length);

            expect(
              uniquePuppies.size,
              `dogID's are not unique within the Puppy table. Puppy IDs: ${puppyDogsUUID}`
            ).toBe(D1Puppies.length);

            expect(
              uniqueDogs.size,
              `dogID's are not unique across both Puppies and Adult tables. Adult and Puppy IDs ${[
                ...adultDogsUUID,
                ...puppyDogsUUID,
              ]}`
            ).toBe(D1Adults.length + D1Puppies.length);
          });

          test(`Headshots_Lg contains: ${
            headshotLarge + "_" + D1HeadshotsLg[headshotLarge - 1][1]
          }`, () => {
            expect(R2.keys).toContain(
              headshotLarge + "_" + D1HeadshotsLg[headshotLarge - 1][1]
            );
          });
        }
      );
    });

    describe("Adults Data", () => {
      describe.each(D1Adults)(
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
            const adultHeadshot = D1HeadshotsLg.find(
              (headshot) => headshot[0] === dogID
            )![1];

            expect(
              adultHeadshot,
              "Adult Name should be in the Headshots_Lg table."
            ).toContain(adultName.replaceAll(/ /g, "-").toLowerCase());
            expect(
              D1Dogs.some((dog) => dog[0] === dogID),
              "Dog ID should be in Dogs Table."
            ).toBe(true);
          });
        }
      );
    });

    describe("Headshots Data", () => {
      describe.each(D1HeadshotsLg)(
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
      describe.each(D1Puppies)(
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
            const puppyHeadshot = D1HeadshotsLg.find(
              (headshot) => headshot[0] === dogID
            )![1];
            if (puppyName)
              expect(
                puppyHeadshot,
                "Puppy name should be in Headshots_Lg."
              ).toContain(puppyName.replaceAll(/ /g, "-").toLowerCase());
            expect(
              D1Dogs.some((dog) => dog[0] === dogID),
              "Dog ID should be found in Dogs."
            ).toBe(true);
            expect(litterID, "Litter ID should be an integer.").toStrictEqual(
              expect.any(Number)
            );
            expect(
              D1Litters.some((litter) => litter[0] === litterID),
              "Litter ID should be found in Litters."
            ).toBe(true);
          });
        }
      );
    });

    describe("Family Data", () => {
      describe.each(D1Families)(
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
              D1Litters.some((litter) => litter[0] === litterID),
              "Litter ID should be found in Litters."
            ).toBe(true);
          });

          test("All group photos should be in R2 Bucket.", () => {
            const groupPhoto = D1GroupPhotos[groupPhotoID - 1]
              .flat(1)
              .join("_");
            expect(R2.keys).toContain(groupPhoto);
          });
        }
      );
      test("All families should be unique.", () => {
        const familyUUIDs = D1Families.map((family) => family.join(""));
        const uniqueFamilies = new Set(familyUUIDs);
        expect(uniqueFamilies.size).toBe(D1Families.length);
      });
    });


    describe("D1 Modifications", () => {
      interface D1ChangesType {
        dogsAfterDeleted?: D1DogsRaw;
        headshotsAfterUpdated?: D1HeadshotsLgRaw;
        dogsAfterUpdated?: D1DogsRaw;
      }
      const D1Changes: D1ChangesType = {};

      describe("Deletes", () => {
        describe("Deleting Dogs", () => {
          test("Should also delete Headshots.", async () => {
            const deleted = await env.dogsDB
              .prepare("DELETE FROM Dogs WHERE id = 1") // Bella
              .bind()
              .all();
            const newDogs = await D1QueryAll<D1DogsRaw[0]>("Dogs");

            D1Changes.dogsAfterDeleted = newDogs;

            expect(deleted.success, "Delete was unsuccessful.").toBe(true);
            expect(D1Changes.dogsAfterDeleted).not.toMatchObject(D1Dogs);
            expect(D1Changes.dogsAfterDeleted[0][0]).not.toBe(1);
            expect
              .soft(D1Changes, "Database structure is unexpected.")
              .toMatchSnapshot();
          });
          test("Should also delete Adults.", async () => {
            const newAdults = await D1QueryAll<D1AdultsRaw[0]>("Adults");

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
            const newDogs = await D1QueryAll<D1DogsRaw[0]>("Dogs");

            D1Changes.dogsAfterDeleted = newDogs;
            expect(deleted.success, "Delete was unsuccessful.").toBe(true);
            expect(D1Changes.dogsAfterDeleted).not.toMatchObject(D1Dogs);
            expect(D1Changes.dogsAfterDeleted[0][0]).not.toBe(3);
          expect
            .soft(D1Changes, "Database structure is unexpected.")
            .toMatchSnapshot();
          });
          test.todo("Deleting mothers and fathers should also delete Families?")
          test.todo("Deleting Puppies should not delete Litters?")
        });
      });
      describe("Updates", () => {
        test("Updating Headshots Should also update Dogs.", async () => {
          const updated = await env.dogsDB
            .prepare("UPDATE Headshots_Lg SET ID = 10 WHERE id = 1")
            .bind()
            .all();

            const newHeadshotsLg = await D1QueryAll<D1HeadshotsLgRaw[0]>("Headshots_Lg");
            const newDogs = await D1QueryAll<D1DogsRaw[0]>("Dogs");

          D1Changes.headshotsAfterUpdated = newHeadshotsLg;
          D1Changes.dogsAfterUpdated = newDogs;

          expect(updated.success).toBe(true);
          expect(D1Changes.headshotsAfterUpdated[7]).not.toMatchObject(
            D1HeadshotsLg[7]
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
});
