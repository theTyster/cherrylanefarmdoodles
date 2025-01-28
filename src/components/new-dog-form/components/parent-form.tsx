export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";

//Components
import BreederOptions from "@/components/new-dog-form/components/refreshable-options";
import FormInput from "@/components/new-dog-form/components/form-input";
import Certifications from "@/components/new-dog-form/components/refreshable-options";
import ImageUpload from "@/components/new-dog-form/components/image-upload";

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

      <BreederOptions whichOptions="breeders" />

      <FormInput
        label={
          <>
            Activity Status <RequiredStar />
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
      <Certifications whichOptions="certifications" />

      <ImageUpload variant='small'/>
      <ImageUpload variant='large'/>
    </>
  );
}

export default ParentForm;
