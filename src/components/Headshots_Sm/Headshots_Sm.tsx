import Image from "next/image";
import css from "@/styles/Headshots_Sm.module.scss";
import { VARIANTS } from "cherrylanefarms-utils";

export const runtime = "edge";

const SM = VARIANTS.Headshots_Sm;

function SmallHeadshot({
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
      className={css.smallHeadshot}
      style={gender === "M" ? { border: "2px solid #00f" } : { border: "2px solid #f00" }}
      src={src}
      alt={alt}
      width={292}
      height={292}
    />
  );
}

export default SmallHeadshot;
