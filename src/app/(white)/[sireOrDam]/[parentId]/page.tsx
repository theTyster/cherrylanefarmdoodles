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
  // Checks for valid path and determines the gender of the primary parent
  function damsToMothers(): ["father", "mother"] | ["mother", "father"] {
    const valid = sireOrDamEnum.some(
      (opts) => params.sireOrDam === opts || params.sireOrDam === opts + "s"
    );

    if (!valid) throw new Error("Invalid path: " + params.sireOrDam);
    else
      return params.sireOrDam === sireOrDamEnum[0]
        ? ["father", "mother"]
        : (["mother", "father"] as const);
  }

  const [primary, secondary] = damsToMothers();

  return (
    <>
      <DogAbout
        dogId={params.parentId}
        primaryParent={primary}
        secondaryParent={secondary}
      />
    </>
  );
}
