import { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { exec } from "node:child_process";
import { D1Tables } from "cherrylanefarms-utils";
import CripToe from "criptoe";

const readSecrets = await readFile(resolve("../.dev.vars"));
const secretWrappingKey = readSecrets.toString().trim().split("=")[1];

const r2DirectoryPaths = [
  join("./uploads/Group_Photos"),
  join("./uploads/Headshots_Lg"),
  join("./uploads/Headshots_Sm"),
];

const r2Paths = await Promise.all(
  r2DirectoryPaths.map(async (path) => {
    const files = await readdir(path, {
      withFileTypes: true,
    });
    return files.map((file: Dirent) => {
      if (file.isFile()) {
        const childPath = join(path, file.name);
        return childPath;
      }
    });
  })
);
//  console.log(
//    exec(
//      `
//        echo '' > Group_Photos.sql
//        `
//    ).stdout?.toArray()
//  );
//
//  console.log(
//    exec(
//      `
//        echo '' > Headshots_Lg.sql
//        `
//    ).stdout?.toArray()
//  );
//
//  console.log(
//    exec(
//      `
//        echo '' > Headshots_Sm.sql
//        `
//    ).stdout?.toArray()
//  );
//
const r2PathsFlat = r2Paths.flat();
const encryptedURLs = await Promise.all(
  r2PathsFlat.map(async (path, index) => {
    if (!path) return; // Skip other directories like Miniflare's node_modules
    else {
      const data = {} as {
        id: string;
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

      const dogIdMatch = path
        .match(/__[0-9]_/)
        ?.toString()
        .replace(/_/g, "")
        .replace(/-/g, "");

      const dogId = Number.parseFloat(dogIdMatch as string);

      data.id = dogId.toString();

      data.table = variant;

      if (variantMatch) path = path.replace(variantMatch[0], "");

      data.hash = path;

      const params = new URLSearchParams();
      params.set("src", path);
      params.set("d1table", D1Tables.Group_Photos.toString());
      params.set("v", variant);

      const url = new URL("https://media.cherrylanefarmdoodles.com/");

      url.search = params.toString();
      console.log(url.search);

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

      //// Get Script for uploading to R2
      //  console.log(
      //    await exec(
      //      `
      //    echo 'npx wrangler r2 object put # --local # cherrylanefarmpics-prev/${data.hash} --cl "en-us" --file="${r2PathsFlat[index]}"' >> paths.sh;
      //  `
      //    ).stdout?.toArray()
      //  );

      //if (data.table === "Group_Photos")
      //  console.log(
      //    exec(
      //      `
      //  echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> Group_Photos.sql
      //  echo 'UPDATE Dog_To_Group_Photos SET Group_Photos = "${data.transformUrl}" WHERE dogId = ${data.id};' >> Group_Photos.sql;
      //  echo 'UPDATE Families SET Group_Photos = "${data.transformUrl}" WHERE id = ${data.id};' >> Group_Photos.sql;
      //
      //  `
      //    ).stdout?.toArray()
      //  );

      //if (data.table === "Headshots_Lg")
      //  console.log(
      //    exec(
      //      `
      //  echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> Headshots_Lg.sql
      //  echo 'UPDATE Dogs SET Headshots_Lg = "${data.transformUrl}" WHERE id = ${data.id};' >> Headshots_Lg.sql
      //  `
      //    ).stdout?.toArray()
      //  );

      //if (data.table === "Headshots_Sm")
      //  console.log(
      //    exec(
      //      `
      //  echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> Headshots_Sm.sql
      //  echo 'UPDATE Dogs SET Headshots_Sm = "${data.transformUrl}" WHERE id = ${data.id};' >> Headshots_Sm.sql
      //  `
      //    ).stdout?.toArray()
      //  );

      //console.log(data);
      return url.toString();
    }
  })
);
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
