"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import { useRef, useState } from "react";

// Utilities
import RequiredStar from "@/components/new-dog-form/components/required-star";

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

      <label>Birthday</label>
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
        onClick={(e) => {
          e.preventDefault();
          birthdayRef.current!.value = "";
          setHasDueDate(false);
        }}
      >
        clear
      </button>
      <label>Due Date</label>
      <input
        ref={dueDateRef}
        name={G.dueDate}
        type="date"
        placeholder="MM/DD/YYYY"
        {...(hasBirthday ? undefined : { required: true })}
        onChange={() => setHasDueDate(dueDateRef.current?.value ? true : false)}
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

      <label>
        How many potential buyers are currently in the pick queue?
      </label>
      <input
        name={G.applicantsInQueue}
        type="number"
        defaultValue={0}
        required
      />
    </>
  );
}

export default LitterForm;
