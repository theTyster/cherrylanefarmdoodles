"use server";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import CripToe from "criptoe";
import Statements from "@/constants/statements";

export type DogImageData = {
  dogId: number;
  table: "Group_Photos" | "Headshots_Sm" | "Headshots_Lg";
  id: string;
};

export default async function AddImages(
  file: File | null,
  dogId: number,
  variant:
    | (typeof G)["Headshots_Sm"]
    | (typeof G)["Headshots_Lg"]
    | (typeof G)["Group_Photos"]
): Promise<string | null> {
  if (!file) return null;

  const data: DogImageData = {} as DogImageData;

  const D1 = getRequestContext().env.dogsDB;
  const R2 = getRequestContext().env.dogImages;
  const secretWrappingKey = getRequestContext().env.wrappingKey;

  // Collect all the properties that we already have.
  data.dogId = dogId;
  data.table = variant;

  // Create the unencrypted transform URL.
  const params = new URLSearchParams();
  const paramNames = ["src", "d1table", "v"] as const;
  params.set(paramNames[2], data.table);

  // get the wrapped encryption Key.
  const criptoe = new CripToe(params.toString());
  const { wrappedKey } = await criptoe.wrapKey(
    { export: true, safeURL: true, toBase64: false },
    secretWrappingKey
  );

  // Attach the transformation params to the root url.
  const mediaUrl = new URL("https://media.cherrylanefarmdoodles.com/");
  mediaUrl.search = params.toString();

  // Encrypt the transformation url.
  const { cipher, initVector } = (await criptoe.encrypt({
    safeURL: true,
  })) as { cipher: string; initVector: string };

  // Remove the unencrypted params.
  mediaUrl.searchParams.delete("src");
  mediaUrl.searchParams.delete("d1table");
  mediaUrl.searchParams.delete("v");

  // Append the encrypted params.
  mediaUrl.pathname = cipher;
  mediaUrl.searchParams.set("iv", initVector);
  mediaUrl.searchParams.set("k", wrappedKey);

  // Attach the encrypted transform url to the data.
  data.id = mediaUrl.toString();

  // Insert the image into the R2 bucket and D1
  if (variant !== G["Group_Photos"]) {
    const insertStatement = new Statements().makeInsertStatement<
      typeof variant,
      "alt"
    >(variant, {
      [G.id]: data.id,
    });

    const fileBody = await file.arrayBuffer();
    await R2.put(data.id, fileBody, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    await D1.prepare(insertStatement).run();

    return data.id;
  }
  return null;
}
