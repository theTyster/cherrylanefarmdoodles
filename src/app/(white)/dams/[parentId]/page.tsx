import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
import { D1Adults } from "@/types/data";
export const runtime = "edge";

export { damsOrSiresMeta as generateMetadata } from "@/metadata-generators/damsOrSires";

export default async function Page({
  params,
}: {
  params: {
    parentId: D1Adults[typeof G.id];
  };
}) {
  return (
    <>
      <DogAbout
        adultId={params.parentId}
        primaryParent={"mother"}
        secondaryParent={"father"}
      />
    </>
  );
}
