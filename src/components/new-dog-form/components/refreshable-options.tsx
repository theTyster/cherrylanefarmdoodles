"use client";
export const runtime = "edge";

import { GlobalNameSpaces as G } from "@/constants/data";
import {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  Fragment,
} from "react";

// Utilities
import { FormContext } from "@/components/new-dog-form/new-dog-form";
import synchronizeInputData from "@/components/new-dog-form/actions/synchronize-input-data";
import ServerAdminDataHandler, {
  type IdName,
} from "@/components/new-dog-form//actions/server-data-handler";

// Components
import RequiredStar from "@/components/new-dog-form/components/required-star";
import FormInput from "@/components/new-dog-form/components/form-input";

//Static
import css from "@styles/new-dog-form.module.scss";

type WhichOptionsType = "litters" | "parents" | "breeders" | "certifications";

function UpdatedOptions({ whichOptions }: { whichOptions: WhichOptionsType }) {
  const { inputData } = useContext(FormContext) ?? {};

  function getWhichOptions(
    theseOptions: WhichOptionsType,
    inputs: ServerAdminDataHandler["inputData"] | undefined
  ): IdName[] | string[] | [IdName[], IdName[]] {
    if (!inputs) {
      console.error("No input data found");
      return [];
    }

    switch (theseOptions) {
      case "litters":
        return inputs.litterNames;
      case "parents":
        return [inputs.motherNames, inputs.fatherNames];
      case "breeders":
        return inputs.breeders;
      case "certifications":
        return inputs.certificateNames;
      default:
        return [];
    }
  }

  const options = getWhichOptions(whichOptions, inputData);

  const breederRefInput = useRef<HTMLInputElement>(null);

  const certificationRefInput = useRef<HTMLInputElement>(null);

  const [inputDataState, setInputDataState] = useState(options);

  const [breeder, setBreeder] = useState("Cherry Lane Farms");

  const [certification, setCertification] = useState("Embark");

  const getInputs = useCallback(async () => {
    const inputs = await synchronizeInputData();
    const options = getWhichOptions(whichOptions, inputs);
    setInputDataState(options);
  }, [whichOptions]);

  useEffect(() => {
    getInputs();
  }, [getInputs]);

  function RefreshButton() {
    return (
      <button
        title={`Refresh the list of ${whichOptions}`}
        onClick={(e) => {
          e.preventDefault();
          getInputs();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="15"
          height="15"
          viewBox="0 0 30 30"
        >
          <path d="M 15 3 C 12.053086 3 9.3294211 4.0897803 7.2558594 5.8359375 A 1.0001 1.0001 0 1 0 8.5449219 7.3652344 C 10.27136 5.9113916 12.546914 5 15 5 C 20.226608 5 24.456683 8.9136179 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.441216 7.8348596 21.297943 3 15 3 z M 4.3007812 9 L 0.30078125 15 L 3 15 C 3 21.635519 8.3644809 27 15 27 C 17.946914 27 20.670579 25.91022 22.744141 24.164062 A 1.0001 1.0001 0 1 0 21.455078 22.634766 C 19.72864 24.088608 17.453086 25 15 25 C 9.4355191 25 5 20.564481 5 15 L 8.3007812 15 L 4.3007812 9 z"></path>
        </svg>
      </button>
    );
  }

  return whichOptions === "litters" ? (
    <>
      <FormInput label="What litter does this puppy belong to?">
        <div className={css["input-with-button"]}>
          <select name={G.litterId}>
            {(inputDataState as IdName[]).map((litter) => (
              <option key={litter.id + litter.name} value={litter.id}>
                {litter.name}
              </option>
            ))}
          </select>
          <RefreshButton />
        </div>
      </FormInput>
    </>
  ) : whichOptions === "parents" ? (
    [
      <Fragment key="mother-option">
        <FormInput
          label={
            <>
              Mother <RequiredStar />
            </>
          }
        >
          <div className={css["input-with-button"]}>
            <select name={G.mother}>
              {(inputDataState as [IdName[], IdName[]])[0].map((mother) => (
                <option key={mother.id + mother.name} value={mother.id}>
                  {mother.name}
                </option>
              ))}
            </select>
            <RefreshButton />
          </div>
        </FormInput>
      </Fragment>,
      <Fragment key="father-option">
        <label></label>
        <FormInput
          label={
            <>
              Father <RequiredStar />
            </>
          }
        >
          <div className={css["input-with-button"]}>
            <select name={G.father}>
              {(inputDataState as [IdName[], IdName[]])[1].map((father) => (
                <option key={father.id + father.name} value={father.id}>
                  {father.name}
                </option>
              ))}
            </select>
            <RefreshButton />
          </div>
        </FormInput>
      </Fragment>,
    ]
  ) : whichOptions === "breeders" ? (
    <FormInput
      label={
        <>
          Breeder name <RequiredStar />
        </>
      }
    >
      {breeder !== "New" ? (
        <div className={css["input-with-button"]}>
          <select name={G.breeder} required>
            {(inputDataState as string[]).map((b, i) => (
              <option key={b + i}>{b}</option>
            ))}
            <option onClick={() => setBreeder("New")}>+ Add New</option>
          </select>
          <RefreshButton />
        </div>
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
    </FormInput>
  ) : whichOptions === "certifications" ? (
    <FormInput
      label="Certifications"
    >
      {certification !== "New" ? (
        <div className={css["input-with-button"]}>
          <select name={G.certifications} required>
            {(inputDataState as string[]).map((b, i) => (
              <option key={b + i}>{b}</option>
            ))}
            <option onClick={() => setCertification("New")}>+ Add New</option>
          </select>
          <RefreshButton />
        </div>
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
    </FormInput>
  ) : (
    <>
      <p>There was a problem loading the {whichOptions}</p>
    </>
  );
}

export default UpdatedOptions;
