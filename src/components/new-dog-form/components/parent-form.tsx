"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useState, useContext } from "react";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import { FormContext } from "@/components/new-dog-form/new-dog-form";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";

function ParentForm() {

  const { inputData } = useContext(FormContext) ?? {};

  const [breeder, setBreeder]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("Cherry Lane Farms");

  return (
    <>
      <DogInputs />
      <label>Birthday (optional)</label>
      <input name={G.adultBirthday}
      type="date" placeholder="MM/DD/YYYY" />

      <label>
        Breeder name <RequiredStar />
      </label>
      <select
        name={G.breeder}
        onChange={(e) => {
          setBreeder(e.target.value);
        }}
        required
      >
        {inputData?.breeders.map((b) => (
          <option key={b}>{b}</option>
        ))}
        <option>Other</option>
      </select>

      {breeder === "Other" ? (
        <input name={G.breeder} type="text" placeholder="Add the new breeder" />
      ) : null}

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
