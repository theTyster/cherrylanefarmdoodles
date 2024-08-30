export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getPuppyData,
  getMostRecentFamily,
  formatPupData,
} from "@/components/dog-about/constants/puppy-constants";

export default async function DamsPuppyModal({
  params,
}: {
  params: { litterId: number };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    params.litterId,
    "mother",
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
