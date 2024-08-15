import Theme from "@/styles/theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = 'edge';

export default function WoodLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder dogFill={Theme.lightPrimary}/>;
}
