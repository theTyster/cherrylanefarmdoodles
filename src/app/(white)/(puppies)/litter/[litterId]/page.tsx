export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import Headshot from "@/components/Headshots/Headshots";
import Link from 'next/link';
import {
  getMostRecentFamily,
  getPuppyData,
  connectPuppyData,
} from "@/components/dog-about/constants/puppy-constants";

import { connectParentData } from "@/components/dog-about/constants/adult-constants";
export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

export default async function WhiteSectionLitter({
  params,
}: {
  params: { litterId: number };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    "mother",
    params.litterId
  );
  const momId = Number.parseInt(mostRecentFamily[G.mother]);
  const parents = await connectParentData(
    D1,
    mostRecentFamily,
    momId,
    "mother",
    "father"
  );
  const puppies = await getPuppyData(D1, mostRecentFamily);
  return (
    <>
      <Link href={`/dams/${parents.dogData[G.dogId]}`}>
      <Headshot
        alt={parents.dogData[G.adultName]}
        variant={"Headshots_Lg"}
        gender={parents.dogData[G.gender]}
        src={parents.dogData[G.Headshots_Lg]}
      />
      </Link>
      <h1>{parents.dogData[G.adultName]}&apos;s Current Litter</h1>
      <div className="currentLitter">
        {puppies.map((puppyData) => {
          const formattedPupData = connectPuppyData(
            mostRecentFamily,
            puppyData
          );
          return (
            <DogAbout
              key={puppyData.puppy[G.dogId]}
              variant={"CurrentLitter"}
              variantData={formattedPupData}
            />
          );
        })}
      </div>
    </>
  );
}
