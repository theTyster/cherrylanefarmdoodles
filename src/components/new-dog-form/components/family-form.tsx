"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useContext } from "react";

// Utilities
import RequiredStar from "@/components/new-dog-form/components/required-star";
import { FormContext } from "@/components/new-dog-form/new-dog-form";

function FamilyForm() {
  const { inputData } = useContext(FormContext) ?? {};
  return (
    <>
      <h3>Creating A New Family</h3>
      <p>
        For the sake of this site, families consist of a mother, father and
        litter of puppies.
      </p>
      <p>These values can be updated at a later time if needed.</p>
      <p>
        The &quot;Unrecorded&quot; parent can be used as a placeholder for an
        adult dog.
      </p>
      <p>
        A litter does not need to contain puppies in order to exist in the
        website.
      </p>
      <p>
        With that in mind, the absolute minimum that is needed in order to
        create a new family is a due date that the puppies are expected to be
        born on.
      </p>
      <p>
        This way you, are able to announce new litters when they are still in
        the planning stages.
      </p>
      <label>
        Mother <RequiredStar />
      </label>
      <select name={G.mother}>
        {inputData?.motherNames.map((mother) => (
          <option key={mother.id + mother.name} value={mother.id}>
            {mother.name}
          </option>
        ))}
      </select>

      <label>
        Father <RequiredStar />
      </label>
      <select name={G.father}>
        {inputData?.fatherNames.map((father) => (
          <option key={father.id + father.name} value={father.id}>
            {father.name}
          </option>
        ))}
      </select>

      <label>Litter <RequiredStar /></label>
      <select name={G.litterId}>
        {
          inputData?.litterNames.map((litter) => (
            <option key={litter} value={litter}>{litter}</option>
          ))
        }
      </select>
    </>
  );
}

export default FamilyForm;
