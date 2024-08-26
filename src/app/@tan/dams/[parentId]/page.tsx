import Theme from "@/styles/theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = 'edge';
export { damsOrSiresMeta as generateMetadata } from "@/metadata-generators/damsOrSires";

export default function TanLayout(): React.JSX.Element | null {
  return <ConstructionPlaceholder dogFill={Theme.lightPrimary}/>;
}
