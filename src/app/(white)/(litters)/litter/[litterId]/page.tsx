export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DateCalculator from "@/constants/dates";

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

async function WhiteSectionLitter({
  params,
}: {
  params: Promise<{ litterId: string }>;
}): Promise<React.JSX.Element | null> {
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

  const P = new PuppyData(D1);
  P.mostRecentFamily = mostRecentFamily;
  const puppies = await P.getAllPuppies(litterId);

  const currentLitterData: CurrentLitterData = {
    parentData,
    puppies,
  };

  const date = new DateCalculator({
    litterBirthday: mostRecentFamily.litterBirthday
      ? new Date(mostRecentFamily.litterBirthday)
      : undefined,
    dueDate: mostRecentFamily.dueDate
      ? new Date(mostRecentFamily.dueDate)
      : undefined,
  });

  return (
    <>
      {currentLitterData.parentData?.litterData.totalPuppies === 0 ? (
        <h1 style={{ lineHeight: "2em" }}>
          {`${parentData.dogData[G.adultName]}'s Litter`}{" "}
        </h1>
      ) : (
        <h1 style={{ lineHeight: "2em" }}>{`${
          parentData.dogData[G.adultName]
        }'s Litter -  ${date.prettified.currentDOB}`}</h1>
      )}
      <DogAbout
        variantCSS={css}
        variant={"CurrentLitter"}
        variantData={currentLitterData}
      />
    </>
  );
}
export default WhiteSectionLitter;
