import { sections } from "./pages/_app";

export type Sections = (typeof sections)[number];

export type ThreePartLayout = {
  readonly WhiteLayout: React.JSX.Element;
  readonly WoodLayout: React.JSX.Element;
  readonly TanLayout: React.JSX.Element;
};
