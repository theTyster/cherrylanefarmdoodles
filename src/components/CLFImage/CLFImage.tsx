import { Buffer } from "node:buffer";
import Image from "next/image";
import fallback from "@pub/images/404couldnt_find_picture.webp";
import { pawSVG } from "@/constants/base64PawURL";
import { type StaticImageData } from "next/image";

function CLFImage({
  src,
  alt,
  width,
  height,
  ...props
}: {
  src: StaticImageData | string | null;
  alt: string;
  width: number;
  height: number;
  [key: string]: unknown;
}) {
  return src ? (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      placeholder={`data:image/svg+xml;base64,${Buffer.from(pawSVG).toString(
        "base64"
      )}`}
      {...props}
    />
  ) : (
    <Image
      src={fallback}
      alt="Unable to find image."
      placeholder="blur"
      width={292}
      height={292}
      {...props}
    />
  );
}

export default CLFImage;
