import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
export const runtime = "edge";
//{
//import type { Metadata, ResolvingMetadata } from 'next'
//
//TODO: Implement metadata
//export async function generateMetadata(
//  { params }: { params: { parentDog: string } },
//  parent: ResolvingMetadata
//): Promise<Metadata> {
//  // read route params
//  const parentDog = params.parentDog
//
//  // fetch data
//  const product = await fetch(`https://.../${id}`).then((res) => res.json())
//
//  // optionally access and extend (rather than replace) parent metadata
//  const previousImages = (await parent).openGraph?.images || []
//
//  return {
//    title: product.title,
//    openGraph: {
//      images: ['/some-specific-page-image.jpg', ...previousImages],
//    },
//  }
//}
//}

const sireOrDamEnum = ["sire", "dam"] as const;
export default async function Page({
  params,
}: {
  params: {
    parentId: D1Adults[typeof G.id];
    sireOrDam: (typeof sireOrDamEnum)[number];
  };
}) {
  // Checks for valid path.
  const isSireOrDam = (opts: typeof params.sireOrDam) =>
    params.sireOrDam === opts || params.sireOrDam === opts + "s";
  if (!sireOrDamEnum.some((params) => isSireOrDam(params))) {
    throw new Error("Invalid Path: " + params.sireOrDam + " is not a valid path.");
  }
    // Sets parentage to either "sires" or "dams" based on sireOrDam.
    const [primary] = sireOrDamEnum.filter((params) => !!isSireOrDam(params));
    const [secondary] = sireOrDamEnum.filter((params) => !isSireOrDam(params));
    const damsToMothers = {
      sires: "father",
      sire: "father",
      dams: "mother",
      dam: "mother",
    } as const;
    return (
      <>
        <DogAbout
          dogId={(params.parentId)}
          primaryParent={damsToMothers[primary]}
          secondaryParent={damsToMothers[secondary]}
        />
      </>
    );
}
