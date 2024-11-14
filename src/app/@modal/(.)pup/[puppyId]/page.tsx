export const runtime = "edge";
import PuppyModal from "@/components/puppy-modal/puppy-modal";

async function WhitePuppyModal({
  params,
}: {
  params: Promise<{ puppyId: string }>;
}): Promise<React.JSX.Element> {
  const { puppyId } = await params;
  return (
    <>
      <PuppyModal puppyId={puppyId} />
    </>
  );
}
export default WhitePuppyModal;
