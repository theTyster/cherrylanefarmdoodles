export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
export { parentsMeta as generateMetadata } from "@/constants/meta-generators/parents-meta";

// Types
import { D1Adults } from "@/types/data";

// Constants
import {
  connectParentData,
  getMostRecentFamily,
} from "@/components/dog-about/constants/adult-constants";

export default async function WhiteSectionDams({
  params,
}: {
  params: {
    litterId: D1Adults[typeof G.id];
  };
}) {
  const D1 = getRequestContext().env.dogsDB;
  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    params.litterId,
    "mother",
  );

  const parentData = await connectParentData(
    D1,
    mostRecentFamily,
    params.litterId,
    "mother",
    "father",
  );

  return (
    <>
      <DogAbout
        variant={"Adult"}
        variantData={parentData}
      />
    </>
  );
}
