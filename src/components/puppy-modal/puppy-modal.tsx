export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";
import Modal from "../modal/modal";

export default async function PuppyModal({
  puppyId,
}: {
  puppyId: string;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const puppyData = await new PuppyData(D1).getPuppyFromPuppies(puppyId);
  return (
    <>
      <Modal>
        <DogAbout variant={"Puppy"} variantData={puppyData} />
      </Modal>
    </>
  );
}
