import { GlobalNameSpaces as G } from "@/constants/data";
import type { dogsQueryData, puppyQueryData } from "@/constants/queries";
import type { DogTreeData } from "@/types/dog-tree";
export type { DogTreeData } from "@/types/dog-tree";

/**
 * Modified version of {@see DogTreeData} with better property names for this
 * component.
 **/
export interface AdultData {
  readonly dogData: DogTreeData[typeof G.father];
  readonly partnerData: DogTreeData[typeof G.mother];
  readonly litterData: DogTreeData["litterData"];
  readonly ids: DogTreeData["ids"];
}

export interface PuppyData {
  readonly dogData: {
    [G.Headshots_Lg]: dogsQueryData[typeof G.Headshots_Lg];
    [G.Headshots_Sm]: dogsQueryData[typeof G.Headshots_Sm];
    [G.gender]: dogsQueryData[typeof G.gender];
    [G.noseColor]: dogsQueryData[typeof G.noseColor];
    [G.coat]: dogsQueryData[typeof G.coat];
    [G.personality]: dogsQueryData[typeof G.personality];
    [G.puppyName]: puppyQueryData[typeof G.puppyName];
    [G.collarColor]: puppyQueryData[typeof G.collarColor];
    [G.availability]: puppyQueryData[typeof G.availability];
  } ;
  readonly litterData: DogTreeData["litterData"];
  ids: {
    [G.litterId]: DogTreeData["ids"][typeof G.litterId];
    [G.dogId]: DogTreeData["ids"][typeof G.father];
    [G.mother]: DogTreeData["ids"][typeof G.mother];
    [G.father]: DogTreeData["ids"][typeof G.father];
  }
}

