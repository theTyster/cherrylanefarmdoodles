"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useContext } from "react";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import { FormContext } from "@/components/new-dog-form/new-dog-form";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";
import synchronizeInputData from "@/components/new-dog-form/actions/synchronize-input-data";
function PuppyForm() {
  const { inputData } = useContext(FormContext) ?? {};

  return (
    <>
      <DogInputs />
      <label>
        Availability <RequiredStar />
      </label>
      <select
        name={G.availability}
        required
      >
        <option>Available</option>
        <option>Picked</option>
        <option>Adopted</option>
        <option>Held Back</option>
      </select>

      <label>Puppy Name (optional)</label>
      <input
        name={G.puppyName}
        type="text"
        placeholder="Puppy Name"
        maxLength={nameLength}
      />

      <label>What litter does this puppy belong to?</label>
      <select name={G.litterId}>
        {inputData?.litterNames.map((litter) => (
          <option key={litter.id + litter.name} value={litter.id}>
            {litter.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default PuppyForm;
