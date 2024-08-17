import { GlobalNameSpaces as G } from "@/constants/data";

export interface MostRecentFamily extends D1Families, D1Litters {
    Group_Photos: D1Families[typeof G.Group_Photos];
    dueDate: Date;
    applicantsInQueue: D1Litters[typeof G.applicantsInQueue];
    litterBirthday: D1Litters[typeof G.litterBirthday];
    /**Not in D1. Calculation made in the query.*/
    availablePuppies: number | string;
  }

/**
 * Data gathered strictly from values in the D1 Tables.
 * Only relevant for the primary dog in the page.
 **/
export interface DogData
  extends Omit<D1Adults, typeof G.dogId | typeof G.id>,
    Pick<
      D1Dogs,
      | typeof G.gender
      | typeof G.noseColor
      | typeof G.coatColor
      | typeof G.personality
      | typeof G.Headshots_Lg
      | typeof G.Headshots_Sm
    >,
    Pick<
      D1Litters,
      typeof G.applicantsInQueue | typeof G.litterBirthday | typeof G.dueDate
    > {
  readonly adultName: D1Adults[typeof G.adultName];
  readonly breeder: D1Adults[typeof G.breeder];
  readonly adultBirthday: D1Adults[typeof G.adultBirthday];
  readonly eyeColor: D1Adults[typeof G.eyeColor];
  readonly isRetired: D1Adults[typeof G.isRetired];
  readonly favActivities: D1Adults[typeof G.favActivities];
  readonly weight: D1Adults[typeof G.weight];
  readonly energyLevel: D1Adults[typeof G.energyLevel];
  readonly gender: D1Dogs[typeof G.gender];
  readonly noseColor: D1Dogs[typeof G.noseColor];
  readonly coatColor: D1Dogs[typeof G.coatColor];
  readonly personality: D1Dogs[typeof G.personality];
  readonly Headshots_Lg: D1Dogs[typeof G.Headshots_Lg];
}

/**
 * Data gathered strictly from values in the D1 Tables.
 * Relevant to the dog matched with the primary dog in the page.
 **/
export interface PartnerData
  extends Pick<
      D1Adults,
      typeof G.adultName | typeof G.breeder | typeof G.adultBirthday
    >,
    Pick<D1Dogs, typeof G.Headshots_Sm> {
  readonly partnerName: D1Adults[typeof G.adultName];
  readonly partnerBreeder: D1Adults[typeof G.breeder];
  readonly partnerBirthday: D1Adults[typeof G.adultBirthday];
  readonly partnerPhoto: D1Dogs[typeof G.Headshots_Sm];
}
/**
 * Any other data that is not strictly a value in the D1 Table.
 * But still relevant to the primary dog in the page.
 **/
export interface Relevancies {
}

/**
 * Combined Data from {@see DogData} and {@see PartnerData}
 * As well as any other data that is not strictly a value in the D1 Table.
 * {@see Relevancies}
 **/
export interface DogAboutData
  extends DogData,
    PartnerData,
    Pick<D1Families, typeof G.Group_Photos>,
    Pick<
      D1Litters,
      typeof G.applicantsInQueue | typeof G.litterBirthday | typeof G.dueDate
    >,
    Relevancies {}

export type UsedColumns = {
  readonly [K in keyof DogAboutData]: K;
};

export interface CSS extends Record<keyof DogAboutData, string> {
  readonly dogAbout: string;
  readonly availablePuppies: string;
  readonly partnerData: string;
  readonly partnerBreederPhoto: string;
  readonly partnerLastLitter: string;
  readonly dogTitle: string;
  readonly mainDog: string;
  readonly dogInfoList: string;
  readonly attentionGetter: string;
  readonly partnerVisuals: string;
}
