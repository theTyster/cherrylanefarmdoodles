import CLFImage from "../CLFImage/CLFImage";
import { D1Tables as D1T } from "@/constants/data";
import Theme from "@/styles/theme.module.scss";
import { VARIANTS, MorF } from "cherrylanefarms-utils";

export const runtime = "edge";

const SM = VARIANTS.Headshots_Sm;
const LG = VARIANTS.Headshots_Lg;

function Headshot({
  largeOrSmall,
  src,
  alt,
  gender,
  id,
}: {
  largeOrSmall: typeof D1T.Headshots_Lg | typeof D1T.Headshots_Sm;
  src: string | null;
  alt: string;
  gender: "M" | "F";
  id?: string;
}) {
  const morf = MorF(gender);
  const props =
    largeOrSmall === D1T.Headshots_Lg
      ? {
          ...LG,
          className: `${morf(Theme.dad, Theme.mom)} ${Theme.headshotLg}`,
          width: 500,
          height: 666,
        }
      : {
          ...SM,
          className: `${morf(Theme.dad, Theme.mom)} ${Theme.headshotSm}`,
          width: 292,
          height: 292,
        };
  return <CLFImage
      id={id ? id : undefined}
      src={src}
      alt={alt}
      {...props}
    />
}

export default Headshot;
