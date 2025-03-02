"use client";
export const runtime = "edge";

// Utilities
import FamilyOption from "@/components/dog-data-panel/components/refreshable-options";

// Components
import FormInput from "@/components/dog-data-panel/components/form-input";
import { LitterSelect } from "@/components/dog-data-panel/components/unstableData-select";

function FamilyForm() {
  return (
    <>
      <h4>Creating A New Family</h4>
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

      <FormInput label={"Mother"}>
        <FamilyOption whichOptions={"motherIdNames"} />
      </FormInput>
      <FormInput label={"Father"}>
        <FamilyOption whichOptions={"fatherIdNames"} />
      </FormInput>

      <FormInput label={"Litter"}>
        <LitterSelect />
      </FormInput>
    </>
  );
}

export default FamilyForm;
