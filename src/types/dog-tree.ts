import { GlobalNameSpaces as G } from "@/constants/data";

/**
 * Data gathered strictly from values in the D1 Tables.
 * Only relevant for the primary dog in the page.
 * gathered using adultDogsQuery and the dogsQuery queries.
 **/
export interface DogData {
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
  readonly Headshots_Sm: D1Dogs[typeof G.Headshots_Sm];
}

export interface DogTreeData {
  mother: DogData;
  father: DogData;
  litterData: {
    [G.dueDate]: D1Litters[typeof G.dueDate];
    [G.litterBirthday]: D1Litters[typeof G.litterBirthday];
    [G.applicantsInQueue]: D1Litters[typeof G.applicantsInQueue];
    [G.availablePuppies]: string;
  };
  ids: {
    [G.litterId]: D1Families[typeof G.litterId];
    [G.Group_Photos]: D1Families[typeof G.Group_Photos];
    [G.mother]: D1Families[typeof G.mother];
    [G.father]: D1Families[typeof G.father];
  };
}
