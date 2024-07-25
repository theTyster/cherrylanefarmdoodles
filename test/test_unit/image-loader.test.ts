import { describe, test, expect } from "vitest";
import { ImageLoader as CloudflareImageLoader } from "@/image-loader";
import { DevImageLoader as DevCloudflareImageLoader } from "@/image-loader__dev";

// Copilot, how do I do an import as statement with es modules?
//
//Copilot: 
//You can use the import statement with the as keyword to rename the imported module. Here is an example:
//
//import * as fs from 'fs';
//
// would I do a named import and a default import with this?
//
// Copilot:
// Yes, you can use the as keyword with both named imports and default imports. Here is an example:
//
// import fs, * as fs2 from 'fs';
//
// Does the 'as' keyword need to be preceded with a '*'?
// Or are there other ways to import with 'as'?
//
// Copilot:
// The 'as' keyword is used to rename the imported module. It can be used with both named imports and default imports. Here is an example:
//
// import * as fs from 'fs';
//
// You can also use the 'as' keyword with a default import like this:
//
// import fs as fs2 from 'fs';
//

describe("CloudflareImageLoader", () => {
  test("should return a new ImageLoader instance", () => {
    const opts = {
      imageID: 1,
      imageTable: "Group_Photos",
    } as const;
    const loader = new CloudflareImageLoader(opts);

    expect(loader.makeNormalizedURL()).toBe("i/Group_Photos?r=1");
    expect(loader).toMatchSnapshot();
  });
});

describe("DevCloudflareImageLoader", () => {
  test("should return a new ImageLoader instance", () => {
    const opts = {
      imageID: 1,
      imageTable: "Group_Photos",
    } as const;
    const loader = new DevCloudflareImageLoader(opts);

    expect(loader.makeNormalizedURL()).toBe("http://localhost:3000/i/Group_Photos?r=1");
    expect(loader).toMatchSnapshot();
  });
});
