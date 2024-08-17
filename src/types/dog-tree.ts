import { GlobalNameSpaces as G } from "@/constants/data";

export type DogTree_Litters = Pick<
        D1Litters,
        typeof G.dueDate | typeof G.birthday | typeof G.applicantsInQueue
      >;

