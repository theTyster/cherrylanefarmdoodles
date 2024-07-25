// Loader simply parses a URL and returns a new URL with the desired parameters.
//
// This loader supports localhost and is only to be used in development.
import { ImageLoader, type ImageLoaderType } from "./image-loader";

export class DevImageLoader extends ImageLoader {
  constructor(opts: ImageLoaderType) {
    super(opts);
  }

  makeNormalizedURL(): string {
    this.imageURL = `http://localhost:3000/${this.pathname}/${this.imageTable}?r=${this.imageID}`;
    return this.imageURL;
  }
}

export default function CloudflareImageLoader(opts: ImageLoaderType) {
  const loader = new DevImageLoader(opts);
  return loader.makeNormalizedURL();
}
