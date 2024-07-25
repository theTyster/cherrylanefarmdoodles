import { describe, test, expect } from "vitest";
import DogAbout from "@/components/dogabout/dogabout";
import React from 'react';

describe("DogAbout Component", () => {
    const dogData = {
      adultName: "Dog Name",
      about: "This is a dog",
    };
  test("DogAbout component should be defined", () => {
    expect.soft(<DogAbout dogData={dogData} />).toBeTruthy();
  });
  test("data passed into DogAbout component should be consistent", () => {
    expect.soft(<DogAbout dogData={dogData} />).toMatchSnapshot();
  
  })
});
