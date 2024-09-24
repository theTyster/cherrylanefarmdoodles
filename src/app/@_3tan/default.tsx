import Theme from "@styles/_theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = 'edge';

export default function TanLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder dogFill={Theme.lightPrimary}/>;
}
