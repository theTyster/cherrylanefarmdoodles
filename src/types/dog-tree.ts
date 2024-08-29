import { GlobalNameSpaces as G } from "@/constants/data";
import { D1Dogs, D1Adults, D1Litters, D1Families } from "@/types/data";

/**
 * Data gathered strictly from values in the D1 Tables.
 * Only relevant for the primary dog in the page.
 * gathered using adultDogsQuery and the dogsQuery queries.
 **/
export interface DogData {
  readonly [G.Headshots_Lg]: D1Dogs[typeof G.Headshots_Lg];
  readonly [G.Headshots_Sm]: D1Dogs[typeof G.Headshots_Sm];
  readonly [G.adultBirthday]: D1Adults[typeof G.adultBirthday];
  readonly [G.adultName]: D1Adults[typeof G.adultName];
  readonly [G.breeder]: D1Adults[typeof G.breeder];
  readonly [G.coat]: D1Dogs[typeof G.coat];
  readonly [G.energyLevel]: D1Adults[typeof G.energyLevel];
  readonly [G.eyeColor]: D1Adults[typeof G.eyeColor];
  readonly [G.favActivities]: D1Adults[typeof G.favActivities];
  readonly [G.gender]: D1Dogs[typeof G.gender];
  readonly [G.isRetired]: D1Adults[typeof G.isRetired];
  readonly [G.noseColor]: D1Dogs[typeof G.noseColor];
  readonly [G.personality]: D1Dogs[typeof G.personality];
  readonly [G.weight]: D1Adults[typeof G.weight];
}

export interface DogTreeData {
  mother: DogData;
  father: DogData;
  litterData: {
    [G.dueDate]: D1Litters[typeof G.dueDate];
    [G.litterBirthday]: D1Litters[typeof G.litterBirthday];
    [G.applicantsInQueue]: D1Litters[typeof G.applicantsInQueue];
    [G.availablePuppies]: number;
    [G.totalPuppies]: number;
  };
  ids: {
    [G.litterId]: D1Families[typeof G.litterId];
    [G.Group_Photos]: D1Families[typeof G.Group_Photos];
    [G.mother]: D1Families[typeof G.mother];
    [G.father]: D1Families[typeof G.father];
  };
}
