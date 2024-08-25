import { GlobalNameSpaces as G } from "@/constants/data";
import type { DogTreeData } from "@/types/dog-tree";
export type { DogTreeData } from "@/types/dog-tree";

/**
 * Modified version of {@see DogTreeData} with better property names for this
 * component.
 **/
export interface Data {
  readonly dogData: DogTreeData[typeof G.father];
  readonly partnerData: DogTreeData[typeof G.mother];
  readonly litterData: DogTreeData["litterData"];
  readonly ids: DogTreeData["ids"];
}

export type UsedColumns = {
  readonly [K in keyof Data]: K;
};

export interface CSS
  extends Record<keyof Data["dogData"], string>,
    Record<keyof Data["partnerData"], string>,
    Record<keyof Data["litterData"], string>,
    Pick<Data["ids"], typeof G.Group_Photos> {
  readonly dogAbout: string;
  readonly availablePuppies: string;
  readonly partnerData: string;
  readonly partnerBreederPhoto: string;
  readonly partnerLastLitter: string;
  readonly partnerName: string;
  readonly partnerBreeder: string;
  readonly partnerBirthday: string;
  readonly partnerPhoto: string;
  readonly dogTitle: string;
  readonly mainDog: string;
  readonly dogInfoList: string;
  readonly attentionGetter: string;
  readonly partnerVisuals: string;
}
