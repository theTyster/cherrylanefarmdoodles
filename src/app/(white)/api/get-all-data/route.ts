export const runtime = "edge";

import { D1Tables } from "@/constants/data";
import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function GET() {
//  try {
    const tables = Object.keys(D1Tables);

    const data: Record<string, string[]> = {};

    for (const table of tables) {
      const result = await getRequestContext()
        .env.dogsDB.prepare(`SELECT * FROM ${table}`)
        .all<Record<string, string[]>>();

      //// Add validation for D1 response format
      //if (!Array.isArray(result?.results)) {
      //  throw new Error(`Invalid response format for table ${table}`);
      //}

      data[table] = result.results;
    }

    return NextResponse.json(data);
  //} catch (err) {
  //  return NextResponse.json(
  //    { error: (err as { message: string }).message },
  //    { status: 500 }
  //  );
  //}
}
