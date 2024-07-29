import { getRequestContext } from "@cloudflare/next-on-pages";
//import { ALLOWED_TRANSFORMS } from "@/image-loader";
import { D1Tables } from "@/utils";

export const runtime = "edge";

const ALLOWED_TRANSFORMS = {
  Group_Photos: {
    width: 800,
    quality: 80,
  },
  Headshots_Lg: {
    width: 300,
    quality: 80,
  },
  Headshots_Sm: {
    width: 100,
    quality: 80,
  },
  withWatermarkTransform: {
    // This should not be a a query parameter.
    width: 300,
    quality: 80,
  },
  logoTransform: {
    width: 300,
    quality: 80,
  },
  /**@default*/
  default: {
    width: 1,
    quality: 10,
  },
} as const;

//type CLFAllowedTransformOptsKeys =
//  (typeof ALLOWED_TRANSFORMS)[keyof typeof ALLOWED_TRANSFORMS];
//type CLFAllowedTransformOpts = keyof typeof ALLOWED_TRANSFORMS;


export async function GET(request: Request) {

ALLOWED_TRANSFORMS;

const R2 = getRequestContext().env.dogImages;

const D1 = getRequestContext().env.dogsDB;

try{
  // Parse request URL to get access to query string
  const url = new URL(request.url);
  const { searchParams/*, hostname*/ } = url;

  ///** ↪ RESPONSE*/
  //if (hostname !== "cherrylanefarmdoodles.com")
  //  return new Response("We only optimize our own images.", {
  //    status: 403,
  //  });

  const requestedImageID = searchParams.get("r");
  const requestedImageTable = url.pathname.split("i/")[1] as D1Tables;

  /** ↪ RESPONSE*/
  if (!requestedImageID || !(requestedImageTable in D1Tables))
    return new Response('Not a valid image.', { status: 400 });


  const D1Response = await D1
    .prepare(`
             SELECT
             imageName
              FROM ${requestedImageTable}
              WHERE ID = ?1
             `)
    .bind(requestedImageID)
    .first();

  if(!D1Response) return new Response('Image not referenced in database.', { status: 404 });

  // Get the image from R2
  const R2Image = await R2.get(requestedImageID+"_"+D1Response.imageName);

  /** ↪ RESPONSE*/
  if (!R2Image) return new Response("Image not found", { status: 404 });

  // This endpoint is responsible for automatic format negotiation. Check the Accept header.
//  const acceptFormat = function (
//    accept: string
//  ): RequestInitCfPropertiesImage["format"] {
//    if (accept && /image\/avif/.test(accept)) {
//      return "avif";
//    } else if (accept && /image\/webp/.test(accept)) {
//      return "webp";
//    }
//  };

//  const imageTransforms = {
//    width: 500,
//    format: acceptFormat(request.headers.get("Accept")),
//    quality: 80,
//    fit: "contain"
//  }

  //console.log("original: ", request.headers);
  //console.log("new: ", new Headers(cf))

//  const cfHeaders = new Headers(request.headers);
//
//  const cf: RequestInitCfPropertiesImage = {
//    image: imageTransforms,
//  };

  // Transforms happen as an image LEAVES the edge, so we don't need to make any subrequests. 
  // We simply need to return the image with the right headers, and provide validation to protect against transformation abuse.

  //const transformedImage = await fetch()

  ///** ↪ RESPONSE*/
//  const res = new Response(R2Image.body);
//return res;

const transformedImage = await fetch('https://morning-cloud-r2.cherrylane-admin.workers.dev', { cf: {image: {border: {color: "rgb(256,0,0,0)", top: 5, right: 10, bottom: 5, left: 10}}}})

return transformedImage;

}
catch (e) {
  return new Response((e as Error).message, { status: 500 });
}
}
