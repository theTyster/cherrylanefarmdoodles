import { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { exec } from "node:child_process";
import CripToe from "criptoe";

const readSecrets = await readFile(resolve("../.dev.vars"));
const secretWrappingKey = readSecrets.toString().trim().split("=")[1];

const r2DirectoryPaths = [
//  join("./uploads/Group_Photos"),
//  join("./uploads/Headshots_Lg"),
  join("./uploads/Headshots_Sm"),
];

// Mapping of dog Images to their respective dogIds.
// The id is also used to create the SQL script which removes the placeholder text.
const imagesForDogs = {
  "Dune-HeadshotSM.jpeg": 14,
} as const;

type DogImages = keyof typeof imagesForDogs;

//const imageFileNames = Object.keys(imagesForDogs) as DogImages[];

const outputDirectoryPaths = "generated_files";

const r2Paths = await Promise.all(
  r2DirectoryPaths.map(async (path) => {
    const files = await readdir(path, {
      withFileTypes: true,
    });
    return files.map((file: Dirent) => {
      if (file.isFile()) {
        const childPath = join(path, file.name);
        return childPath as DogImages | undefined;
      }
    });
  })
);

exec(`echo '' > ${outputDirectoryPaths}/Dog_To_Group_Photos.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Group_Photos.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Headshots_Lg.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Headshots_Sm.sql`);
exec(`echo '#!/bin/bash' > ${outputDirectoryPaths}/paths.sh`);
exec(`echo '#!/bin/bash' > ${outputDirectoryPaths}/rename.sh`);

const r2PathsFlat = r2Paths.flat();
/*const encryptedURLs = */ await Promise.all(
  r2PathsFlat.map(async (path, index) => {
    if (!path)
      return "skipping"; // Skip other directories like Miniflare's node_modules
    else {
      const data = {} as {
        filePath: string;
        fileName: DogImages;
        id: number;
        table: "Group_Photos" | "Headshots_Sm" | "Headshots_Lg";
        hash: string;
        transformUrl: string;
      };
      const variantMatch = path.match(
        /.*Group_Photos\/|.*Headshots_Sm\/|.*Headshots_Lg\//
      );
      const variantGroupMatch = variantMatch
        ?.toString()
        .match(/Group_Photos|Headshots_Sm|Headshots_Lg/);
      const variant = variantGroupMatch?.toString() as
        | "Group_Photos"
        | "Headshots_Sm"
        | "Headshots_Lg";

      const fileName = path.split("/").pop() as DogImages;

      if (!imagesForDogs[fileName])
        throw new Error(
          "No file name found in imagesForDogs for file " + fileName
        );

      // Begin Entering data
      data.filePath = path;
      data.id = imagesForDogs[fileName];
      data.fileName = fileName;
      data.table = variant;

      const hasher = new CripToe(path);
      const hash = await hasher.sha256();

      data.hash = hash;

      const params = new URLSearchParams();
      const paramNames = ["src", "d1table", "v"] as const;
      params.set(paramNames[0], hash);
      params.set(paramNames[2], variant);

      const url = new URL("https://media.cherrylanefarmdoodles.com/");

      url.search = params.toString();

      const criptoe = new CripToe(params.toString());
      const { wrappedKey } = await criptoe.wrapKey(
        { export: true, safeURL: true, toBase64: false },
        secretWrappingKey
      );

      const { cipher, initVector } = (await criptoe.encrypt({
        safeURL: true,
      })) as { cipher: string; initVector: string };
      url.searchParams.delete("src");
      url.searchParams.delete("d1table");
      url.searchParams.delete("v");

      url.pathname = cipher;
      url.searchParams.set("iv", initVector);
      url.searchParams.set("k", wrappedKey);

      data.transformUrl = url.toString();

      //console.log(data);

      // Get Script for uploading to R2
      exec(
        `
        echo 'npx wrangler r2 object put # --local # cherrylanefarmpics/${data.hash} --cl "en-us" --file="hashes/${data.hash}"' >> ${outputDirectoryPaths}/paths.sh;
        `
      );

      // Get Script for renaming files with correct hashes.
      exec(
        `
        mkdir -p ${outputDirectoryPaths}/hashes;
        echo 'cp ../${r2PathsFlat[index]} ./hashes/${data.hash}' >> ${outputDirectoryPaths}/rename.sh;
      `
      );

      if (data.table === "Group_Photos")
        exec(
          `
          echo 'INSERT OR REPLACE INTO ${data.table} (alt, hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Group_Photos.sql
          echo 'INSERT OR REPLACE INTO Dog_To_Group_Photos (dogId, Group_Photos) VALUES (${data.id}, "${data.transformUrl}");' >> ${outputDirectoryPaths}/Dog_To_Group_Photos.sql
          echo 'UPDATE Dog_To_Group_Photos SET Group_Photos = "${data.transformUrl}" WHERE dogId = ${data.id};' >> ${outputDirectoryPaths}/Group_Photos.sql;
          echo 'UPDATE Families SET Group_Photos = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Group_Photos.sql;
          `
        );

      if (data.table === "Headshots_Lg")
        exec(
          `
          echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Headshots_Lg.sql
          echo 'UPDATE Dogs SET Headshots_Lg = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Headshots_Lg.sql
          echo 'DELETE FROM Headshots_Lg WHERE hash = "${data.id}placeholder";' >> ${outputDirectoryPaths}/Headshots_Lg.sql
          `
        );

      if (data.table === "Headshots_Sm")
        exec(
          `
          echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Headshots_Sm.sql
          echo 'UPDATE Dogs SET Headshots_Sm = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Headshots_Sm.sql
          echo 'DELETE FROM Headshots_Sm WHERE hash = "${data.id}placeholder";' >> ${outputDirectoryPaths}/Headshots_Sm.sql
          `
        );

      console.log(data);
    }
  })
);
console.log("Generated Sql and hashes for ", r2PathsFlat.length, " files");
//
//const decryptedURLs = await Promise.all(
//  encryptedURLs.map(async (url) => {
//    if (!url) return;
//
//    const urlObj = new URL(url);
//
//    // GET DATA OUT OF URL
//    const encryptedString = urlObj.pathname.split("/")[1];
//    const iv = urlObj.searchParams.get("iv") as string;
//    const wrappedKey = urlObj.searchParams.get("k") as string;
//
//    // WRAPPED KEY -> BUFFER FOR UNWRAPPING
//    const wrappedBuf = Buffer.from(wrappedKey, "base64url");
//
//    // INJECT DATA INTO CRIPTOE INSTANCE
//    const criptoe = new CripToe(encryptedString);
//
//    // UNWRAP THE KEY
//    await criptoe.unwrapKey(wrappedBuf, secretWrappingKey);
//
//    // GET THE KEY BACK OUT
//    const { key } = await criptoe.encrypt();
//
//    const unencryptedMessage = await criptoe.decrypt(encryptedString, key, iv);
//
//    return unencryptedMessage;
//  })
//);
