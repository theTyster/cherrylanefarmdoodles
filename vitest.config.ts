/*{NOTE: DO NOT EXPECT TO TEST AGAINST A REAL DATABASE IN CLOUDFLARE D1.
 *
 * Cloudflare D1 does not really have a working mechanism for testing data
 * integrity, consistency, or even the existence of tables on the remote, or
 * local databases.
 *
 * Instead all of the tests are executed on "Miniflare", a local testing
 * environment that simulates the Cloudflare environment. This environment is
 * not connected to the Cloudflare D1 database and resets the data on each test
 * run.
 *
 * This means that the data you are testing against is not the same data you
 * are using in the Cloudflare D1 environment.
 *
 * To test the integrity of the live data in conjunction with the worker, you
 * would need to create a backup of the data, with:
 * "npx wrangler d1 export dogs_prod -e staging --local --output remote-backup.sql"
 *
 * Then, that backup would need to be run as a migration in miniflare.
 *
 * For a working example of how to do this, see:
 * https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples/d1
 *
 * After backing up, you could test that the data is continuously conforming
 * for the expected usage of the worker.
 *
 * This kind of CI could be a good candidate for a GitHub Action assuming it is
 * not too expensive to run.
 *
 * But, it is not realistic to test like this manually unless there is some
 * kind of unique migration needed.
 *
 * This test suite is designed to test the worker, not the integrity of the D1
 * data.
 *
 * Thus, For the purposes of this test suite, the data is all mocked and can be
 * viewed in the tets/migrations directory.
}*/
import { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  readD1Migrations,
  defineWorkersConfig,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  const migrationsPath = join(__dirname, "test/migrations");
  const migrations = await readD1Migrations(migrationsPath);
  const r2TestFileDirectoryPaths = [
    join(__dirname, "test/placeholders/groupPhotos"),
    join(__dirname, "test/placeholders/large"),
    join(__dirname, "test/placeholders/small"),
  ];

  const r2TestFilePaths = await Promise.all(
    r2TestFileDirectoryPaths.map(async (dirPath: string) => {
      const files = await readdir(dirPath, {
        withFileTypes: true,
      });
      return Promise.all(
        files.map(async (file: Dirent) => {
          if (file.isFile()) {
            const childPath = join(dirPath, file.name);
            return childPath;
          }
        })
      );
    })
  );

  const r2TestFilePathsFlat = r2TestFilePaths.flat();

  const r2TestFileContents = (await Promise.all(
    r2TestFilePathsFlat.map(async (path) => {
      if (!path) return;
      return readFile(resolve(__dirname, path), "base64");
    })
  )) as string[];

  const R2Uploads = r2TestFilePathsFlat.reduce(
    (acc: Record<string, string>, path, index) => {
      if (!path) return acc; // Skip other directories like Miniflare's node_modules
      else {
        let keys = path.split("placeholders/")[1];
        keys = keys.split("/")[1];
        acc[keys] = r2TestFileContents[index];
        return acc;
      }
    },
    {} as Record<string, string>
  );

  return {
    test: {
      setupFiles: ["./test/migrateDB.ts"],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: "./wrangler.toml",
          },
          miniflare: {
            r2Buckets: ["r2TestBucket"],
            bindings: {
              TEST_MIGRATIONS: migrations,
              R2_TEST_FILES: R2Uploads,
            },
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        //"@test": path.resolve(__dirname, "test"),
      },
    },
  };
});
