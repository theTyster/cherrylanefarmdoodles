import CLFImage from "@/components/CLFImage/CLFImage";
import { D1Tables as D1T } from "@/constants/data";
import { type StaticImageData } from "next/image";

// CSS
import css from "@styles/headshots.module.scss";

export const runtime = "edge";

function Headshot({
  variant,
  src,
  alt,
  className,
  style,
  ...props
}: {
  variant: typeof D1T.Headshots_Lg | typeof D1T.Headshots_Sm;
  src: StaticImageData | string | null;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  const classNameMod = className ? className : "";
  let defaultProps;
  if (variant === D1T.Headshots_Lg)
    defaultProps = {
      className: `${classNameMod} ${css.root_lg}`,
      width: 500,
      height: 666,
    };
  else if (variant === D1T.Headshots_Sm)
    defaultProps = {
      className: `${classNameMod} ${css.root_sm}`,
      width: 292,
      height: 292,
    };
  // Default to small headshot
  else
    defaultProps = {
      className: `${classNameMod} ${css.root_sm}`,
      width: 292,
      height: 292,
    };
  return (
    <CLFImage
      src={src}
      alt={alt}
      style={style && src ? style : { ...style, aspectRatio: 1/1 }}
      {...defaultProps}
      {...props}
    />
  );
}

export default Headshot;
