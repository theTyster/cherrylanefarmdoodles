"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useContext } from "react";

// Utilities
import {
  shortLength,
  mediumLength,
  longLength,
} from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import { FormContext } from "@/components/new-dog-form/new-dog-form";

function DogInputs() {
  const { DH } = useContext(FormContext) ?? {};
  return (
    <>
      <label>
        What is the Gender? <RequiredStar />
      </label>
      <select
        name={G.gender}
        defaultValue={DH?.stored[G.gender] ?? ""}
        required
      >
        <option value={"M"}>Male</option>
        <option value={"F"}>Female</option>
      </select>

      <label>Nose color? (optional)</label>
      <input
        name={G.noseColor}
        defaultValue={DH?.stored[G.noseColor] ?? ""}
        type="text"
        placeholder="Nose color"
        maxLength={shortLength}
      />

      <label>Coat color? (optional)</label>
      <input
        name={G.coat}
        defaultValue={DH?.stored[G.coat] ?? ""}
        type="text"
        placeholder="Coat color"
        maxLength={mediumLength}
      />

      <label>Personality? (optional)</label>
      <input
        name={G.personality}
        defaultValue={DH?.stored[G.personality] ?? ""}
        type="text"
        placeholder="Personality"
        maxLength={longLength}
      />
    </>
  );
}

export default DogInputs;
