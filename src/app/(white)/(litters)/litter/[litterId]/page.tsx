export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Components
import DogAbout from "@/components/dog-about/dog-about";
import Headshot from "@/components/Headshots/Headshots";
import Link from "next/link";
import PuppyData from "@/components/dog-about/constants/puppy-constants";
import NextFamilyDate from "@/components/next-family-date/next-family-date";

import AdultDogData from "@/components/dog-about/constants/adult-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";
//export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

// Styles
import css from "@styles/currentLitter.module.scss";

export default async function WhiteSectionLitter({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getFirstRecentFamily(D1, params.litterId);
  const mom = await new AdultDogData(
    D1,
    mostRecentFamily[G.mother],
    "mother"
  ).getAdultData();

  const P = new PuppyData(D1);
  P.mostRecentFamily = mostRecentFamily;
  const puppies = await P.getAllPuppies(params.litterId);

  const calcInit = {
    litterBirthday: mostRecentFamily[G.litterBirthday],
    dueDate: mostRecentFamily[G.dueDate],
  };

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
      {
        // Case for the first time mother.
        puppies.length === 0 ? (
          <>
            <h1 className="litter-title">
              <NextFamilyDate
                calcInit={calcInit}
                availablePuppies={mostRecentFamily[G.availablePuppies]}
                leade={`${mom[G.adultName]}'s First Litter is \n`}
              />
            </h1>
            <hr></hr>
            {/**
             * This will be where a subscription
             * button goes
             **/}
          </>
        ) : (
          <>
            <h1 className="litter-title">
              <NextFamilyDate
                calcInit={calcInit}
                availablePuppies={mostRecentFamily[G.availablePuppies]}
                leade={`${mom[G.adultName]}'s Current Litter \n`}
              />
            </h1>
            <hr></hr>
          </>
        )
      }
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
