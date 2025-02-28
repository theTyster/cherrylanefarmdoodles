import { V as DogVariants } from "@/types/dog-about";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import Statements, {
  type D1FQ,
  type D1LQ,
  type D1AQ,
} from "@/constants/statements";
import { D1Schema } from "@/types/data";
import IMPORT_handleFormSubmission from "@/components/dog-data-panel/actions/handle-form-submission";
import { FormState } from "@/components/dog-data-panel/dog-data-panel";
import DateCalculator from "@/constants/dates";

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

import MenuData, {
  type D1MotherMenuData as D1AdultMenuData,
} from "@/constants/nav";

type D1AdultMenuDataRawHelper = (
  data: D1AdultMenuData
) => [(typeof data)[typeof G.id], (typeof data)[typeof G.adultName]];

type D1AdultMenuDataRaw = ReturnType<D1AdultMenuDataRawHelper>;

export interface CurrentData {
  breeders: IdName[];
  certificateNames: IdName[];
  litterNames: IdName[];
  motherNames: IdName[];
  fatherNames: IdName[];
}

export const CURRENT_DATA = {
  breeders: "breeders",
  litterNames: "litterNames",
  certificateNames: "certificateNames",
  motherNames: "motherNames",
  fatherNames: "fatherNames",
} as const;

export type CurrentDataKeys = keyof typeof CURRENT_DATA; // Keys in the `CURRENT_DATA`

export type IdName = { id?: number; name: string };

/**Controls the overall state of the SPA Admin Panel*/
export default class AdminDataHandler extends Statements {
  currentData: CurrentData;
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
  // It also returns the adults Id instead of the dog Id.
  getAdultQuery = (opts: { parentRole: D1Schema["Dogs"][typeof G.gender] }) =>
    `SELECT
          ${D1T.Adults}.id,
          ${G.adultName}
        FROM
          ${D1T.Adults}
          LEFT JOIN ${D1T.Dogs} as D ON D.${G.id} = ${D1T.Adults}.${G.dogId}
          WHERE D.${G.gender} = '${opts.parentRole}'
          `;

  constructor() {
    super()
    this.currentData = {
      breeders: [],
      certificateNames: [],
      litterNames: [],
      motherNames: [],
      fatherNames: [],
    };
  }

  async getCurrentData(
    D1: D1Database
  ): Promise<AdminDataHandler["currentData"]> {
    this.currentData = {
      breeders: await this.getBreeders(D1),
      certificateNames: await this.getCertificateNames(D1),
      litterNames: await this.getLitterNames(D1),
      motherNames: await this.getAdultNames(D1, "F"),
      fatherNames: await this.getAdultNames(D1, "M"),
    };
    return this.currentData;
  }

  async handleFormSubmission(
    currentAdminState: FormState,
    formData: FormData
  ): Promise<void> {
    IMPORT_handleFormSubmission(currentAdminState, formData);
  }

  async getBreeders(D1: D1Database): Promise<string[]> {
    const breeders = await D1.prepare(
      `SELECT breeder FROM Adults GROUP BY breeder`
    ).raw<[string]>();
    return breeders.flat();
  }

  async getCertificateNames(D1: D1Database): Promise<string[]> {
    const certificateNames = await D1.prepare(
      `SELECT certifications FROM Adults WHERE certifications IS NOT NULL GROUP BY certifications `
    ).raw<[string]>();
    const equivocalCerts = new Set<string>();

    // Ensures that each certificate has a corresponding equivalent as an option.
    certificateNames.flat().forEach((cert) => {
      const equivalent = cert.replace("-equivalent", "");
      equivocalCerts.add(equivalent);
      equivocalCerts.add(equivalent + "-equivalent");
    });

    const certs = Array.from(equivocalCerts);

    return certs;
  }

  /**
   * Overwrites the getLitterQuery method from MenuData to inclued all Litters.
   * Not just ones that are already associated with a family.
   *
   * If the litter is associated with a family, the family name is concatenated.
   *
   * */
  getLitterQuery() {
    return `SELECT
            ${D1T.Litters}.${G.id} AS id,
            ${D1T.Adults}.${G.adultName} AS mother,
            ${D1T.Litters}.${G.litterBirthday},
            ${D1T.Litters}.${G.dueDate}
          FROM
            ${D1T.Litters}
            LEFT JOIN ${D1T.Families} ON ${D1T.Families}.${G.litterId} = ${D1T.Litters}.${G.id}
            LEFT JOIN ${D1T.Adults} ON ${D1T.Adults}.${G.id} = ${D1T.Families}.${G.mother} 
          `;
  }

  /**
   * Gets *all* litterNames from the database. Along with their associated
   * Id's.  If the litter is not associated with a family, the litter name is
   * "Litter No. {id}"
   **/
  async getLitterNames(D1: D1Database): Promise<IdName[]> {
    const queriedLitters = await D1.prepare(this.getLitterQuery())
      .all<{
        id: number;
        mother: string;
        litterBirthday: string;
        dueDate: string;
      }>()
      .then((data) => data.results);

    const formattedLitters = queriedLitters.reduce((acc: IdName[], litter) => {
      let mother: string | number = litter.mother;
      if (mother === null) {
        mother = `Litter No. ${litter.id}`;
      }

      const dates = new DateCalculator({
        litterBirthday: litter.litterBirthday
          ? new Date(litter.litterBirthday)
          : null,
        dueDate: litter.dueDate ? new Date(litter.dueDate) : null,
      });

      const concattedLitter = this.concatLitterName({
        id: litter.id,
        mother,
        mostRecentDate: dates.nextEvent.date.toString(),
        Headshots_Sm: "",
      });

      const litterIdName = { id: litter.id, name: concattedLitter };

      acc.push(litterIdName);

      return acc;
    }, []);

    return formattedLitters;
  }

  /**
   * Gets *all* adultNames from the database. Along with their associated Id's
   * Along with their associated Id's.
   **/
  async getAdultNames(
    D1: D1Database,
    parentRole: D1Schema["Dogs"][typeof G.gender]
  ): Promise<IdName[]> {
    const parents = await D1.prepare(
      this.getAdultQuery({ parentRole })
    ).raw<D1AdultMenuDataRaw>();

    return parents.map((theParent) => ({
      id: theParent[0],
      name: theParent[1],
    }));
  }

  /**Gets *all* families in the database. This could be a very large set of data.*/
  async getFamilies(D1: D1Database): Promise<D1FQ[]> {
    return await D1.prepare(this.familyQuery()).raw<D1FQ>();
  }

  /**Gets *all* puppies in the database. This could be a very large set of data.*/
  async getLitters(D1: D1Database): Promise<D1LQ[]> {
    return await D1.prepare(this.litterQuery()).raw<D1LQ>();
  }

  /**Gets *all* Adults in the database. This could be a very large set of data.*/
  async getAdults(D1: D1Database): Promise<D1AQ[]> {
    return await D1.prepare(this.adultDogsQuery).raw<D1AQ>();
  }
}
