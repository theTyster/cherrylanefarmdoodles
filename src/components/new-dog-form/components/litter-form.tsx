"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useRef, useState } from "react";

// Components
import RequiredStar from "@/components/new-dog-form/components/required-star";
import FormInput from "@/components/new-dog-form/components/form-input";

// Static
import css from "@styles/new-dog-form.module.scss";

function LitterForm() {
  const birthdayRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const [hasDueDate, setHasDueDate] = useState(false);
  const [hasBirthday, setHasBirthday] = useState(false);
  return (
    <>
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
