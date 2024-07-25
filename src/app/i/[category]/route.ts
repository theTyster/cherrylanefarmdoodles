import { getRequestContext } from "@cloudflare/next-on-pages";
import { ALLOWED_TRANSFORMS } from "@/image-loader";
import { D1Tables, D1Columns } from "@/utils";
import { describe, test, expect } from "vitest";

export const runtime = "edge";

const R2 = getRequestContext().env.dogImages;

const D1 = getRequestContext().env.dogsDB;

export async function GET(request: Request) {

  console.log("👀");
  // Parse request URL to get access to query string
  const url = new URL(request.url);
  const { searchParams, hostname } = url;

  ///** ↪ RESPONSE*/
  //if (hostname !== "cherrylanefarmdoodles.com")
  //  return new Response("We only optimize our own images.", {
  //    status: 403,
  //  });

  const requestedImageID = searchParams.get("r");

  /** ↪ RESPONSE*/
  if (!requestedImageID || !(requestedImageID in D1Tables))
    return new Response('Missing "image" value', { status: 400 });

  const requestedimageTable = url.pathname.split("i/")[1]

  const D1Response = await D1
    .prepare(`
             SELECT
             imageName
              FROM ${D1Columns[requestedimageTable]}
              WHERE ID = ?1
             `)
    .bind(requestedImageID)
    .first();

  // Get the image from R2
  const R2Image = await R2.get(requestedImageID+"_"+D1Response.imageName);

  /** ↪ RESPONSE*/
  if (!R2Image) return new Response("Image not found", { status: 404 });


  const cf = getRequestContext().cf;

  console.log(cf);

  // This endpoint is responsible for automatic format negotiation. Check the Accept header.
  const acceptFormat = function (
    accept: string
  ): RequestInitCfPropertiesImage["format"] {
    if (accept && /image\/avif/.test(accept)) {
      return "avif";
    } else if (accept && /image\/webp/.test(accept)) {
      return "webp";
    }
  };

  const headers = new Headers(request.headers);
/*  console.log(R2Image.body);*/
  const res = new Response(R2Image.body, { headers });
/*  console.log(res);*/
  return res;
}
