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
  LitterQueryData as LQ,
  D1LitterQueryData as D1LQ,
} from "@/constants/queries";

export type { DQ, D1DQ, AQ, D1AQ, PQ, D1PQ, FQ, D1FQ, LQ, D1LQ };

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
  readonly [G.mostRecentDate]: FQ[typeof G.mostRecentDate];
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
    readonly [G.puppyName]:
      | Exclude<PQ[typeof G.puppyName], null>
      | "Unnamed Puppy";
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

export const castPuppyFromD1 = (pup: D1DQ & D1LQ & D1FQ): PuppyData => {
  const puppyData = {
    dogData: {
      [G.puppyName]: pup[G.puppyName] ?? "Unnamed",
      [G.collarColor]: pup[G.collarColor],
      [G.availability]: pup[G.availability] as
        | "Available"
        | "Picked"
        | "Adopted"
        | "Available Guardian",
      [G.gender]: pup[G.gender] as "M" | "F",
      [G.noseColor]: pup[G.noseColor],
      [G.coat]: pup[G.coat],
      [G.personality]: pup[G.personality],
      [G.Headshots_Lg]: pup[G.Headshots_Lg],
      [G.Headshots_Sm]: pup[G.Headshots_Sm],
    },
    litterData: {
      [G.dueDate]: pup[G.dueDate],
      [G.litterBirthday]: pup[G.litterBirthday],
      [G.mostRecentDate]: pup[G.mostRecentDate],
      [G.applicantsInQueue]: pup[G.applicantsInQueue],
      [G.availablePuppies]: pup[G.availablePuppies],
      [G.totalPuppies]: pup[G.totalPuppies],
    },
    ids: {
      [G.Group_Photos]: pup[G.Group_Photos],
      [G.dogId]: pup[G.dogId],
      [G.litterId]: pup[G.litterId],
      [G.mother]: pup[G.mother],
      [G.father]: pup[G.father],
      [G.puppyId]: pup[G.puppyId],
    },
  } satisfies PuppyData;

  Object.freeze(puppyData);
  Object.freeze(puppyData.dogData);
  Object.freeze(puppyData.litterData);
  Object.freeze(puppyData.ids);

  return { ...puppyData };
};

export const castParentFromD1 = (
  parentDog: D1DQ & D1AQ
): ParentData['dogData'] => {
  const parentDogsData = {
    [G.adultName]: parentDog[G.adultName] as DogData[typeof G.adultName],
    [G.breeder]: parentDog[G.breeder] as DogData[typeof G.breeder],
    [G.adultBirthday]: parentDog[G.adultBirthday],
    [G.eyeColor]: parentDog[G.eyeColor],
    [G.activityStatus]: parentDog[
      G.activityStatus
    ] as DogData[typeof G.activityStatus],
    [G.favActivities]: parentDog[G.favActivities],
    [G.weight]: parentDog[G.weight],
    [G.energyLevel]: parentDog[
      G.energyLevel
    ] as DogData[typeof G.energyLevel],
    [G.gender]: parentDog[G.gender] as DogData[typeof G.gender],
    [G.noseColor]: parentDog[G.noseColor],
    [G.coat]: parentDog[G.coat],
    [G.personality]: parentDog[G.personality],
    [G.Headshots_Lg]: parentDog[G.Headshots_Lg],
    [G.Headshots_Sm]: parentDog[G.Headshots_Sm],
    [G.dogId]: parentDog[G.dogId],
    [G.certifications]: parentDog[
      G.certifications
    ] as DogData[typeof G.certifications],
  };

  return parentDogsData;

};
