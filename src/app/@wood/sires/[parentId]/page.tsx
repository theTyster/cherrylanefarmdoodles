import DamsOrSires from "@/app/@wood/damsOrSires";
export const runtime = "edge";
export { damsOrSiresMeta as generateMetadata } from "@/metadata-generators/damsOrSires";

export default function WoodLayout({
  params,
}: {
  params: { parentId: number };
}): React.JSX.Element | null {
  return (
    <>
      <DamsOrSires adultId={params.parentId} primaryParent="father" />
    </>
  );
}
