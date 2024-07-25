//import { getRequestContext } from "@cloudflare/next-on-pages";
import Theme from "@/styles/theme.module.scss";
import ConstructionPlaceholder from "@/components/construction-placeholder";
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

export const runtime = "edge";

async function DogAbout(/*{ params }: { params: { parentDog: string } }*/) {
  return (
    <>
      <ConstructionPlaceholder dogFill={Theme.lightPrimary} />;
    </>
  );
}

export default DogAbout;
