import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

const R2 = getRequestContext().env.dogImages;

export async function GET(request: Request) {
  console.log("new request: ", request);
  // Parse request URL to get access to query string
  const url = new URL(request.url);
  const { searchParams, hostname } = url;

  const requestedImage = searchParams.get("i");

  if (!requestedImage)
    return new Response('Missing "image" value', { status: 400 });

  // Get the image from R2
  const R2Image = await R2.get(requestedImage);

  if (!R2Image) return new Response("Image not found", { status: 404 });

  //if (hostname !== "cherrylanefarmdoodles.com")
  //  return new Response("We only optimize our own images.", {
  //    status: 403,
  //  });

  const cf = getRequestContext().cf;

  // set the transform options:
  const transform = function (
    opt: CLFAllowedTransformOpts
  ): (typeof transformOpts)[typeof opt] | typeof transformOpts.default {
    if (opt) {
      return transformOpts[opt];
    }

    return transformOpts.default;
  };

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

  /*
  // Get URL of the original (full size) image to resize.
  // You could adjust the URL here, e.g., prefix it with a fixed address of your server,
  // so that user-visible URLs are shorter and cleaner.
  const imageURL = url.searchParams.get("image");
  if (!imageURL) return new Response('Missing "image" value', { status: 400 });
*/
  /*
  try {
    // TODO: Customize validation logic
    const { hostname, pathname } = new URL(imageURL);

    // Optionally, only allow URLs with JPEG, PNG, GIF, or WebP file extensions
    // @see https://developers.cloudflare.com/images/url-format#supported-formats-and-limitations
    if (!/\.(jpe?g|png|gif|webp)$/i.test(pathname)) {
      return new Response("Disallowed file extension", { status: 400 });
    }

    // Demo: Only accept "example.com" images
    if (hostname !== "cherrylanefarmdoodles.com") {
      return new Response('Must use "example.com" source images', {
        status: 403,
      });
    }
  } catch (err) {
    return new Response('Invalid "image" value', { status: 400 });
  }
*/

  const headers = new Headers(request.headers);
/*  console.log(R2Image.body);*/
  const res = new Response(R2Image.body, { headers });
/*  console.log(res);*/
  return res;
}
