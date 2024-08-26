import { getRequestContext } from "@cloudflare/next-on-pages";
import { GlobalNameSpaces as G } from "@/constants/data";
import {
  adultDogsQuery,
  type adultDogsQueryData,
  dogsQuery,
  type dogsQueryData,
} from "@/constants/queries";
import type { Metadata } from "next";

export async function damsOrSiresMeta(
  { params }: { params: { parentId: number } },
): Promise<Metadata> {
  const D1 = getRequestContext().env.dogsDB;

  const adult = await D1.prepare(adultDogsQuery)
    .bind(params.parentId)
    .first<adultDogsQueryData>();

  if (!adult) throw new Error('Adult not found');

  const dog = await D1.prepare(dogsQuery)
    .bind(adult[G.dogId])
    .first<dogsQueryData>();

  if (!dog) throw new Error(`Dog not found for adult ${adult[G.adultName]}`);
  const dogHeadshotSm = dog[G.Headshots_Sm]!;

  return {
    title: {
      default: adult[G.adultName],
      template: "%s | Cherry Lane Farm",
    },
    description: dog[G.personality],
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

