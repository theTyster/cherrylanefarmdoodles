import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";
import { D1Tables as D1T } from "../../src/constants/data";
import type { D1Schema } from "../../src/types/data";

type D1_TABLES<T> = T extends typeof D1T.Group_Photos
  ? D1Schema[typeof D1T.Group_Photos]
  : T extends typeof D1T.Headshots_Sm
  ? D1Schema[typeof D1T.Headshots_Sm]
  : T extends typeof D1T.Headshots_Lg
  ? D1Schema[typeof D1T.Headshots_Lg]
  : T extends typeof D1T.Litters
  ? D1Schema[typeof D1T.Litters]
  : T extends typeof D1T.Dogs
  ? D1Schema[typeof D1T.Dogs]
  : T extends typeof D1T.Adults
  ? D1Schema[typeof D1T.Adults]
  : T extends typeof D1T.Puppies
  ? D1Schema[typeof D1T.Puppies]
  : T extends typeof D1T.Families
  ? D1Schema[typeof D1T.Families]
  : T extends typeof D1T.Dog_To_Group_Photos
  ? D1Schema[typeof D1T.Dog_To_Group_Photos]
  : never;

describe("Backend Systems", async () => {
  // D1QueryAll Function {
  /**
   * @param @see D1T
   * @returns Promise<D1RawTable<T>>
   */
  async function D1QueryAll<T extends keyof typeof D1T>(query: T) {
    const queryResult = await env.dogsDB
      .prepare(`SELECT * FROM ${query}`)
      .bind()
      .all<D1_TABLES<T>>(/*{ columnNames: true }*/)
      .then((res) => res.results);
    if (queryResult) return queryResult;
    else return queryResult as D1_TABLES<T>[];
  }
  // }

  function D1Setup() {
    const keys: (keyof typeof D1T)[] = Object.keys(D1T) as (keyof typeof D1T)[];
    return keys.map((table) => D1QueryAll<typeof table>(table));
  }

  /**
   * NOTE:
   * Asynchronously collect absolutely everything in the database.
   **/
  const [D1Raw] = await Promise.all([Promise.all(D1Setup())]);

  function* moveThroughD1() {
    for (const table of Object.keys(D1T)) {
      yield table;
    }
  }
  const tableName = moveThroughD1();

  type TestD1Type = {
    [D1T.Group_Photos]: D1Schema[typeof D1T.Group_Photos][];
    [D1T.Headshots_Sm]: D1Schema[typeof D1T.Headshots_Sm][];
    [D1T.Headshots_Lg]: D1Schema[typeof D1T.Headshots_Lg][];
    [D1T.Litters]: D1Schema[typeof D1T.Litters][];
    [D1T.Dogs]: D1Schema[typeof D1T.Dogs][];
    [D1T.Adults]: D1Schema[typeof D1T.Adults][];
    [D1T.Puppies]: D1Schema[typeof D1T.Puppies][];
    [D1T.Families]: D1Schema[typeof D1T.Families][];
    [D1T.Dog_To_Group_Photos]: D1Schema[typeof D1T.Dog_To_Group_Photos][];
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

  /**
   * Tests the Schema of the database for consistency.
   **/
  describe("D1", async () => {
    describe("Litters Data", () => {
      describe.each(D1.Litters)("Litter ID: %#", (litter) => {
        const { id, dueDate, litterBirthday, applicantsInQueue } = litter;

        test("Type Checks", () => {
          expect(id, "ID not an integer.").toStrictEqual(expect.any(Number));
          expect(
            new Date(dueDate ?? ""),
            "Due date not a valid date."
          ).toBeInstanceOf(Date);
          if (litterBirthday)
            expect(
              new Date(litterBirthday),
              "Birthday not a valid date."
            ).toBeInstanceOf(Date);
          expect(
            applicantsInQueue,
            "Applicants can't be negative."
          ).toBeGreaterThanOrEqual(0);
        });
      });

      test("All litters should be unique.", () => {
        const litterUUIDs = D1.Litters.map((litter) => litter.id);
        const uniqueLitters = new Set(litterUUIDs);
        expect(uniqueLitters.size).toBe(D1.Litters.length);
      });
    });

    describe("Dogs Data", () => {
      describe.each(D1.Dogs)("Dog ID: %#", (dogs) => {
        const {
          id,
          gender,
          noseColor,
          coat,
          personality,
          Headshots_Sm,
          Headshots_Lg,
        } = dogs;

        test("Type Checks", () => {
          expect(id, "ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(gender, "Gender should be a string.").toStrictEqual(
            expect.any(String)
          );
          if (noseColor)
            expect(noseColor, "Nose Color should be a string.").toStrictEqual(
              expect.any(String)
            );
          if (coat)
            expect(coat, "Coat Color should be a string.").toStrictEqual(
              expect.any(String)
            );
          if (personality)
            expect(
              personality,
              "Personality should be a string."
            ).toStrictEqual(expect.any(String));
          if (Headshots_Sm)
            expect(
              Headshots_Sm,
              "Small Headshot should be an integer."
            ).toStrictEqual(expect.any(String));
          if (Headshots_Lg) {
            expect(
              Headshots_Lg,
              "Large Headshot should be an integer."
            ).toStrictEqual(expect.any(String));
            expect(
              D1.Headshots_Lg.some(
                (headshot) => headshot.transformUrl === Headshots_Lg
              ),
              "Large Headshot should be found in Headshots_Lg."
            ).toBe(true);
          }
        });

        test("All dogIDs should be unique.", () => {
          const adultDogsUUID = D1.Adults.map((adult) => adult.id);
          const puppyDogsUUID = D1.Puppies.map((puppy) => puppy.id);
          const uniqueAdults = new Set([...adultDogsUUID]);
          const uniquePuppies = new Set([...puppyDogsUUID]);

          expect(
            uniqueAdults.size,
            `dogID's are not unique within the Adult table. Adult IDs: ${adultDogsUUID}`
          ).toBe(D1.Adults.length);

          expect(
            uniquePuppies.size,
            `dogID's are not unique within the Puppy table. Puppy IDs: ${puppyDogsUUID}`
          ).toBe(D1.Puppies.length);
        });
      });
    });

    describe("Adults Data", () => {
      describe.each(D1.Adults)("Adult ID: %#", (adult) => {
        const {
          id,
          adultName,
          breeder,
          adultBirthday,
          eyeColor,
          activityStatus,
          certifications,
          favActivities,
          weight,
          energyLevel,
          dogId,
        } = adult;
        test("Type Checks", () => {
          expect(id, "ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(adultName, "Adult Name should be a string.").toStrictEqual(
            expect.any(String)
          );
          expect(breeder, "Breeder should be a string.").toStrictEqual(
            expect.any(String)
          );
          expect(
            new Date(adultBirthday ?? ""),
            "adultBirthday should be a valid date."
          ).toBeInstanceOf(Date);
          if (eyeColor)
            expect(eyeColor, "Eye Color should be a string.").toStrictEqual(
              expect.any(String)
            );
          if (favActivities)
            expect(
              favActivities,
              "Fav Activities should be a string."
            ).toStrictEqual(expect.any(String));
          expect(
            ["Active", "Retired", "Break"],
            "activityStatus should be a boolean."
          ).toContain(activityStatus);
          if (certifications)
            expect(
              certifications,
              "certification should be a string."
            ).toStrictEqual(expect.any(String));
          if (weight)
            expect(weight, "Weight should be a number.").toStrictEqual(
              expect.any(Number)
            );
          if (energyLevel)
            expect(
              energyLevel,
              "Energy Level should be a string."
            ).toStrictEqual(expect.any(String));
          expect(dogId, "Dog ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
        });

        test(`Foreign Keys`, () => {
          expect(
            D1.Dogs.some((dog) => dog.id === dogId),
            "Dog ID should be in Dogs Table."
          ).toBe(true);
        });
      });
    });

    describe("Headshots Data", () => {
      describe.each(D1.Headshots_Lg)("Headshot %d", (lg) => {
        const { transformUrl } = lg;
        test(`Type Checks`, () => {
          if (transformUrl)
            expect(
              transformUrl,
              "transformUrl should be a string."
            ).toStrictEqual(expect.any(String));
        });
      });
    });

    describe("Puppies Data", () => {
      describe.each(D1.Puppies)("ID: %#", (puppies) => {
        const { id, puppyName, collarColor, availability, dogId, litterId } =
          puppies;
        test("Type Checks", () => {
          expect(id, "ID should be an integer.").toStrictEqual(
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
          if (collarColor)
            expect(
              collarColor,
              "Collar Color should be a string."
            ).toStrictEqual(expect.any(String));
          expect(
            ["Available", "Available Guardian", "Picked", "Adopted"],
            "Is Available should be a boolean."
          ).toContain(availability);
          expect(dogId, "Dog ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(litterId, "Litter ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
        });
      });
    });

    describe("Family Data", () => {
      describe.each(D1.Families)("Family ID: %#", (family) => {
        const { id, Group_Photos, mother, father, litterId } = family;
        test("Type Checks", () => {
          expect(id, "ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          if (Group_Photos)
            expect(
              Group_Photos,
              "Group photo should be a string."
            ).toStrictEqual(expect.any(String));
          expect(mother, "Mother should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(father, "Father should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(litterId, "Litter ID should be an integer.").toStrictEqual(
            expect.any(Number)
          );
          expect(
            D1.Litters.some((litter) => litter.id === litterId),
            "Litter ID should be found in Litters."
          ).toBe(true);
        });

        //        test.runIf(Group_Photos)(
        //          "All group photos should be in R2 Bucket.",
        //          () => {
        //            expect(
        //              R2.keys,
        //              `R2 doesn't contain an image for ${Group_Photos}.`
        //            ).toContain(
        //              D1.Group_Photos.find(
        //                (photo) => photo.transformUrl === Group_Photos
        //              )
        //            );
        //          }
        //        );
      });
      test("All families should be unique.", () => {
        const familyUUIDs = D1.Families.map((family) => family.id);
        const uniqueFamilies = new Set(familyUUIDs);
        expect(uniqueFamilies.size).toBe(D1.Families.length);
      });
    });

    describe("D1 Modifications", () => {
      interface D1ChangesType {
        dogsAfterDeleted?: D1Schema["Dogs"][];
        headshotsAfterUpdated?: D1Schema["Headshots_Lg"][];
        dogsAfterUpdated?: D1Schema["Dogs"][];
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
        });
      });
      describe("Updates", () => {
        test("Updating Headshots Should also update Dogs.", async () => {
          const updated = await env.dogsDB
            .prepare(
              "UPDATE Headshots_Lg SET transformUrl = 'new' WHERE transformUrl = ?"
            )
            .bind(D1.Headshots_Lg[7].transformUrl)
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
            D1Changes.dogsAfterUpdated.some(
              (dog) => dog.Headshots_Lg === "new"
            ),
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
