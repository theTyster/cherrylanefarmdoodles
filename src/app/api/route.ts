// api/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: Request, ctx: RequestContext) {
    const R2 = getRequestContext().env.dogImages;
    const res = await R2.get("1_group.jpg");

    return new Response(res!.body)
}
