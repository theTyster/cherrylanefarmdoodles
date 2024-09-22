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
  gender: ("M" | "F") | "U";
  id?: string;
  className?: string;
}) {
  const classNameMod = className ? className : "no-mods";
  const morf = gender !== "U" ? MorF(gender) : () => css.unrecordedDog;
  let props;
  if (variant === D1T.Headshots_Lg)
    props = {
      className: `${classNameMod} ${css.lg} ${morf(css.dad, css.mom)}`,
      width: 500,
      height: 666,
    };
  else if (variant === D1T.Headshots_Sm)
    props = {
      className: `${classNameMod} ${css.sm} ${morf(css.dad, css.mom)}`,
      width: 292,
      height: 292,
    };
  // Default to small headshot
  else
    props = {
      className: `${classNameMod} ${css.sm} ${morf(css.dad, css.mom)}`,
      width: 292,
      height: 292,
    };
  return <CLFImage id={id ? id : undefined} src={src} alt={alt} {...props} />;
}

export default Headshot;
