import { sections } from "./pages/_app";

type sections = readonly ["white", "wood", "tan"];

export type Sections = (sections)[number];

export type WhiteWoodTanLayout = [
  WhiteLayoutType: () => React.JSX.Element | null,
  WoodLayoutType: () => React.JSX.Element | null,
  TanLayoutType: () => React.JSX.Element | null
];
