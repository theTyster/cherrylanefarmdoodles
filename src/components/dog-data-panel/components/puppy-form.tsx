"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/dog-data-panel/constants/form-defaults";
import { CURRENT_DATA } from "@/components/dog-data-panel//actions/admin-data-handler";
import synchronizeCurrentData from "@/components/dog-data-panel/actions/synchronize-current-data";

// Components
import FormInput from "@/components/dog-data-panel/components/form-input";
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import DogInputs from "@/components/dog-data-panel/components/inputs-for-all-dogs";
import LitterOptions from "@/components/dog-data-panel/components/refreshable-options";
import ImageUpload from "@/components/dog-data-panel/components/image-upload";
import RefreshButton from "@/components/refreshButton/refresh-button";

// Static
import css from "@styles/dog-data-panel.module.scss";

function PuppyForm() {
  const whichOptions = CURRENT_DATA['litterNames'];
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
      <div className={css["input-with-button"]}>
        <select name={G.litterId}>
          <LitterOptions whichOptions={whichOptions} />
        </select>
        <RefreshButton
          refreshAction={async () => await synchronizeCurrentData(whichOptions)}
        />
      </div>
      </FormInput>

      <ImageUpload variant="small" />
      <ImageUpload variant="large" />
    </>
  );
}

export default PuppyForm;
