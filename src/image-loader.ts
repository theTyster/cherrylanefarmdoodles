// Loader simply parses a URL and returns a new URL with the desired parameters.

// Must be declared globally in the image-loader file for successful typing.

/**
 * The allowed transformations for images should be based on the image type.
 **/
export const ALLOWED_TRANSFORMS = {
  Group_Photos: {
    width: 800,
    quality: 80,
  },
  Headshots_Lg: {
    width: 300,
    quality: 80,
  },
  Headshots_Sm: {
    width: 100,
    quality: 80,
  },
  withWatermarkTransform: {
    // This should not be a a query parameter.
    width: 300,
    quality: 80,
  },
  logoTransform: {
    width: 300,
    quality: 80,
  },
  /**@default*/
  default: {
    width: 100,
    quality: 20,
  },
} as const;

type CLFAllowedTransformOptsKeys =
  (typeof ALLOWED_TRANSFORMS)[keyof typeof ALLOWED_TRANSFORMS];
type CLFAllowedTransformOpts = keyof typeof ALLOWED_TRANSFORMS;

export class ImageLoader {
  /**
   * The Image ID as specified in D1.
   **/
  imageID: string;

  /**
   * The Transformations Allowed for a specific image type.
   **/
  readonly transforms: CLFAllowedTransformOptsKeys;

  /**
   * Directory for transforming images.
   **/
  readonly pathname: "i";
  readonly imageTable: CLFAllowedTransformOpts;

  /**
   * The normalized URL for the image.
   **/
  imageURL: string | undefined;

  /**
   * The ImageLoader class is responsible for transforming image urls.
   *
   * @param src - The URL of the image to be transformed. e.g. "Group_Photos?r=1"
   * @returns A new ImageLoader instance.
   * @example const loader = new ImageLoader("Group_Photos?r=1");
   **/
  constructor(src: string) {
    console.log(src);
    const splitSrc = src.split("?");

    const transform = "default";

    this.imageTable = splitSrc.shift() as CLFAllowedTransformOpts;
    const srcAsSearchParam = new URLSearchParams(splitSrc.toString());

    this.transforms = ALLOWED_TRANSFORMS[transform ? transform : "default"];
    this.pathname = "i";
    this.imageID = srcAsSearchParam.get("r")!;
    this.imageURL = undefined;
  }

  makeNormalizedURL() {
    //this.imageURL = `https://preview.cherrylanefarmdoodles.pages.dev/${this.pathname}/${this.imageTable}?r=${this.imageID}`;
    this.imageURL = 'https://morning-cloud-r2.cherrylane-admin.workers.dev';
    return this.imageURL;
  }

  async addTransforms() {
    this.makeNormalizedURL();
    const res = await ( fetch(this.imageURL!, { cf: { image: this.transforms } }));
    const modified = res + " modified";
    this.imageURL = "hi";
    console.log(this.imageURL);
    return modified;
  }
}

export default function CloudflareImageLoader({ src }: { src: string }) {
  const loader = new ImageLoader(src);
  loader.addTransforms();
  return loader.imageURL;
}
