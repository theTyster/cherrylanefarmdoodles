import { getRequestContext } from "@cloudflare/next-on-pages";
import { GlobalNameSpaces as G } from "@/constants/data";
import {
  litterQuery,
  type D1PuppyQueryData as D1PQ,
  dogsQuery,
  type D1DogsQueryData as D1DQ,
} from "@/constants/queries";
import type { Metadata } from "next";

export async function puppiesMeta({
  params,
}: {
  params: { litterId: string };
}): Promise<Metadata> {
  const D1 = getRequestContext().env.dogsDB;

  const puppy = await D1.prepare(litterQuery)
    .bind(params.litterId)
    .first<D1PQ>();

  if (!puppy) throw new Error("Adult not found");

  const dog = await D1.prepare(dogsQuery).bind(puppy[G.dogId]).first<D1DQ>();

  if (!dog) throw new Error(`Dog not found for adult ${puppy[G.puppyName]}`);
  const dogHeadshotSm = dog[G.Headshots_Sm]!;

  return {
    title: {
      default: puppy[G.puppyName] || 'New Puppy',
      template: "%s | Cherry Lane Farm",
    },
    description: dog[G.personality],
    openGraph: {
      images: [
        {
          url: dogHeadshotSm,
          alt:  puppy[G.puppyName] || 'New Puppy',
          width: 292,
          height: 292,
        },
      ],
    },
    twitter: {
      images: [
        {
          url: dogHeadshotSm,
          alt:  puppy[G.puppyName] || 'New Puppy',
          width: 292,
          height: 292,
        },
      ],
    },
  };
}
