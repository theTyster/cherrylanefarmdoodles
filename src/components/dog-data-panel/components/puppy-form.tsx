"use client";
export const runtime = "edge";

// Utilities
import { nameLength } from "@/components/dog-data-panel/constants/form-defaults";
import { GlobalNameSpaces as G } from "@/constants/data";

// Components
import FormInput from "@/components/dog-data-panel/components/form-input";
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import DogInputs from "@/components/dog-data-panel/components/inputs-for-all-dogs";
import { LitterSelect } from "@/components/dog-data-panel/components/unstableData-select"; 
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

      <FormInput label="What litter does this puppy belong to?">

        <LitterSelect />
      </FormInput>

      <ImageUpload variant="small" />
      <ImageUpload variant="large" />
    </>
  );
}

export default PuppyForm;
