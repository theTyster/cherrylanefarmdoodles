import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getPuppyData,
  getMostRecentFamily,
  formatPupData,
} from "@/components/dog-about/constants/puppy-constants";
export const runtime = "edge";

export default async function Dams({
  params,
}: {
  params: { parentId: number };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    "mother",
    params.parentId
  );
  const puppies = await getPuppyData(D1, mostRecentFamily);
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
