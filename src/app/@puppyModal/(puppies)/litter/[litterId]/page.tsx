import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getMostRecentFamily,
  getPuppyData,
  connectPuppyData,
} from "@/components/dog-about/constants/puppy-constants";

export const runtime = "edge";

export default async function Dams({
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
  const puppies = await getPuppyData(D1, mostRecentFamily);
  return (
    <>
      {puppies.map((puppyData) => {
        const formattedPupData = connectPuppyData(mostRecentFamily, puppyData);
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
