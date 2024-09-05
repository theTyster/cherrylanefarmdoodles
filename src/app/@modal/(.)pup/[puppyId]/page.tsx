export const runtime = "edge";
import PuppyModal from "@/components/puppy-modal/puppy-modal";

export default function WhitePuppyModal({
  params,
}: {
  params: { puppyId: string };
}): React.JSX.Element {
  return (
    <>
      <PuppyModal puppyId={params.puppyId} />
    </>
  );
}
