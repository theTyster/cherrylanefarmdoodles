export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import {
  getPuppyData,
  getMostRecentFamily,
  formatPupData,
} from "@/components/dog-about/constants/puppy-constants";

export default async function DamsPuppyModal({puppyId}: {
  puppyId: string;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getMostRecentFamily<"first">(
    D1,
    puppyId,
  );
  const puppies = await getPuppyData(D1, puppyId);
  return (
    <>
      {puppies.map((puppyData) => {
        const formattedPupData = formatPupData(puppyData, mostRecentFamily);
        return (
          <div
            data-puppy-id={puppyData.puppy[G.dogId]}
            key={puppyData.puppy[G.dogId]}
          >
            <DogAbout variant={"Puppy"} variantData={formattedPupData} />
          </div>
        );
      })}
    </>
  );
}
