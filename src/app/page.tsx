import Theme from "@/styles/theme.module.scss";
import WhiteWoodTanStyler from "@/components/white-wood-tan-styler";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = 'edge';

// "white"
function WhiteLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder />;
}
// "wood"
function WoodLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder dogFill={Theme.lightPrimary}/>;
}
// "tan"
function TanLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder />;
}

export default function Home(): React.JSX.Element {
  return <>{WhiteWoodTanStyler(WhiteLayout, WoodLayout, TanLayout)}</>;
}
