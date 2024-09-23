import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";

export const runtime = "edge";

export default async function WoodSectionDams({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const mostRecentFamily = await getFirstRecentFamily(
    D1,
    params.litterId
  );
  const P = new PuppyData(D1);
  P.mostRecentFamily = mostRecentFamily;
  const puppies = await P.getAllPuppies(params.litterId);
  return (
    <>
      {puppies.map((puppyData) => {
        return (
          <DogAbout
            key={puppyData.ids[G.dogId]}
            variant={"CurrentLitter"}
            variantData={puppyData}
          />
        );
      })}
    </>
  );
}
