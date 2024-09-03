export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";

export default async function PuppyModal({
  puppyId
}: {
  puppyId: string;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const puppyData = await PuppyData.getPuppyFromPuppies(D1, puppyId);
  return (
    <>
        <DogAbout variant={"Puppy"} variantData={puppyData} />
    </>
  );
}
