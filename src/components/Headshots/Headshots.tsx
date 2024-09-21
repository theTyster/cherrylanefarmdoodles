import CLFImage from "../CLFImage/CLFImage";
import { D1Tables as D1T } from "@/constants/data";
import { MorF } from "@/constants/Morf";
import { type StaticImageData } from "next/image";

// CSS
import css from "@styles/headshots.module.scss";

export const runtime = "edge";

function Headshot({
  variant,
  src,
  alt,
  gender,
  id,
  className,
}: {
  variant: typeof D1T.Headshots_Lg | typeof D1T.Headshots_Sm;
  src: StaticImageData | string | null;
  alt: string;
  gender: "M" | "F";
  id?: string;
  className?: string;
}) {
  const morf = MorF(gender);
  const props =
    variant === D1T.Headshots_Lg
      ? {
          className: `${css.lg} ${morf(css.dad, css.mom)} ${className ? className : ""}`,
          width: 500,
          height: 666,
        }
      : {
          className: `${css.sm} ${morf(css.dad, css.mom)} ${className ? className : ""}`,
          width: 292,
          height: 292,
        };
  return <CLFImage id={id ? id : undefined} src={src} alt={alt} {...props} />;
}

export default Headshot;
