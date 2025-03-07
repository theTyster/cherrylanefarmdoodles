"use client";
// Utilities
import { GlobalNameSpaces as G } from "@/constants/data";
import { useRef, useState } from "react";
import synchronizeCurrentData from "@/components/dog-data-panel/actions/synchronize-current-data";
import { CURRENT_DATA } from "@/components/dog-data-panel//actions/admin-data-handler";

// Components
import LitterOptions from "@/components/dog-data-panel/components/refreshable-options";
import RequiredStar from "@/components/dog-data-panel/components/required-star";
import FormInput from "@/components/dog-data-panel/components/form-input";
import RefreshButton from "@/components/refreshButton/refresh-button";

// Static
import css from "@styles/dog-data-panel.module.scss";

function LitterForm() {
  const birthdayRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const [hasDueDate, setHasDueDate] = useState(false);
  const [hasBirthday, setHasBirthday] = useState(false);

  const whichOptions = CURRENT_DATA['litterIdNames'];
  return (
    <>
      <h3>Select a litter to modify.</h3>
      <div className={css["input-with-button"]}>
        <select name={G.litterId}>
          <LitterOptions whichOptions={whichOptions} />
        </select>
        <RefreshButton
          refreshAction={async () => await synchronizeCurrentData(whichOptions)}
        />
      </div>
      <h4>
        <RequiredStar />: at least one of the following two must be provided.
      </h4>

      <FormInput label="Birthday">
        <div className={css["input-with-button"]}>
          <input
            ref={birthdayRef}
            name={G.litterBirthday}
            type="date"
            placeholder="MM/DD/YYYY"
            {...(hasDueDate ? undefined : { required: true })}
            onChange={() =>
              setHasBirthday(birthdayRef.current?.value ? true : false)
            }
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              birthdayRef.current!.value = "";
              setHasDueDate(false);
            }}
          >
            clear
          </button>
        </div>
      </FormInput>
      <FormInput label="Due Date">
        <div className={css["input-with-button"]}>
          <input
            ref={dueDateRef}
            name={G.dueDate}
            type="date"
            placeholder="MM/DD/YYYY"
            {...(hasBirthday ? undefined : { required: true })}
            onChange={() =>
              setHasDueDate(dueDateRef.current?.value ? true : false)
            }
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              dueDateRef.current!.value = "";
              setHasDueDate(false);
            }}
          >
            clear
          </button>
        </div>
      </FormInput>

      <FormInput label="How many potential buyers are currently in the pick queue?">
        <input
          name={G.applicantsInQueue}
          type="number"
          defaultValue={0}
          required
        />
      </FormInput>
    </>
  );
}

export default LitterForm;
