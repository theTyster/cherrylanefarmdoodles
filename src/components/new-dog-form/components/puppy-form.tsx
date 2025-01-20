"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";

// Components
import FormInput from "@/components/new-dog-form/components/form-input";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";
import LitterOptions from "@/components/new-dog-form/components/refreshable-options";

function PuppyForm() {
  return (
    <>
      <DogInputs />
      <FormInput
        label={
          <>
            Availability <RequiredStar />
          </>
        }
      >
        <select name={G.availability} required>
          <option>Available</option>
          <option>Picked</option>
          <option>Adopted</option>
          <option>Held Back</option>
        </select>
      </FormInput>

      <FormInput label="Puppy Name (optional)">
        <input
          name={G.puppyName}
          type="text"
          placeholder="Puppy Name"
          maxLength={nameLength}
        />
      </FormInput>

      <LitterOptions whichOptions="litters" />
    </>
  );
}

export default PuppyForm;
