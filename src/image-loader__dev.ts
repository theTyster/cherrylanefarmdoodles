import { ALLOWED_TRANSFORMS, D1Tables } from "cherrylanefarms-utils";
import { ImageLoader } from "./image-loader";
// Loader simply parses a URL and returns a new URL with the desired parameters.
// This loader supports localhost and is only to be used in development.

export class DevImageLoader extends ImageLoader {
  constructor(
    table:
      | (typeof D1Tables)["Group_Photos"]
      | (typeof D1Tables)["Headshots_Lg"]
      | (typeof D1Tables)["Headshots_Sm"],
    src: number,
    variant: keyof typeof ALLOWED_TRANSFORMS = "default"
  ) {
    super(table, src, variant);
  }

//  makeNormalizedURL(): string {
//    this.imageURL = `http://localhost:3000/${this.pathname}/${this.imageTable}?r=${this.imageID}`
//    this.imageURL = 'https://cherrylanefarmdoodles.com/cdn-cgi/image/fit=scale-down,width=100/https://cherrylanefarmdoodles.com/images/Piper.jpeg'
//    this.imageURL = 'https://morning-cloud-r2.cherrylane-admin.workers.dev';
//    return this.imageURL;
//  }
}

export default async function CloudflareImageLoader({
  table,
  src,
  variant,
}: {
  table:
    | (typeof D1Tables)["Group_Photos"]
    | (typeof D1Tables)["Headshots_Lg"]
    | (typeof D1Tables)["Headshots_Sm"];
  src: number;
  variant?: keyof typeof ALLOWED_TRANSFORMS;
}) {
  const loader = new ImageLoader(table, src, variant);
  await loader.encryptURL();
  return loader.imageURL;
}
