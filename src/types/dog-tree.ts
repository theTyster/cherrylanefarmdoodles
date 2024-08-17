import { D1Columns as D1C, D1Tables as D1T } from "@/constants/data";

export type DogTree_Litters = Pick<
        D1Litters,
        typeof D1C.dueDate | typeof D1C.birthday | typeof D1C.applicantsInQueue
      >;

