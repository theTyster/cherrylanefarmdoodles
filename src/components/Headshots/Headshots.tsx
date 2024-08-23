import CLFImage from "../CLFImage/CLFImage";
import { D1Tables as D1T } from "@/constants/data";
import { VARIANTS, MorF } from "cherrylanefarms-utils";

// CSS
import css from "@styles/headshots.module.scss";

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
          className: morf(`${css["dad"]} ${css['lg']}`, `${css['mom']} ${css["lg"]}`),
          width: 500,
          height: 666,
        }
      : {
          ...SM,
          className: morf(`${css["dad"]} ${css['sm']}`, `${css['mom']} ${css["sm"]}`),
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
