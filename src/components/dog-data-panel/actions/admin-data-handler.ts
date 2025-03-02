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

export type IdName = { id?: number; name: string };

export interface CurrentData {
  breederIdNames: IdName[];
  certificateIdNames: IdName[];
  litterIdNames: IdName[];
  motherIdNames: IdName[];
  fatherIdNames: IdName[];
}

export const CURRENT_DATA = {
  breederIdNames: "breederIdNames",
  litterIdNames: "litterIdNames",
  certificateIdNames: "certificateIdNames",
  motherIdNames: "motherIdNames",
  fatherIdNames: "fatherIdNames",
} as const;

export type CurrentDataKeys = keyof typeof CURRENT_DATA; // Keys in the `CURRENT_DATA`

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
    super();
    this.currentData = {
      breederIdNames: [],
      certificateIdNames: [],
      litterIdNames: [],
      motherIdNames: [],
      fatherIdNames: [],
    };
  }

  async getCurrentData(
    D1: D1Database
  ): Promise<AdminDataHandler["currentData"]> {
    this.currentData = {
      breederIdNames: await this.getBreederIdNames(D1),
      certificateIdNames: await this.getCertificateIdNames(D1),
      litterIdNames: await this.getLitterIdNames(D1),
      motherIdNames: await this.getAdultIdNames(D1, "F"),
      fatherIdNames: await this.getAdultIdNames(D1, "M"),
    };
    return this.currentData;
  }

  async handleFormSubmission(
    currentAdminState: FormState,
    formData: FormData
  ): Promise<void> {
    IMPORT_handleFormSubmission(currentAdminState, formData);
  }

  /**
   * Returns IdName's for breeders.
   * NOTE: In this case the Id refers to an adult dog that is owned by the breeder.
   **/
  async getBreederIdNames(D1: D1Database): Promise<IdName[]> {
    const breederIdNames = await D1.prepare(
      `SELECT ${G.breeder}, ${G.id} FROM ${D1T.Adults} GROUP BY ${G.breeder}`
    )
      .all<IdName>()
      .catch(() => {
        throw new Error("Failed to collect breeder IdNames");
      })
      .then((res) => res.results);
    return breederIdNames;
  }

  /**
   * Returns IdName's for certificates.
   * NOTE: In this case the id is always undefined.
   **/
  async getCertificateIdNames(D1: D1Database): Promise<IdName[]> {
    const certificateIdNames = await D1.prepare(
      `SELECT ${G.certifications} as name FROM ${D1T.Adults} WHERE ${G.certifications} IS NOT NULL GROUP BY ${G.certifications} `
    )
      .all<{name: string}>()
      .catch(() => {
        throw new Error("Failed to collect certificate IdNames");
      })
      .then((res) => res.results);

    const equivocalCerts = new Set<string>();

    // Ensures that each certificate has a corresponding equivalent as an option.
    certificateIdNames.map((cert) => {
      const equivalent = cert.name.replace("-equivalent", "");
      equivocalCerts.add(equivalent);
      equivocalCerts.add(equivalent + "-equivalent");
    });

    const certs = Array.from(equivocalCerts);

    return certs.map(cert => ({name: cert}))
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
   * Gets *all* litterIdNames from the database. Along with their associated
   * Id's.  If the litter is not associated with a family, the litter name is
   * "Litter No. {id}"
   **/
  async getLitterIdNames(D1: D1Database): Promise<IdName[]> {
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
   * Gets *all* adultIdNames from the database. Along with their associated Id's
   * Along with their associated Id's.
   **/
  async getAdultIdNames(
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
