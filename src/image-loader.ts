import { ALLOWED_TRANSFORMS, D1Tables } from "cherrylanefarms-utils";
import { CripToe, type ExportedWrapsSafeURL, type EncryptReturnsSafeURL } from "thetyster-utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
// Loader simply parses a URL and returns a new URL with the desired parameters.

/**{
 * Here is the strategy for getting images out of the R2 bucket with transformations.
 *
 * OBJECTIVES:
 * - Do not allow other people to obtain full size images.
 * - Do not allow other people to abuse the transformation worker.
 * - Do not allow other people to modify transformations.
 *
 *   To achieve this, the plan is to add the transformations as some kind of JSON object or something in the URL.
 *   Maybe just a string. idk.
 *   Then, encrypt it with CripToe.
 *
 *   Then, send it to the Transformation worker.
 *   The transformation worker then decrypts it.
 *   The transformation worker then requests the SECRET URL that gets the image from the R2 bucket with the transformations added as headers.
 *
 *   This tranfer of data should be invisible to the mass public as much as possible.
 *
 *   Finally, the worker forwards the response on to the client who recieves the image without any sort of extra information about it available via the url.
 *
 *
 *   The entire process with encryption lookl like this:
 *
 *   1. The loader fetches salt from the worker at build time via RPC.
 *   2. The loader encrypts the transformations and the image UUID with the salt.
 *   3. The loader generates an encrypted url which contains the UUID and transformations.
 *   4. The loader paints this to the HTML.
 *   5. The client loads the HTML and requests the image with the encrypted URL.
 *   6. The worker decrypts the URL and requests the image from the R2 bucket as plaintext with the transformations.
 *   7. The worker forwards the image to the client.
 **/// }

/**
 * The ImageLoader class is responsible for transforming image urls.
 *
 * @param src - The row of the image in the D1 table. e.g. "1"
 * @param variant - The variant of the image to be transformed. e.g. "default"
 * @param table - The table of the image to be transformed. e.g. "Group_Photos"
 * @returns A new ImageLoader instance.
 * @example `const loader = new ImageLoader(1, "default", "Group_Photos");`
 **/
export class ImageLoader {
  /**
   * The Image ID as specified in D1.
   **/
/*  imageID: URLSearchParams;*/

  /**
   * The normalized URL for the image.
   **/
/*  imageURL: string;*/
/*  variant: keyof typeof ALLOWED_TRANSFORMS;*/
/*  table: string;
    | (typeof D1Tables)["Group_Photos"]
    | (typeof D1Tables)["Headshots_Lg"]
    | (typeof D1Tables)["Headshots_Sm"];*/
   src: string;

  /**
   * The ImageLoader class is responsible for transforming image urls.
   *
   * @param src - The row of the image in the D1 table. e.g. "1"
   * @param variant - The variant of the image to be transformed. e.g. "default"
   * @param table - The table of the image to be transformed. e.g. "Group_Photos"
   * @returns A new ImageLoader instance.
   * @example const loader = new ImageLoader("Group_Photos?r=1");
   **/
  constructor(
/*      | (typeof D1Tables["Group_Photos"])
      | (typeof D1Tables["Headshots_Lg"])
      | (typeof D1Tables["Headshots_Sm"]),*/
    src: string,
/*    variant: keyof typeof ALLOWED_TRANSFORMS = "default"*/
  ) {
    this.src = src;
/*    this.table = d1table;*/
    //this.imageID = src;
/*    this.variant = variant;
    this.imageURL = "https://media.cherrylanefarmdoodles.com/" + src;*/
  }

  makeNormalizedURL() {
  }

  async encryptURL() {
    const C = new CripToe(this.src);
    const { cipher, initVector } = (await C.encrypt({
      safeURL: true,
    })) as EncryptReturnsSafeURL;
    const { wrappedKey } = (await C.wrapKey({
      export: true,
      safeURL: true,
    })) as ExportedWrapsSafeURL;
/*    const newURL = new URL(this.imageURL);*/
//    newURL.searchParams.forEach((val, key) =>{
//      this.imageURL.searchParams.delete(key)
//      this.imageURL = this.imageURL;
//    }
//    );
    const newURL = new URL("https://media.cherrylanefarmdoodles.com/")
    newURL.pathname = encodeURIComponent(cipher);
    newURL.searchParams.set("iv", encodeURIComponent(initVector));
    newURL.searchParams.set("k", encodeURIComponent(wrappedKey));
    const returned = newURL.toString();
    console.log();
    console.log('returned\n',returned)
    console.log();
    return returned;
  }
}

export default async function CloudflareImageLoader({
/*  table,*/
/*  d1table,*/
/*  variant,*/
src,
}: {
/*  table:string;*/
/*    | (typeof D1Tables)["Group_Photos"]
    | (typeof D1Tables)["Headshots_Lg"]
    | (typeof D1Tables)["Headshots_Sm"];*/
/*  d1table: number;*/
/*  variant?: keyof typeof ALLOWED_TRANSFORMS;*/
  src: string;
}) {
 const loader = new ImageLoader(src);
 console.log('src\n', loader.src);
 const encrypted = await loader.encryptURL();
 console.log('encrypted\n', encrypted);
 return encrypted.toString();
// Copilot, Why is my Next.JS image component not rendering? 
// in the browser console, the image URL is showing as [object Promise]
//
//
//  console.log();
//  console.log();
//  console.log('encrypted\n',loader.imageURL.toString());
//  return loader.imageURL.toString();
}
