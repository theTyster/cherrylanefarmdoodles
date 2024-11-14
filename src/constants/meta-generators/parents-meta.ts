export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { GlobalNameSpaces as G } from "@/constants/data";
import AdultDogData from "@/components/dog-about/constants/adult-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";
import type { Metadata } from "next";

export async function parentsMeta(
  { params }: { params: { litterId: string } },
): Promise<Metadata> {
  const D1 = getRequestContext().env.dogsDB;
  const {litterId} = await params;

  const mostRecentFamily = await getFirstRecentFamily(D1, litterId);

  const adultId = mostRecentFamily[G.mother];
  const A = new AdultDogData(D1, adultId, G.mother);

  const adult = await A.getAdultData();

  const dogHeadshotSm =  adult[G.Headshots_Sm]!;

  return {
    title: {
      default: adult[G.adultName],
      template: "%s | Cherry Lane Farm",
    },
    description: adult[G.personality],
    openGraph: {
      images: [
        { url: dogHeadshotSm, alt: adult[G.adultName], width:292, height:292, },
      ],
    },
    twitter: {
      images: [
        { url: dogHeadshotSm, alt: adult[G.adultName], width:292, height:292, },
      ],
    }
  };
}



