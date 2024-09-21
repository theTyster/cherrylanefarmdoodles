export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import Headshot from "@/components/Headshots/Headshots";
import Link from "next/link";
import PuppyData from "@/components/dog-about/constants/puppy-constants";

import AdultDogData, {
  getMostRecentFamily,
} from "@/components/dog-about/constants/adult-constants";
export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

// Styles
import css from "@styles/currentLitter.module.scss";

import DateCalculator from "@/constants/dates";

export default async function WhiteSectionLitter({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;

  const mostRecentFamily = await getMostRecentFamily<"first">(
    D1,
    params.litterId
  );
  const mom = await new AdultDogData(
    D1,
    mostRecentFamily[G.mother],
    "mother"
  ).getAdultData();

  const P = new PuppyData(D1);
  P.mostRecentFamily = mostRecentFamily;
  const puppies = await P.getAllPuppies(params.litterId);

  const calc = new DateCalculator({
    litterBirthday: mostRecentFamily[G.litterBirthday],
    dueDate: mostRecentFamily[G.dueDate],
  });
  return (
    <>
      <Link href={`/dams/${params.litterId}`}>
        <Headshot
          alt={mom[G.adultName]}
          variant={G.Headshots_Lg}
          gender={mom[G.gender]}
          src={mom[G.Headshots_Lg]}
        />
      </Link>
      <h1 className="litter-title">{`${
        mom[G.adultName]
      }'s Litter born on `}
      {calc.prettified.currentDOB}</h1>
      <hr />
      <div className="litter-currentLitter">
        {puppies.map((puppyData) => {
          return (
            <DogAbout
              key={puppyData.ids[G.dogId]}
              variantCSS={css}
              variant={"CurrentLitter"}
              variantData={puppyData}
            />
          );
        })}
      </div>
    </>
  );
}
