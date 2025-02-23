export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { table: string; id: string } }
) {
  const { table, id } = params;
  const updates = await request.json();

  try {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.values(updates);
    values.push(id);

    const stmt = getRequestContext().env.dogsDB.prepare(
      `UPDATE ${table} SET ${setClause} WHERE id = ?`
    ).bind(...values);

    await stmt.run();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
