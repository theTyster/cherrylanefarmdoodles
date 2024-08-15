import { env } from "cloudflare:test";
import { describe, test, expect } from "vitest";
import DogAbout, { dogAboutQuery } from "./dog-about";
import React from "react";

describe("DogAbout Component", async () => {
  const data = await env.dogsDB
    .prepare(dogAboutQuery("mother", "father"))
    .bind("Max")
    .first<DogAboutData>();

  if (!data) throw new Error("No data found 😢");

  const { Group_Photos } = data;

  const dogData = {
    adultName: data.adultName,
    breeder: data.breeder,
    birthday: data.birthday,
    eyecolor: data.eyecolor,
    isRetired: data.isRetired,
    favActivities: data.favActivities,
    weight: data.weight,
    energyLevel: data.energyLevel,
    gender: data.gender as "M" | "F",
    noseColor: data.noseColor,
    coatColor: data.coatColor,
    personality: data.personality,
    Headshots_Lg: data.Headshots_Lg,
  } as DogAbout_DogData;

  const partnerData = {
    partnerName: data.partnerName,
    partnerBreeder: data.partnerBreeder,
    partnerBirthday: data.partnerBirthday,
    partnerPhoto: data.partnerPhoto,
  } as DogAbout_PartnerData;

  const render = (
    <DogAbout
      dogData={dogData}
      partnerData={partnerData}
      Group_Photos={Group_Photos}
    />
  );

  test("DogAbout component should be defined", () => {
    expect.soft(render).toBeTruthy();
  });
  test("data passed into DogAbout component should be consistent", () => {
    expect.soft(render).toMatchSnapshot();
  });
});
