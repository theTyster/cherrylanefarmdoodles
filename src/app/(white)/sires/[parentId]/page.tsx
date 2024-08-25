import DogAbout from "@/components/dog-about/dog-about";
import { GlobalNameSpaces as G } from "@/constants/data";
import { D1Adults } from "@/types/data";
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

export default async function Page({
  params,
}: {
  params: {
    parentId: D1Adults[typeof G.id];
  };
}) {
  return (
    <>
      <DogAbout
        adultId={params.parentId}
        primaryParent={"father"}
        secondaryParent={"mother"}
      />
    </>
  );
}
