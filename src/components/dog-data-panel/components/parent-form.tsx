"use client";
import { useState, useRef } from "react";
import { GlobalNameSpaces as G } from "@/constants/data";

// Utilities
import { nameLength } from "@/components/dog-data-panel/constants/form-defaults";
import DogInputs from "@/components/dog-data-panel/components/inputs-for-all-dogs";
import synchronizeCurrentData from "@/components/dog-data-panel/actions/synchronize-current-data";
import { CURRENT_DATA } from "@/components/dog-data-panel//actions/admin-data-handler";

//Components
import BreederOptions from "@/components/dog-data-panel/components/refreshable-options";
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import FormInput from "@/components/dog-data-panel/components/form-input";
import CertificationOptions from "@/components/dog-data-panel/components/refreshable-options";
import ImageUpload from "@/components/dog-data-panel/components/image-upload";
import RefreshButton from "@/components/refreshButton/refresh-button";

// Static
import css from "@styles/dog-data-panel.module.scss";

function ParentForm() {
  // States
  const [breeder, setBreeder] = useState("Cherry Lane Farms");
  const [certification, setCertification] = useState("Embark");

  // Refs
  const certificationRefInput = useRef<HTMLInputElement>(null);
  const breederRefInput = useRef<HTMLInputElement>(null);

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

      {breeder !== "New" ? (
        <>
      <div className={css["input-with-button"]}>
        <select name={G.breeder} required>
          <BreederOptions whichOptions={CURRENT_DATA['breeders']} />
          <option onClick={() => setBreeder("New")}>+ Add New</option>
        </select>
        <RefreshButton
          refreshAction={async () => await synchronizeCurrentData(CURRENT_DATA['breeders'])}
        />
      </div>
          </>
      ) : (
        <>
          <input
            name={G.breeder}
            ref={breederRefInput}
            type="text"
            placeholder="Add the new breeder"
            autoFocus={true}
            required
          />
          <button type="button" onClick={() => setBreeder("Cherry Lane Farms")}>
            Select From List Instead
          </button>
        </>
      )}

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
      {certification !== "New" ? (
        <>
      <div className={css["input-with-button"]}>
        <select name={G.certifications} required>
          <option value={undefined}>None</option>
          <CertificationOptions whichOptions="certificateNames" />
          <option onClick={() => setCertification("New")}>+ Add New</option>
        </select>
        <RefreshButton
          refreshAction={async () => await synchronizeCurrentData(CURRENT_DATA['certificateNames'])}
        />
      </div>
          </>
      ) : (
        <>
          <input
            name={G.certifications}
            ref={certificationRefInput}
            type="text"
            placeholder="Add the new certification"
            autoFocus={true}
            required
          />
          <button type="button" onClick={() => setCertification("Embark")}>
            Select From List Instead
          </button>
        </>
      )}

      <ImageUpload variant="small" />
      <ImageUpload variant="large" />
    </>
  );
}

export default ParentForm;
