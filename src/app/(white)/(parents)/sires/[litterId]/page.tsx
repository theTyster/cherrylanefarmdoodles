export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
export { parentsMeta as generateMetadata } from "@/constants/meta-generators/parents-meta";

// Types
import { D1Litters } from "@/types/data";

// Constants
import AdultDogData, {
  getMostRecentFamily,
} from "@/components/dog-about/constants/adult-constants";

export default async function WhiteSectionSires({
  params,
}: {
  params: {
    litterId: D1Litters[typeof G.id];
  };
}) {
  const D1 = getRequestContext().env.dogsDB;
  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily<"first">(
    D1,
    params.litterId
  );

  const adultId = Number.parseFloat(mostRecentFamily[G.father]);

  const parentData = await new AdultDogData(
    D1,
    adultId,
    "father",
    mostRecentFamily,
    "mother",
  ).getParentData();

  if (!parentData) throw new Error("No parent data provided.");
  console.log(parentData);

  return (
    <>
      <DogAbout
        variant={"Parent"}
        variantData={parentData}
      />
    </>
  );
}