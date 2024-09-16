export const runtime = "edge";
import PuppyModal from "@/components/puppy-modal/puppy-modal";

export default async function WhitePuppyModal({
  params,
}: {
  params: { puppyId: string };
}): Promise<React.JSX.Element | null> {
  return (
    <>
      <PuppyModal puppyId={params.puppyId} />
    </>
  );
}
