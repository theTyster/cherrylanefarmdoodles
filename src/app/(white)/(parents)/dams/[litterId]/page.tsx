export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
export { parentsMeta as generateMetadata } from "@/constants/meta-generators/parents-meta";

// Constants
import AdultDogData, {
  getMostRecentFamily,
} from "@/components/dog-about/constants/adult-constants";

export default async function WhiteSectionDams({
  params,
}: {
  params: {
    litterId: string;
  };
}) {
  const D1 = getRequestContext().env.dogsDB;

  const mostRecentFamily = await getMostRecentFamily<"first">(
    D1,
    params.litterId
  );

  const adultId = mostRecentFamily[G.mother];

  const parentData = await new AdultDogData(
    D1,
    adultId,
    "mother",
    mostRecentFamily,
    "father",
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
