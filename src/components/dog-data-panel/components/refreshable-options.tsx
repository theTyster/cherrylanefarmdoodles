"use client";
export const runtime = "edge";

import {
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// Utilities
import { PanelContext } from "@/components/dog-data-panel/dog-data-panel";
import synchronizeCurrentData from "@/components/dog-data-panel/actions/synchronize-current-data";
import AdminDataHandler, {
  type CurrentDataKeys,
} 
from "@/components/dog-data-panel//actions/admin-data-handler";

//Static
import { loadingText, errorText } from "@/constants/strings";

function UpdatedOptions({ whichOptions }: { whichOptions: CurrentDataKeys }) {
  // Data Context
  const { currentData: currentDataObject } = useContext(PanelContext) ?? {
    currentData: null,
  };

  // State Management
  type CurrentDataType =
    | Awaited<ReturnType<AdminDataHandler["getCurrentData"]>>[CurrentDataKeys]
    | null;
  const [currentDataState, setCurrentDataState]: [
    CurrentDataType,
    React.Dispatch<React.SetStateAction<CurrentDataType>>
  ] = useState(null as CurrentDataType);

  type OptionState = CurrentDataKeys | "loading";
  const [optionState, setOptionState]: [
    OptionState,
    React.Dispatch<React.SetStateAction<OptionState>>
  ] = useState("loading" as OptionState);

  const setStates = useCallback(async function (
    localCurrentDataObject: typeof currentDataObject,
    localSetOptionState: typeof setOptionState,
    localWhichOptions: typeof whichOptions
  ) {
    if (localCurrentDataObject) {
      localSetOptionState(localWhichOptions);
      const data = await synchronizeCurrentData(localWhichOptions);
      setCurrentDataState(data);
    } else return;
  },
  []);

  useEffect(() => {
    setStates(currentDataObject, setOptionState, whichOptions);
  }, [currentDataObject, setOptionState, whichOptions, setStates]);

  return (
    (optionState !== "loading" && currentDataState && (
      <>
        {currentDataState.map((litter, i) => (
          <option
            key={litter.id + litter.name + i}
            value={litter.id || litter.name}
          >
            {litter.name}
          </option>
        ))}
        ) : (<>{errorText}</>
        )
      </>
    )) || <>{loadingText}</>
  );
}

export default UpdatedOptions;
