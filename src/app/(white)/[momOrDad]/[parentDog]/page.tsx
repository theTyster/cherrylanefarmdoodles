import { getRequestContext } from "@cloudflare/next-on-pages";
import DogAbout from "@/components/dogabout/dogabout";
import DogAboutError from "./error";
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

export default async function Page({
  params,
}: {
  params: { parentDog: string; momOrDad: string };
}) {
//    const R2 = getRequestContext().env.dogImages;
//    const res = await R2.get("1_group.jpg");
//    const text = await res!.text();
//    const base64 = btoa(text);
//    //const binary = await res!.arrayBuffer()
//    //const text = URL.createObjectURL(await res!.blob());
  const D1 = getRequestContext().env.dogsDB;

  let motherOrFatherQuery = "";
  /*prettier-ignore*/
  if (
    params.momOrDad === "mom"    ||
    params.momOrDad === "mother" ||
    params.momOrDad === "mum"    ||
    params.momOrDad === "mummy"  ||
    params.momOrDad === "mama"   ||
    params.momOrDad === "mommy"  ||
    params.momOrDad === "mumma"  ||
    params.momOrDad === "madre"  ||
    params.momOrDad === "m"
  ) {
    motherOrFatherQuery = "mother";
  } else if (
    params.momOrDad === "dad"    ||
    params.momOrDad === "father" ||
    params.momOrDad === "papa"   ||
    params.momOrDad === "daddy"  ||
    params.momOrDad === "padre"  ||
    params.momOrDad === "pa"     ||
    params.momOrDad === "p"
  ) {
    motherOrFatherQuery = "father";
  }

  const query = motherOrFatherQuery
    ? `
      SELECT
      A.adultName,
      A.breeder,
      A.birthday,
      A.eyecolor,
      A.isRetired,
      A.about,
      A.weight,
      A.energyLevel,
      Dogs.gender,
      Dogs.noseColor,
      Dogs.coatColor,
      Dogs.personality,
      Dogs.headshotLarge
       FROM
       Families AS F
       LEFT JOIN Adults AS A ON F.${motherOrFatherQuery} = A.ID
       LEFT JOIN Dogs On A.dogId = Dogs.ID
       LEFT JOIN Litters AS L ON F.litterId = L.ID
       where A.adultName = ?1
       `
    : undefined;

  if (query) {
    const dogData = await D1.prepare(query).bind(params.parentDog).first<Record<string, string|number>>() as Record<string, string>;

    console.log(dogData);

    return (
    <>
    <DogAbout dogData={dogData} />
    </>
    );
  }

  return <DogAboutError />;
}
