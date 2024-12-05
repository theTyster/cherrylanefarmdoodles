"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useContext } from "react";

// Utilities
import { nameLength } from "@/components/new-dog-form/constants/form-defaults";
import RequiredStar from "@/components/new-dog-form/components/required-star";
import { FormContext } from "@/components/new-dog-form/new-dog-form";
import DogInputs from "@/components/new-dog-form/components/inputs-for-all-dogs";
function PuppyForm() {

 const { DH } = useContext(FormContext) ?? {};

// const [litter, setLitter]: [
//   number,
//   React.Dispatch<React.SetStateAction<number>>
// ] = useState(NaN);

  return (
    <>
      <DogInputs />
      <label>
        Availability <RequiredStar />
      </label>
      <select name={G.availability} defaultValue={DH?.stored[G.availability]} required>
        <option>Available</option>
        <option>Picked</option>
        <option>Adopted</option>
        <option>Held Back</option>
      </select>

      <label>Puppy Name (optional)</label>
      <input
        name={G.puppyName}
        defaultValue={DH?.stored[G.puppyName]}
        type="text"
        placeholder="Puppy Name"
        maxLength={nameLength}
      />

      <label>What litter does this puppy belong to?</label>
    </>
  );
}

export default PuppyForm;
