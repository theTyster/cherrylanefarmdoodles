import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getPuppyData,
  getMostRecentFamily,
  formatPupData,
} from "@/components/dog-about/constants/puppy-constants";
export const runtime = "edge";

export default async function WoodSectionDams({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getMostRecentFamily<'first'>(
    D1,
    params.litterId,
  );
  const puppies = await getPuppyData(D1, params.litterId);
  return (
    <>
      {puppies.map((puppyData) => {
        const formattedPupData = formatPupData(puppyData, mostRecentFamily);
        return (
          <DogAbout
            key={puppyData.puppy[G.dogId]}
            variant={"CurrentLitter"}
            variantData={formattedPupData}
          />
        );
      })}
    </>
  );
}
