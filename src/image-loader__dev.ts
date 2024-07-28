// Loader simply parses a URL and returns a new URL with the desired parameters.
//
// This loader supports localhost and is only to be used in development.
import { ImageLoader } from "./image-loader";

export class DevImageLoader extends ImageLoader {
  constructor(src: string) {
    super(src);
  }

  makeNormalizedURL(): string {
    this.imageURL = `http://localhost:3000/${this.pathname}/${this.imageTable}?r=${this.imageID}`;
    return this.imageURL;
  }
}

export default function CloudflareImageLoader({ src }: { src: string }) {
  const loader = new DevImageLoader(src);
  return loader.makeNormalizedURL();
}
