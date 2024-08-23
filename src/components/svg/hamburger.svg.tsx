import Theme from "@styles/theme.module.scss";

import * as React from "react";
const SvgHamburger = ({ dim }: {dim: 60}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dim}
    height={dim}
    viewBox={"0 0 62 62"}
    id="menu-ham-icon"
  >
    <rect id="ham-top" width={dim} height={10} x={0} y={0 } fill={Theme.tertiaryCherry} rx={5} />
    <rect id="ham-mid" width={dim} height={10} x={0} y={20} fill={Theme.tertiaryCherry} rx={5} />
    <rect id="ham-bot" width={dim} height={10} x={0} y={40} fill={Theme.tertiaryCherry} rx={5} />
  </svg>
);
export default SvgHamburger;

