import Theme from "@/styles/theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";

export const runtime = "edge";

export default function TanLayout(): React.JSX.Element | null {
  return (
    <>
      <h1>This is going to be a form.</h1>
      <ConstructionPlaceholder dogFill={Theme.lightPrimary} />
    </>
  );
}
