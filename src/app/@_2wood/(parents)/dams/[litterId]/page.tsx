export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Components
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";

import AdultDogData from "@/components/dog-about/constants/adult-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";
//export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

// Styles
import css from "@styles/currentLitter.module.scss";

// Types
import type { CurrentLitterData } from "@/types/dog-about";

export default async function WoodSectionDams({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getFirstRecentFamily(D1, params.litterId);

  const adultId = mostRecentFamily[G.mother];

  const parentData = await new AdultDogData(
    D1,
    adultId,
    "mother",
    mostRecentFamily,
    "father"
  ).getParentData();

  const P = new PuppyData(D1);
  P.mostRecentFamily = mostRecentFamily;
  const puppies = await P.getAllPuppies(params.litterId);

  const currentLitterData: CurrentLitterData = {
    parentData,
    puppies,
  };

  return (
    <DogAbout
      variantCSS={css}
      variant={"CurrentLitter"}
      variantData={currentLitterData}
    />
  );
}
