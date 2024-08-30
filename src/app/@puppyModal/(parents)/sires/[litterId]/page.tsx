export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getMostRecentFamily,
  getPuppyData,
  formatPupData,
} from "@/components/dog-about/constants/puppy-constants";

export default async function SiresPuppyModal({
  params,
}: {
  params: { litterId: number };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;

  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    params.litterId,
    'father',
  );
  const puppies = await getPuppyData(D1, params.litterId);
  return (
    <>
      {puppies.map((puppyData) => {
        const formattedPupData = formatPupData(puppyData, mostRecentFamily);
        return (
          <DogAbout
            key={puppyData.puppy[G.dogId]}
            variant={"Puppy"}
            variantData={formattedPupData}
          />
        );
      })}
    </>
  );
}
