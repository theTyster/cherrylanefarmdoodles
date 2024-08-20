import { GlobalNameSpaces as G } from "@/constants/data";
import type { DogData } from "@/types/dog-tree";
export type { DogData } from "@/types/dog-tree";
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
