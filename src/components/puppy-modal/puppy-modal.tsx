export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dog-about/dog-about";
import PuppyData from "@/components/dog-about/constants/puppy-constants";
import Modal from "@/components/modal/modal";
import theme from "@styles/puppy-modal.module.scss";

export default async function PuppyModal({
  puppyId,
}: {
  puppyId: string;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const P = new PuppyData(D1);
  await P.getPuppyFromPuppies(puppyId);
  const familyData = await P.getFamily();
  return (
    <>
      <Modal>
        <DogAbout variantCSS={theme} variant={"Puppy"} variantData={familyData} />
      </Modal>
    </>
  );
}
