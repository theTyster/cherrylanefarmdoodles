"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/dog-data-panel/constants/form-defaults";

// Components
import FormInput from "@/components/dog-data-panel/components/form-input";
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import DogInputs from "@/components/dog-data-panel/components/inputs-for-all-dogs";
import LitterOptions from "@/components/dog-data-panel/components/refreshable-options";
import ImageUpload from "@/components/dog-data-panel/components/image-upload";

function PuppyForm() {
  return (
    <>
      <FormInput label="Puppy Name (optional)">
        <input
          name={G.puppyName}
          type="text"
          placeholder="Puppy Name"
          maxLength={nameLength}
        />
      </FormInput>

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

      <LitterOptions whichOptions="litters" />

      <ImageUpload variant='small'/>
      <ImageUpload variant='large'/>
    </>
  );
}

export default PuppyForm;
