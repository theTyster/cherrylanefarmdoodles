"use client";
// Utilities
import { useState, useRef } from "react";
import { GlobalNameSpaces as G } from "@/constants/data";
import { CURRENT_DATA } from "@/components/dog-data-panel//actions/admin-data-handler";
import synchronizeCurrentData from "@/components/dog-data-panel/actions/synchronize-current-data";
import LitterOptions from "@/components/dog-data-panel/components/refreshable-options";

// Components
import RefreshButton from "@/components/refreshButton/refresh-button";
import BreederOptions from "@/components/dog-data-panel/components/refreshable-options";
import CertificationOptions from "@/components/dog-data-panel/components/refreshable-options";

// Static
import css from "@styles/dog-data-panel.module.scss";
export function LitterSelect() {
  return (
    <div className={css["input-with-button"]}>
      <select name={G.litterId}>
        <LitterOptions whichOptions={CURRENT_DATA["litterIdNames"]} />
      </select>
      <RefreshButton
        refreshAction={async () =>
          await synchronizeCurrentData(CURRENT_DATA["litterIdNames"])
        }
      />
    </div>
  );
}

export function BreederSelect(){
  const [breeder, setBreeder] = useState("Cherry Lane Farms");
  const breederRefInput = useRef<HTMLInputElement>(null);
  return (
    <>
      {breeder !== "New" ? (
        <>
          <div className={css["input-with-button"]}>
            <select name={G.breeder} required>
              <BreederOptions whichOptions={CURRENT_DATA["breederIdNames"]} />
              <option onClick={() => setBreeder("New")}>+ Add New</option>
            </select>
            <RefreshButton
              refreshAction={async () =>
                await synchronizeCurrentData(CURRENT_DATA["breederIdNames"])
              }
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
      </>
  )
}

export function CertificateSelect(){
  const [certification, setCertification] = useState("Embark");
  const certificationRefInput = useRef<HTMLInputElement>(null);
  return(
    <>

      {certification !== "New" ? (
        <>
            <div className={css["input-with-button"]}>
              <select name={G.certifications} required>
                <option value={undefined}>None</option>
                <CertificationOptions whichOptions="certificateIdNames" />
                <option onClick={() => setCertification("New")}>
                  + Add New
                </option>
              </select>
              <RefreshButton
                refreshAction={async () =>
                  await synchronizeCurrentData(
                    CURRENT_DATA["certificateIdNames"]
                  )
                }
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
      </>
  )
}
