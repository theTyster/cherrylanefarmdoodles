import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import DateCalculator from "@/constants/dates";

export const MENU_STATES = {
  Initial: "Initial",
  Mothers: "Mothers",
  Litters: "Litters",
} as const;
export type MenuStateTypes = (typeof MENU_STATES)[keyof typeof MENU_STATES];
export type MenuItemData = { name: string; id: number; Headshots_Sm: string }[];

export type MenuDataType = {
  motherData: MenuItemData;
  litterData: MenuItemData;
};
export type D1LitterMenuData = {
  id: number;
  mother: string;
  Headshots_Sm: string;
  mostRecentDate: string;
};
export type D1MotherMenuData = {
  id: number;
  adultName: string;
  Headshots_Sm: string;
};

export default class MenuData {
  D1?: D1Database;

  constructor(D1: D1Database) {
    this.D1 = D1;
  }

  async #menuData(): Promise<MenuDataType> {
    if (!this.D1) throw new Error("D1 not found");
    const [motherMenuD1Data, litterMenuD1Data] = await Promise.all([
      this.D1.prepare(this.getAdultQuery({ adult: G.mother }))
        .all<D1MotherMenuData>()
        .then((data) => {
          if (data) return data.results;
          throw new Error("No data found.");
        }),
      this.D1.prepare(this.getLitterQuery({ limit: 10 }))
        .all<D1LitterMenuData>()
        .then((data) => {
          if (data) return data.results;
          throw new Error("No data found.");
        }),
    ]);

    return {
      motherData: motherMenuD1Data.map((item) => ({
        id: item.id,
        name: item.adultName,
        Headshots_Sm: item.Headshots_Sm,
      })),
      litterData: litterMenuD1Data.map((item) => ({
        id: item.id,
        name: this.concatLitterName(item),
        Headshots_Sm: item.Headshots_Sm,
        mostRecentDate: item.mostRecentDate,
      })),
    } satisfies MenuDataType;
  }

  getAdultQuery(
    opts:
      | {
          adult?: (typeof G)["mother"] | (typeof G)["father"];
          includeRetired?: boolean;
        }
      | Record<string, unknown> = {}
  ) {
    return `SELECT
            ${D1T.Adults}.${G.dogId} AS id,
            ${D1T.Adults}.${G.adultName},
            ${D1T.Dogs}.${G.Headshots_Sm}
          FROM
            ${D1T.Families}
            LEFT JOIN ${D1T.Adults} ON ${D1T.Adults}.${G.id} = ${
      D1T.Families
    }.${opts.adult} 
            LEFT JOIN ${D1T.Dogs} ON ${D1T.Dogs}.${G.id} = ${D1T.Adults}.${
      G.dogId
    }
            ${
              opts.includeRetired
                ? `WHERE ${D1T.Adults}.${G.activityStatus} IS NOT 'Retired'`
                : ""
            }
            GROUP BY ${D1T.Families}.${opts.adult}
        `;
  }

  getLitterQuery(
    opts:
      | { limit?: number; includeRetired?: boolean }
      | Record<string, unknown> = {}
  ) {
    return `SELECT
            ${D1T.Litters}.${G.id} AS id,
            ${D1T.Adults}.${G.adultName} AS mother,
            ${D1T.Litters}.${G.litterBirthday},
            ${D1T.Litters}.${G.dueDate},
            ${D1T.Dogs}.${G.Headshots_Sm},
            CASE
              WHEN 
                COALESCE(${D1T.Litters}.${G.litterBirthday}, 1970-01-01) > 
                COALESCE(${D1T.Litters}.${G.dueDate}, 1970-01-01) 
                AND
                SUM(CASE WHEN 
                    Pups.${
                      G.availability
                    } LIKE '%Available%' THEN 1 ELSE 0 END) > 0
                THEN 
                COALESCE(${D1T.Litters}.${G.litterBirthday}, 1970-01-01)
                ELSE
                COALESCE(${D1T.Litters}.${G.dueDate}, 1970-01-01)
              END AS mostRecentDate
            FROM
              ${D1T.Families}
              LEFT JOIN ${D1T.Litters}
                ON ${D1T.Litters}.${G.id} = ${D1T.Families}.${G.litterId}
              LEFT JOIN ${D1T.Puppies}
                AS Pups ON ${D1T.Litters}.${G.id} = Pups.${G.litterId}
              LEFT JOIN ${D1T.Adults}
                ON ${D1T.Adults}.${G.id} = ${D1T.Families}.${G.mother} 
              LEFT JOIN ${D1T.Dogs} ON ${D1T.Dogs}.${G.id} = ${D1T.Adults}.${
      G.dogId
    }
            ${
              opts.includeRetired
                ? `AND ${D1T.Adults}.${G.activityStatus} IS NOT 'Retired'`
                : ""
            }
            GROUP BY ${D1T.Families}.${G.mother}
            ORDER BY mostRecentDate ASC
            ${opts.limit ? `LIMIT ${opts.limit}` : ""}
          `;
  }

  async getMotherMenuData(): Promise<MenuItemData> {
    const data = await this.#menuData();
    return data.motherData;
  }

  async getLitterMenuData(): Promise<MenuItemData> {
    const data = await this.#menuData();
    return data.litterData;
  }

  async getData(): Promise<MenuDataType> {
    return this.#menuData();
  }

  concatLitterName(item: D1LitterMenuData): string {
    const date = new DateCalculator({
      mostRecentDate: new Date(item.mostRecentDate),
    }).prettified.currentDOB;
    return `${item.mother} - (${date})`;
  }
}
