import { V as DogVariants } from "@/types/dog-about";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import {
  familyQuery,
  type D1FamilyQueryData as D1FQ,
  litterQuery,
  type D1LitterQueryData as D1LQ,
} from "@/constants/queries";
import { D1Schema } from "@/types/data";
import { DogsDBTableValTypes } from "@/constants/statements";
import IMPORT_handleFormSubmission from "@/components/new-dog-form/constants/handle-form-submission";

export const ADMIN_STATES = {
  Adults: "Adults",
  Puppies: "Puppies",
  Litters: "Litters",
  Families: "Families",
} as const;
export type AdminState = (typeof ADMIN_STATES)[keyof typeof ADMIN_STATES];

/**
 * This variable provides a way to map types that the FormData will return
 * given the AdminState.
 *
 * The admin state is mapped to a component.
 * The component will be used to render the data provided in the form.
 * */
export const PREVIEW_STATES = {
  [ADMIN_STATES["Adults"]]: DogVariants.Parent,
  [ADMIN_STATES["Puppies"]]: DogVariants.Puppy,
} as const;
export type PreviewState = (typeof PREVIEW_STATES)[keyof typeof PREVIEW_STATES];

/**
 * This variable provides a way to map types that the FormData will return
 * given the AdminState.
 *
 * The admin state is mapped to a table in the database.
 * The form's data will be used to create or update the data in that table.
 **/
export const FORMDATA_STATES = {
  [ADMIN_STATES["Adults"]]: D1T.Adults,
  [ADMIN_STATES["Puppies"]]: D1T.Puppies,
  [ADMIN_STATES["Litters"]]: D1T.Litters,
  [ADMIN_STATES["Families"]]: D1T.Families,
};
export type FormDataState =
  (typeof FORMDATA_STATES)[keyof typeof FORMDATA_STATES];
type HandleFormSubmission<T extends AdminState> = (
  First: T,
  Second: DogsDBTableValTypes<(typeof FORMDATA_STATES)[T]>
) => Promise<T>;

import MenuData, {
  type D1LitterMenuData,
  type D1MotherMenuData as D1AdultMenuData,
} from "@/constants/nav";

import Statements, { LitterUpdateType } from "@/constants/statements";

type D1AdultMenuDataRawHelper = (
  data: D1AdultMenuData
) => [(typeof data)[typeof G.id], (typeof data)[typeof G.adultName]];

type D1AdultMenuDataRaw = ReturnType<D1AdultMenuDataRawHelper>;

/**Controls the overall state of the SPA Admin Panel*/
export default class ServerAdminDataHandler extends Statements {
  D1?: D1Database;
  inputData: {
    breeders: string[];
    litterNames: string[];
    motherNames: string[];
    fatherNames: string[];
  };
  DogVariants = DogVariants;

  /**Controls the overall state of the SPA Admin Panel*/
  adminStates = ADMIN_STATES;

  /**Controls the state of Preview Components*/
  previewStates = PREVIEW_STATES;

  /**Designates the location the form's data is destined to.*/
  formDataStates = FORMDATA_STATES;

  concatLitterName = MenuData.prototype.concatLitterName;

  // This is preferred over MenuData.prototype.getAdultQuery because it
  // returns all adults not just the ones with litters.
  getAdultQuery = (opts: { parentRole: D1Schema["Dogs"][typeof G.gender] }) =>
    `SELECT
          ${G.dogId} as id,
          ${G.adultName}
        FROM
          ${D1T.Adults}
          LEFT JOIN ${D1T.Dogs} ON ${D1T.Dogs}.${G.id} = ${D1T.Adults}.${G.dogId}
          WHERE ${D1T.Dogs}.${G.gender} = '${opts.parentRole}'
          `;
  getFamiliesQuery = familyQuery;
  getLittersQuery = litterQuery;

  constructor(D1?: D1Database) {
    super();
    this.D1 = D1;
    this.inputData = {
      breeders: [],
      litterNames: [],
      motherNames: [],
      fatherNames: [],
    };
  }

  async getInputData(): Promise<ServerAdminDataHandler["inputData"]> {
    this.inputData = {
      breeders: await this.getBreeders(),
      litterNames: await this.getLitterNames(),
      motherNames: await this.getAdultNames("F"),
      fatherNames: await this.getAdultNames("M"),
    };
    return this.inputData;
  }

  async handleFormSubmission(
    currentAdminState: keyof typeof ADMIN_STATES,
    formData: DogsDBTableValTypes<typeof currentAdminState>
  ): Promise<void> {
    IMPORT_handleFormSubmission(currentAdminState, formData);
  }

  async getBreeders(): Promise<string[]> {
    if (!this.D1) throw new Error("D1 not found");
    const breeders = await this.D1.prepare(
      `SELECT breeder from Adults Group by breeder`
    ).raw<string>();
    return breeders;
  }

  /**
   * Gets *all* litters from the database using the same query as the menu.
   * concatenates the litter's mother name with the birthdate or duedate.
   **/
  async getLitterNames(): Promise<string[]> {
    if (!this.D1) throw new Error("D1 not found");

    const queriedLitters = await this.D1.prepare(
      this.getLitterNamesQuery({ includeRetired: true })
    )
      .all<D1LitterMenuData>()
      .then((data) => data.results);

    const litters = queriedLitters.map((litter) =>
      this.concatLitterName(litter)
    );

    return litters;
  }

  /**
   * Gets *all* adultNames from the database.
   **/
  async getAdultNames(
    parentRole: D1Schema["Dogs"][typeof G.gender]
  ): Promise<string[]> {
    if (!this.D1) throw new Error("D1 not found");
    const parents = await this.D1.prepare(
      this.getAdultQuery({ parentRole })
    ).raw<D1AdultMenuDataRaw>();
    return parents.map((theParent) => theParent[1] /**adultName*/);
  }

  /**Gets *all* families in the database. This could be a very large set of data.*/
  async getFamilies(): Promise<D1FQ[]> {
    if (!this.D1) throw new Error("D1 not found");
    return await this.D1.prepare(this.getFamiliesQuery()).raw<D1FQ>();
  }

  /**Gets *all* litters in the database. This could be a very large set of data.*/
  async getLitters(): Promise<D1LitterMenuData[]> {
    if (!this.D1) throw new Error("D1 not found");
    return await this.D1.prepare(
      this.getLittersQuery()
    ).raw<D1LitterMenuData>();
  }
}
