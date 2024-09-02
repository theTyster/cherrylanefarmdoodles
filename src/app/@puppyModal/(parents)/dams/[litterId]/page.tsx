export const runtime = "edge";
import PuppyModal from "@/components/puppy-modal/puppy-modal";

export default async function DamsPuppyModal({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  return (
    <>
      <PuppyModal litterId={params.litterId} />
    </>
  );
}
