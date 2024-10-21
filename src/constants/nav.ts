import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import fetchDataWithCache from "@/constants/caching";
import DateCalculator from "@/constants/dates";

export const MENU_STATES = {
  Initial: "Initial",
  Mothers: "Mothers",
  Litters: "Litters",
} as const;
export type MenuStateTypes = (typeof MENU_STATES)[keyof typeof MENU_STATES];
export type MenuItemData = { name: string; id: number }[];

export type MenuDataType = { motherData: MenuItemData; litterData: MenuItemData };
export type D1LitterMenuData = {
  id: number;
  mother: string;
  litterBirthday: string | null;
  dueDate: string | null;
};
export type D1MotherMenuData = {
  id: number;
  adultName: string;
};


export default class MenuData {
  D1: D1Database;

  constructor(D1: D1Database) {
    this.D1 = D1;
  }

  async #menuData(): Promise<MenuDataType> {

    const [motherMenuD1Data, litterMenuD1Data] = await fetchDataWithCache(
      "menu-items",
      async () =>
        await Promise.all([
          this.D1.prepare(
            `SELECT
            ${D1T.Adults}.${G.dogId} as id,
            ${D1T.Adults}.${G.adultName}
          FROM
            ${D1T.Families}
            LEFT JOIN ${D1T.Adults} ON ${D1T.Adults}.${G.id} = ${D1T.Families}.${G.mother}
            GROUP BY ${D1T.Families}.${G.mother}
        `
          )
            .all<D1MotherMenuData>()
            .then((data) => {
              if (data) return data.results;
              throw new Error("No data found.");
            }),
          this.D1.prepare(
            `SELECT
            ${D1T.Litters}.${G.id} as id,
            ${D1T.Adults}.${G.adultName} as mother,
            ${D1T.Litters}.${G.litterBirthday},
            ${D1T.Litters}.${G.dueDate}
          FROM
            ${D1T.Families}
            LEFT JOIN ${D1T.Litters} ON ${D1T.Litters}.${G.id} = ${D1T.Families}.${G.litterId}
            LEFT JOIN ${D1T.Adults} ON ${D1T.Adults}.${G.id} = ${D1T.Families}.${G.mother}
            LIMIT 10
        `
          )
            .all<D1LitterMenuData>()
            .then((data) => {
              if (data) return data.results;
              throw new Error("No data found.");
            }),
        ])
    );

    return ({
      motherData: motherMenuD1Data.map((item) => ({
        id: item.id,
        name: item.adultName,
      })),
      litterData: litterMenuD1Data.map((item) => ({
        id: item.id,
        name: this.concatLitterName(item),
      })),
    }) satisfies MenuDataType;
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

  concatLitterName (item: D1LitterMenuData): string {
    const date = new DateCalculator({
      litterBirthday: item.litterBirthday
        ? new Date(item.litterBirthday)
        : null,
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
    }).prettified.currentDOB;
    return `${item.mother} - (${date})`;
  };


}
