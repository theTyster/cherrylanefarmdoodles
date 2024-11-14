export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
//export { parentsMeta as generateMetadata } from "@/constants/meta-generators/parents-meta";

// Constants
import AdultDogData from "@/components/dog-about/constants/adult-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";

export default async function WhiteSectionDams({
  params,
}: {
  params: Promise<{ litterId: string }>;
}) {
  const D1 = getRequestContext().env.dogsDB;
  const { litterId } = await params;

  const mostRecentFamily = await getFirstRecentFamily(D1, litterId);

  const adultId = mostRecentFamily[G.mother];

  const parentData = await new AdultDogData(
    D1,
    adultId,
    "mother",
    mostRecentFamily,
    "father"
  ).getParentData();

  if (!parentData) throw new Error("No parent data provided.");

  return (
    <>
      <DogAbout variant={"Parent"} variantData={parentData} />
    </>
  );
}
