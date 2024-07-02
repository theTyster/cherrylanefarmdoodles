import * as React from "react";
const SvgHamburger = ({ dim }: {dim: 62}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dim}
    height={dim}
    viewBox={"0 0 62 62"}
    id="menu-ham-icon"
  >
    <rect id="ham-top" width={dim} height={10} x={0} fill="#850829" rx={5} />
    <rect id="ham-mid" width={dim} height={10} x={0} y={20} fill="#850829" rx={5} />
    <rect id="ham-bot"width={dim} height={10} x={0} y={40} fill="#850829" rx={5} />
  </svg>
);
export default SvgHamburger;

