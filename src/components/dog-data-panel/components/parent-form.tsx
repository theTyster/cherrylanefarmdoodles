"use client";
import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/dog-data-panel/constants/form-defaults";
import DogInputs from "@/components/dog-data-panel/components/inputs-for-all-dogs";

//Components
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import FormInput from "@/components/dog-data-panel/components/form-input";
import ImageUpload from "@/components/dog-data-panel/components/image-upload";
import { CertificateSelect, BreederSelect } from "@/components/dog-data-panel/components/unstableData-select";

function ParentForm() {
  return (
    <>
      <FormInput label="Parent's Name (optional)">
        <input
          name={G.adultName}
          type="text"
          placeholder="Dog Name"
          maxLength={nameLength}
        />
      </FormInput>
      <DogInputs />
      <FormInput label="Birthday (optional)">
        <input name={G.adultBirthday} type="date" placeholder="MM/DD/YYYY" />
      </FormInput>


      <FormInput
        label={
          <>
            Activity Status <RequiredStar />
            <BreederSelect />
          </>
        }
      >
        <select name={G.activityStatus} required>
          <option>Active</option>
          <option>Retired</option>
          <option>On a break</option>
        </select>
      </FormInput>

      <FormInput label="Eye Color (optional)">
        <input name={G.eyeColor} type="text" placeholder="Eye Color" />
      </FormInput>

      <FormInput label="Energy level (optional)">
        <select name={G.energyLevel}>
          <option>Low</option>
          <option>Medium-low</option>
          <option>Medium</option>
          <option>Medium-high</option>
          <option>High</option>
        </select>
      </FormInput>

      <FormInput label="Favorite activities (optional)">
        <input
          name={G.favActivities}
          type="text"
          placeholder="Favorite activities"
        />
      </FormInput>

      <FormInput label="Weight (optional)">
        <input name={G.weight} type="number" placeholder="Weight" />
      </FormInput>

          <FormInput label="Certifications (optional)">
            <CertificateSelect />
          </FormInput>
      <ImageUpload variant="small" />
      <ImageUpload variant="large" />
    </>
  );
}

export default ParentForm;
