import Image from "next/image";
import css from "@/styles/Headshots_Lg.module.scss";
import { VARIANTS } from "cherrylanefarms-utils";

export const runtime = "edge";

const LG = VARIANTS.Headshots_Lg;

function LargeHeadshot({
  src,
  alt,
  gender,
}: {
  src: string;
  alt: string;
  gender: "M" | "F";
}) {
  return (
    <Image
      className={css.largeHeadshot}
      style={gender === "M" ? { border: "2px solid #00f" } : { border: "2px solid #f00" }}
      src={src}
      alt={alt}
      width={500}
      height={500}
    />
  );
}

export default LargeHeadshot;
