import { GlobalNameSpaces as G } from "@/constants/data";
import type {
  DogsQueryData as DQ,
  D1DogsQueryData as D1DQ,
  AdultDogsQueryData as AQ,
  D1AdultDogsQueryData as D1AQ,
  PuppyQueryData as PQ,
  D1PuppyQueryData as D1PQ,
  FamilyQueryData as FQ,
  D1FamilyQueryData as D1FQ,
} from "@/constants/queries";

export type { DQ, D1DQ, AQ, D1AQ, PQ, D1PQ, FQ, D1FQ };

export type DogData = DQ & AQ;

/**All possible variants for this component.*/
export const V = {
  Parent: "Parent",
  Puppy: "Puppy",
  CurrentLitter: "CurrentLitter",
} as const;

export type V = typeof V;

export type Variant = (typeof V)[keyof typeof V];

export type VariantTypes = {
  [V.Parent]: ParentData;
  [V.Puppy]: PuppyData;
  [V.CurrentLitter]: CurrentLitterData;
};

export type VariantDataTypes = VariantTypes[keyof VariantTypes];

export type LitterData = {
  readonly [G.dueDate]: FQ[typeof G.dueDate];
  readonly [G.litterBirthday]: FQ[typeof G.litterBirthday];
  readonly [G.applicantsInQueue]: FQ[typeof G.applicantsInQueue];
  readonly [G.availablePuppies]: FQ[typeof G.availablePuppies];
  readonly [G.totalPuppies]: FQ[typeof G.totalPuppies];
};
export type Ids = {
  readonly [G.Group_Photos]: FQ[typeof G.Group_Photos];
  readonly [G.litterId]: FQ[typeof G.litterId];
  readonly [G.mother]: FQ[typeof G.mother];
  readonly [G.father]: FQ[typeof G.father];
};
export type ParentData = {
  readonly dogData: DogData;
  partnerData?: DogData;
  readonly litterData: LitterData;
  readonly ids: Ids;
};

export type PuppyData = {
  readonly dogData: {
    readonly [G.puppyName]: Exclude<PQ[typeof G.puppyName], null> | "Unnamed Puppy";
    readonly [G.collarColor]: PQ[typeof G.collarColor];
    readonly availability: PQ[typeof G.availability];
    readonly [G.gender]: DQ[typeof G.gender];
    readonly [G.noseColor]: DQ[typeof G.noseColor];
    readonly [G.coat]: DQ[typeof G.coat];
    readonly [G.personality]: DQ[typeof G.personality];
    readonly [G.Headshots_Lg]: DQ[typeof G.Headshots_Lg];
    readonly [G.Headshots_Sm]: DQ[typeof G.Headshots_Sm];
  };
  readonly litterData: LitterData;
  ids: Ids & {
    readonly [G.dogId]: PQ[typeof G.dogId];
    readonly [G.puppyId]: PQ[typeof G.puppyId];
  };
  parentData?: ParentData;
};

export type CurrentLitterData = {
  readonly puppies: PuppyData[];
  readonly parentData?: ParentData;
};
