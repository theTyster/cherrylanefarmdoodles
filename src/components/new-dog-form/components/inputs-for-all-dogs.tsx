"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import {
  shortLength,
  mediumLength,
  longLength,
} from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";

function DogInputs() {
  return (
    <>
      <label>
        What is the Gender? <RequiredStar />
      </label>
      <select
        name={G.gender}
        required
      >
        <option value={"M"}>Male</option>
        <option value={"F"}>Female</option>
      </select>

      <label>Nose color? (optional)</label>
      <input
        name={G.noseColor}
        type="text"
        placeholder="Nose color"
        maxLength={shortLength}
      />

      <label>Coat color? (optional)</label>
      <input
        name={G.coat}
        type="text"
        placeholder="Coat color"
        maxLength={mediumLength}
      />

      <label>Personality? (optional)</label>
      <input
        name={G.personality}
        type="text"
        placeholder="Personality"
        maxLength={longLength}
      />
    </>
  );
}

export default DogInputs;
