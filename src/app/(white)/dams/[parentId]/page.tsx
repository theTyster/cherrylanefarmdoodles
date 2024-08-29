import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
export const runtime = "edge";

export { damsOrSiresMeta as generateMetadata } from "@/metadata-generators/damsOrSires";

// Types
import { D1Adults } from "@/types/data";

// Constants
import {
  connectParentData,
  getMostRecentFamily,
} from "@/components/dog-about/adult-constants";

export default async function Page({
  params,
}: {
  params: {
    parentId: D1Adults[typeof G.id];
  };
}) {
  const D1 = getRequestContext().env.dogsDB;
  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    "mother",
    params.parentId
  );

  const parentData = await connectParentData(
    D1,
    mostRecentFamily,
    params.parentId,
    "mother",
    "father",
  );

  return (
    <>
      <DogAbout
        variant={"adult"}
        variantData={parentData}
      />
    </>
  );
}
