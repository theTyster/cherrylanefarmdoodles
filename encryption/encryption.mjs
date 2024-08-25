import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { exec } from "node:child_process";
import CripToe from "criptoe";
const readSecrets = await readFile(resolve("../.dev.vars"));
const secretWrappingKey = readSecrets.toString().trim().split("=")[1];
const r2DirectoryPaths = [
    join("./uploads/Group_Photos"),
    join("./uploads/Headshots_Lg"),
    join("./uploads/Headshots_Sm"),
];
const imagesForDogs = {
    "Hailee_Lg.jpeg": 3,
    "Hailee_Sm.jpeg": 3,
    "Knox.jpeg": 2,
    "Knox_Sm.jpeg": 2,
    "Piper_Lg.jpeg": 1,
    "Piper_Sm.jpeg": 1,
    "Benedict.JPEG": 1,
    "Benedict_Sm.JPEG": 1,
    "Colin.JPEG": 2,
    "bow-tie-Colin.JPG": 1,
    "green-bow-Daphne.JPG": 1,
    "white-bow-Francesca.JPG": 1,
    "Colin_08-24.JPEG": 2,
    "Colin_Sm.JPEG": 2,
    "Daphne.JPEG": 3,
    "Daphne_Sm.JPEG": 3,
    "Daphne_08-24.JPEG": 3,
    "Eloise.JPEG": 4,
    "Eloise_Sm.JPEG": 4,
    "Francesca.JPEG": 5,
    "Francesca_08-24.JPEG": 5,
    "Francesca_Sm.JPEG": 5,
    "Kate.JPEG": 6,
    "Kate_Sm.JPEG": 6,
    "Lady_Whistledown.JPEG": 7,
    "Lady_Whistledown_Sm.JPEG": 7,
    "Daphne_Francesca.JPEG": 1,
    "PipersLitter_07_2024.JPEG": 1,
};
const imageFileNames = Object.keys(imagesForDogs);
const outputDirectoryPaths = "generated_files";
const r2Paths = await Promise.all(r2DirectoryPaths.map(async (path) => {
    const files = await readdir(path, {
        withFileTypes: true,
    });
    return files.map((file) => {
        if (file.isFile()) {
            const childPath = join(path, file.name);
            return childPath;
        }
    });
}));
exec(`echo '' > ${outputDirectoryPaths}/Dog_To_Group_Photos.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Group_Photos.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Headshots_Lg.sql`);
exec(`echo '' > ${outputDirectoryPaths}/Headshots_Sm.sql`);
exec(`echo '#!/bin/bash' > ${outputDirectoryPaths}/paths.sh`);
exec(`echo '#!/bin/bash' > ${outputDirectoryPaths}/rename.sh`);
const r2PathsFlat = r2Paths.flat();
/*const encryptedURLs = */ await Promise.all(r2PathsFlat.map(async (path, index) => {
    if (!path)
        return "skipping"; // Skip other directories like Miniflare's node_modules
    else {
        const data = {};
        const variantMatch = path.match(/.*Group_Photos\/|.*Headshots_Sm\/|.*Headshots_Lg\//);
        const variantGroupMatch = variantMatch
            ?.toString()
            .match(/Group_Photos|Headshots_Sm|Headshots_Lg/);
        const variant = variantGroupMatch?.toString();
        const fileName = path.split("/").pop();
        if (!imagesForDogs[fileName])
            throw new Error("No file name found in imagesForDogs for file " + fileName);
        // Begin Entering data
        data.filePath = path;
        data.id = imagesForDogs[fileName];
        data.fileName = fileName;
        data.table = variant;
        const hasher = new CripToe(path);
        const hash = await hasher.sha256();
        data.hash = hash;
        const params = new URLSearchParams();
        const paramNames = ["src", "d1table", "v"];
        params.set(paramNames[0], hash);
        params.set(paramNames[2], variant);
        const url = new URL("https://media.cherrylanefarmdoodles.com/");
        url.search = params.toString();
        const criptoe = new CripToe(params.toString());
        const { wrappedKey } = await criptoe.wrapKey({ export: true, safeURL: true, toBase64: false }, secretWrappingKey);
        const { cipher, initVector } = (await criptoe.encrypt({
            safeURL: true,
        }));
        url.searchParams.delete("src");
        url.searchParams.delete("d1table");
        url.searchParams.delete("v");
        url.pathname = cipher;
        url.searchParams.set("iv", initVector);
        url.searchParams.set("k", wrappedKey);
        data.transformUrl = url.toString();
        //console.log(data);
        // Get Script for uploading to R2
        exec(`
        echo 'npx wrangler r2 object put # --local # cherrylanefarmpics-prev/${data.hash} --cl "en-us" --file="../${r2PathsFlat[index]}"' >> ${outputDirectoryPaths}/paths.sh;
      `);
        // Get Script for renaming files with correct hashes.
        exec(`
        mkdir -p ${outputDirectoryPaths}/hashes;
        echo 'cp ../${r2PathsFlat[index]} ./hashes/${data.hash}' >> ${outputDirectoryPaths}/rename.sh;
      `);
        if (data.table === "Group_Photos")
            exec(`
          echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Group_Photos.sql
          echo 'INSERT OR REPLACE INTO Dog_To_Group_Photos (dogId, Group_Photos) VALUES (${data.id}, "${data.transformUrl}");' >> ${outputDirectoryPaths}/Dog_To_Group_Photos.sql
          echo 'UPDATE Dog_To_Group_Photos SET Group_Photos = "${data.transformUrl}" WHERE dogId = ${data.id};' >> ${outputDirectoryPaths}/Group_Photos.sql;
          echo 'UPDATE Families SET Group_Photos = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Group_Photos.sql;
          `);
        if (data.table === "Headshots_Lg")
            exec(`
          echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Headshots_Lg.sql
          echo 'UPDATE Dogs SET Headshots_Lg = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Headshots_Lg.sql
          `);
        if (data.table === "Headshots_Sm")
            exec(`
          echo 'INSERT OR REPLACE INTO ${data.table} (hash, transformUrl) VALUES ("${data.hash}", "${data.transformUrl}");' >> ${outputDirectoryPaths}/Headshots_Sm.sql
          echo 'UPDATE Dogs SET Headshots_Sm = "${data.transformUrl}" WHERE id = ${data.id};' >> ${outputDirectoryPaths}/Headshots_Sm.sql
          `);
        console.log(data);
    }
}));
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
