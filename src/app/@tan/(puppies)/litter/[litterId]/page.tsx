import Theme from "@/styles/theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = 'edge';

export default function TanSectionLitter(): React.JSX.Element | null {
  return <ConstructionPlaceholder dogFill={Theme.lightPrimary}/>;
}
