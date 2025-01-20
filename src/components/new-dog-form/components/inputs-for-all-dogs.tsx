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
import FormInput from "@/components/new-dog-form/components/form-input";

function DogInputs() {
  return (
    <>
      <FormInput
        label={
          <>
            What is the Gender? <RequiredStar />
          </>
        }
      >
        <select name={G.gender} required>
          <option value={"M"}>Male</option>
          <option value={"F"}>Female</option>
        </select>
      </FormInput>

      <FormInput label="Nose color? (optional)" >
        <input
          name={G.noseColor}
          type="text"
          placeholder="Nose color"
          maxLength={shortLength}
        />
      </FormInput>

      <FormInput label="Coat color? (optional)" >
        <input
          name={G.coat}
          type="text"
          placeholder="Coat color"
          maxLength={mediumLength}
        />
      </FormInput>

      <label></label>
      <FormInput label="Personality? (optional)" >
        <input
          name={G.personality}
          type="text"
          placeholder="Personality"
          maxLength={longLength}
        />
      </FormInput>
    </>
  );
}

export default DogInputs;
