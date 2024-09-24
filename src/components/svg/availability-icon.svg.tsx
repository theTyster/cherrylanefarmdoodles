import * as React from "react";
import type { D1Vals } from "@/types/data";
import { D1Tables as D1T, GlobalNameSpaces as G } from "@/constants/data";
import style from "@styles/availability-icon.module.scss";

const SvgGuardianStar = ({
  css,
  className
}: {
  css?: React.CSSProperties;
  className?: string;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
    style={css}
    className={style.availability + " " + className}
  >
    <defs>
      <linearGradient
        id="gurdian-star_svg__a"
        x1={3.356}
        x2={20.933}
        y1={2.669}
        y2={15.728}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#e2ac20" />
        <stop offset={1} stopColor="#6b5210" />
      </linearGradient>
    </defs>
    <path
      fill="url(#gurdian-star_svg__a)"
      d="M4 0a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4z"
    />
    <path
      fill="#ebdc98"
      d="M29.03-7.44 20.758 7.198l7.368 15.113-16.478-3.344L-.448 30.645-2.359 13.94l-14.844-7.896 15.296-6.98 2.922-16.558L12.38-5.103z"
      transform="rotate(90 2.684 16.142)scale(.42971)"
    />
  </svg>
);
const SvgAvailableSquare = ({
  css,
  className,
}: {
  css?: React.CSSProperties;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#426932"
    viewBox="0 0 32 32"
    style={css}
    className={style.availability + " " + className}
  >
    <ellipse cx={16} cy={16} fill="#d3e8ca" rx={12} ry={12} />
    <path d="m22.39 10.4-6.932 12.01a.9.9 0 0 1-.248.4 1 1 0 0 1-1.413-.04l-4.572-4.22a.995.995 0 0 1 .046-1.41 1 1 0 0 1 1.414.04l3.578 3.3L20.658 9.4c.276-.47.887-.64 1.366-.36.478.27.642.89.366 1.36M27.997-.03h-24a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-24a4 4 0 0 0-4-4" />
  </svg>
);
const SvgPickedSquare = ({
  css,
  className,
}: {
  css?: React.CSSProperties;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={css}
    className={style.availability + " " + className}
  >
    <path
      fill="#b3b319"
      d="M4 0a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4z"
    />
    <path
      fill="#e8e8cb"
      d="M16 7.298A8.703 8.703 0 0 0 7.298 16 8.703 8.703 0 0 0 16 24.703 8.703 8.703 0 0 0 24.703 16 8.703 8.703 0 0 0 16 7.298m0 2.863A5.887 5.84 0 0 1 21.887 16 5.887 5.84 0 0 1 16 21.84 5.887 5.84 0 0 1 10.113 16 5.887 5.84 0 0 1 16 10.16"
    />
  </svg>
);
const SvgUnavailableSquare = ({
  css,
  className,
}: {
  css?: React.CSSProperties;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={css}
    className={style.availability + " " + className}
  >
    <ellipse cx={16} cy={16} fill="#ffc9d8" rx={12} ry={12} />
    <path
      fill="#b81641"
      d="M4 0a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4zm5.515 8.103c.36 0 .721.138.998.414L16 14.005l5.487-5.487a1.41 1.41 0 0 1 1.996 0 1.41 1.41 0 0 1 0 1.995L17.995 16l5.487 5.487a1.41 1.41 0 0 1 0 1.996 1.41 1.41 0 0 1-1.995 0L16 17.995l-5.487 5.488a1.41 1.41 0 0 1-1.996 0 1.41 1.41 0 0 1 0-1.996L14.005 16l-5.488-5.487a1.41 1.41 0 0 1 0-1.996c.277-.276.637-.414.998-.414"
    />
  </svg>
);
export { SvgAvailableSquare, SvgPickedSquare, SvgUnavailableSquare };
type Variant = D1Vals<
  typeof D1T.Puppies,
  typeof G.availability
>[typeof G.availability];
type Variants = {
  [key in Variant]: key;
};
const variants = {
  Available: "Available",
  Adopted: "Adopted",
  Picked: "Picked",
  "Available Guardian": "Available Guardian",
} satisfies Variants;
const AvailabilityIcon = ({
  availability,
  style,
  className,
}: {
  availability: Variant;
  style?: React.CSSProperties;
  className?: string;
}) => {
  switch (availability) {
    case variants["Available"]:
      return (
        <SvgAvailableSquare
          className={className}
          css={style ? style : undefined}
        />
      );
    case variants["Adopted"]:
      return (
        <SvgUnavailableSquare
          className={className}
          css={style ? style : undefined}
        />
      );
    case variants["Picked"]:
      return (
        <SvgPickedSquare
          className={className}
          css={style ? style : undefined}
        />
      );
    case variants["Available Guardian"]:
      return (
        <SvgGuardianStar
          className={className}
          css={style ? style : undefined}
        />
      );
    default:
      return (
        <SvgAvailableSquare
          className={className}
          css={style ? style : undefined}
        />
      );
  }
};
export default AvailabilityIcon;
