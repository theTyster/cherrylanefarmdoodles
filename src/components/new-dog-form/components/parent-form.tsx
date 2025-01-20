export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";

//Components
import BreederOptions from "@/components/new-dog-form/components/refreshable-options";

function ParentForm() {
  return (
    <>
      <DogInputs />
      <label>Birthday (optional)</label>
      <input name={G.adultBirthday}
      type="date" placeholder="MM/DD/YYYY" />

      <BreederOptions whichOptions="breeders" />

      <label>
        Activity Status <RequiredStar />
      </label>
      <select
        name={G.activityStatus}
        required
      >
        <option>Active</option>
        <option>Retired</option>
        <option>On a break</option>
      </select>

      <label>Eye Color (optional)</label>
      <input
        name={G.eyeColor}
        type="text"
        placeholder="Eye Color"
      />

      <label>Parent&apos;s Name (optional)</label>
      <input
        name={G.adultName}
        type="text"
        placeholder="Dog Name"
        maxLength={nameLength}
      />

      <label>Energy level (optional)</label>
      <select name={G.energyLevel}
      >
        <option>Low</option>
        <option>Medium-low</option>
        <option>Medium</option>
        <option>Medium-high</option>
        <option>High</option>
      </select>

      <label>Favorite activities (optional)</label>
      <input
        name={G.favActivities}
        type="text"
        placeholder="Favorite activities"
      />

      <label>Weight (optional)</label>
      <input name={G.weight}
        type="text" placeholder="Weight" />

      <label>Certifications (optional)</label>
      <input name={G.certifications}
        type="text" placeholder="Certifications" />
    </>
  );
}

export default ParentForm;
