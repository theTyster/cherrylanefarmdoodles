export const runtime = "edge";
import PuppyModal from "@/components/puppy-modal/puppy-modal";

export default async function DamsPuppyModal({
  params,
}: {
  params: { litterId: number };
}): Promise<React.JSX.Element | null> {
  return (
    <>
      <PuppyModal litterId={params.litterId} />
    </>
  );
}
