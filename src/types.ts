import { sections } from "./pages/_app";

export type Sections = (typeof sections)[number];

export type WhiteWoodTanLayout = [
  WhiteLayoutType: () => React.JSX.Element | null,
  WoodLayoutType: () => React.JSX.Element | null,
  TanLayoutType: () => React.JSX.Element | null
];
