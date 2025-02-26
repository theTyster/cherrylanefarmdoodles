"use client";
import { useContext } from "react";
import {
  PanelContext,
  statInit,
} from "@/components/dog-data-panel/dog-data-panel";
import css from "@styles/dog-data-panel.module.scss";

export default function Stats() {
  const { usedStatStates, variant } = useContext(PanelContext) ?? {};
  const [statState, setStatState] = usedStatStates || [
    statInit,
    () => undefined,
  ];
  const v = variant? variant: 'modifie';

  return (
    <div className={css["stats"]}>
      <h4>Session Stats</h4>
      {Object.values(statState).every((value) => value === 0) ? (
        <p>You haven&apos;t {v}d anything in this session.</p>
      ) : (
        <p>You have {v}d:</p>
      )}
      <ul>
        {statState.Litters > 0 && (
          <li>
            <strong>{statState.Litters}</strong>{" "}
            {statState.Litters > 1 ? "Litters" : "Litter"}
          </li>
        )}
        {statState.Puppies > 0 && (
          <li>
            <strong>{statState.Puppies}</strong>{" "}
            {statState.Puppies > 1 ? "Puppies" : "Puppy"}
          </li>
        )}
        {statState.Adults > 0 && (
          <li>
            <strong>{statState.Adults}</strong>{" "}
            {statState.Adults > 1 ? "Adults" : "Adult"}
          </li>
        )}
        {statState.Families > 0 && (
          <li>
            <strong>{statState.Families}</strong>{" "}
            {statState.Families > 1 ? "Families" : "Family"}
          </li>
        )}
      </ul>
      {Object.values(statState).every((value) => value === 0) || (
        <button onClick={() => setStatState(statInit)}>Clear Stats</button>
      )}
    </div>
  );
}
