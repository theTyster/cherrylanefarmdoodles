// Loader simply parses a URL and returns a new URL with the desired parameters.

/**
 * Must be declared globally for successful typing.
 **/
const ALLOWED_TRANSFORMS = {
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
    width: 300,
    quality: 80,
  },
  logoTransform: {
    width: 300,
    quality: 80,
  },
  default: {
    width: 300,
    quality: 80,
  },
} as const;

type CLFAllowedTransformOptsKeys =
  (typeof ALLOWED_TRANSFORMS)[keyof typeof ALLOWED_TRANSFORMS];
type CLFAllowedTransformOpts = keyof typeof ALLOWED_TRANSFORMS;

export interface ImageLoaderType {
  imageID: number;
  imageTable: CLFAllowedTransformOpts;
  transform?: CLFAllowedTransformOpts;
}

export class ImageLoader implements ImageLoaderType {
  /**
   * The provided src string
   **/
  imageID: number;

  /**
   * The Transformations Allowed for a specific image type.
   **/
  readonly transforms: CLFAllowedTransformOptsKeys;

  /**
   * Directory for transforming images.
   **/
  readonly pathname: "i";
  readonly imageTable: CLFAllowedTransformOpts;

//  /**
//   * Default Image Transformations.
//   **/
//  default: {
//    readonly width: 300;
//    readonly quality: 80;
//  };

  /**
   * The normalized URL for the image.
   **/
  imageURL: string | undefined;

  constructor(opts: ImageLoaderType) {

    const { imageID, imageTable, transform } = opts;
    this.imageTable = imageTable;
    this.transforms = ALLOWED_TRANSFORMS[transform ? transform : "default"];
    this.pathname = "i";
    this.imageID = imageID;
    this.imageURL = undefined;
  }


  makeNormalizedURL() {
    this.imageURL = `${this.pathname}/${this.imageTable}?r=${this.imageID}`;
    return this.imageURL;
  }
}

export default function CloudflareImageLoader(opts: ImageLoaderType) {
  const loader = new ImageLoader(opts);
  return loader.makeNormalizedURL();
}
