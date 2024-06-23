import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

interface DogFamily {
  readonly mother: string;
  readonly father: string;
  readonly dueDate: string;
  readonly birthday: string | null;
  readonly goHomeDate: string | null;
}

export async function GET(request: NextRequest) {
  const db = getRequestContext();
  const frontPageDogData = await db.env.dogsDB
    .prepare(
      `
      SELECT
       I.groupPhoto,
       AM.dogName as mother,
       AF.dogName as father,
       L.dueDate,
       L.birthday,
       L.goHomeDate
      FROM
      Families AS F
      LEFT JOIN Group_Photos AS I ON F.groupPhoto = I.ID
      LEFT JOIN Adults AS AM ON F.mother = AM.ID
      LEFT JOIN Adults AS AF ON F.father = AF.ID
      LEFT JOIN Litters AS L ON F.litterId = L.ID
      `
    )
    .bind()
    .all<DogFamily>();

  return Response.json(frontPageDogData);
}
