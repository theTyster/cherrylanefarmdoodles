import { GlobalNameSpaces as G } from "@/constants/data";
import { PuppyData } from "@/types/dog-about";
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

/**
 * Data gathered strictly from values in the D1 Tables.
 * Only relevant for the primary dog in the page.
 * gathered using adultDogsQuery and the dogsQuery queries.
 **/
export type DogData = D1DQ & D1AQ;

export interface DogTreeData {
  mother: DogData;
  father: DogData;
  puppies: PuppyData[];
  litterData: {
    [G.dueDate]: FQ[typeof G.dueDate];
    [G.litterBirthday]: FQ[typeof G.litterBirthday];
    [G.mostRecentDate]: FQ[typeof G.mostRecentDate];
    [G.applicantsInQueue]: FQ[typeof G.applicantsInQueue];
    [G.availablePuppies]: number;
    [G.totalPuppies]: number;
  };
  ids: {
    [G.litterId]: FQ[typeof G.litterId];
    [G.Group_Photos]: FQ[typeof G.Group_Photos];
    [G.mother]: FQ[typeof G.mother];
    [G.father]: FQ[typeof G.father];
  };
}
