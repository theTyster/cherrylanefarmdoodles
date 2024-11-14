export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";

export default async function WhitePuppyModal({
  params,
}: {
  params: Promise<{ puppyId: string }>;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const { puppyId } = await params;
  const P = new PuppyData(D1);
  await P.getPuppyFromPuppies(puppyId);
  const familyData = await P.getFamily();
  return (
    <>
      <DogAbout variant={"Puppy"} variantData={familyData} />
    </>
  );
}
