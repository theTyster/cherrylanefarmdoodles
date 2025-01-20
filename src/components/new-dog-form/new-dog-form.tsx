"use client";
export const runtime = "edge";

import Form from "next/form";

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  createContext,
  useActionState,
} from "react";

// Utilities
import ClientAdminDataHandler, {
  type AdminState,
} from "@/components/new-dog-form/actions/client-data-handler";
import ServerAdminDataHandler, {
  ADMIN_STATES,
} from "@/components/new-dog-form/actions/server-data-handler";
import handleFormSubmission from "@/components/new-dog-form/actions/handle-form-submission";

// Style
import css from "@styles/new-dog-form.module.scss";

// Components
//import Puppy from "@/components/dog-about/variants/puppy";
import PuppyForm from "@/components/new-dog-form/components/puppy-form";
//import Adult from "@/components/dog-about/variants/adult";
import ParentForm from "@/components/new-dog-form/components/parent-form";
import FamilyForm from "@/components/new-dog-form/components/family-form";
import LitterForm from "@/components/new-dog-form/components/litter-form";
import SubmissionMsg from "@/components/new-dog-form/components/submission-message";

export type FormContextType = {
  DH: ClientAdminDataHandler;
  formRef: React.RefObject<HTMLFormElement | null>;
  inputData: ServerAdminDataHandler["inputData"];
} | null;
export const FormContext = createContext<FormContextType>(null);

export type FormState = {
  success: boolean;
  error?: string | null;
  state: AdminState;
};

function NewDogForm({
  /**Consider using context or forwardRef for this instead of prop drilling.*/
  inputData,
}: {
  inputData: ServerAdminDataHandler["inputData"];
}) {
  // Refs
  const formRef: React.RefObject<HTMLFormElement | null> = useRef(null);
  const formTypeRef: React.RefObject<HTMLSelectElement | null> = useRef(null);

  // Memos
  const DH = useMemo(() => new ClientAdminDataHandler(), []);

  // States
  /**TODO: Create Previewable views of Dogs.*/
  //  const [previewState, setPreviewState]: [
  //    AdminState,
  //    React.Dispatch<React.SetStateAction<AdminState>>
  //  ] = useState("" as AdminState);

  const formStateInit: FormState = {
    success: false,
    error: null,
    state: ADMIN_STATES["Litters"],
  };

  const [formState, formAction] = useActionState(
    handleFormSubmission,
    formStateInit
  );

  const [adminState, setAdminState]: [
    AdminState,
    React.Dispatch<React.SetStateAction<AdminState>>
  ] = useState(ADMIN_STATES["Litters"] as AdminState);

  type StatStateType = {
    Litters: number;
    Puppies: number;
    Adults: number;
    Families: number;
  };

  const statInit: StatStateType = {
    Litters: 0,
    Puppies: 0,
    Adults: 0,
    Families: 0,
  };
  const [statState, setStatState]: [
    StatStateType,
    React.Dispatch<React.SetStateAction<StatStateType>>
  ] = useState(statInit);

  useEffect(() => {
    if (formTypeRef.current) formTypeRef.current.value = formState.state;
    setAdminState(formState.state);
  }, [formState.state]);

  //  const renderPreview = useCallback(() => {
  //    switch (previewState) {
  //      case "Adults":
  //        return <Adult D={DH.formToParentPreview()} />;
  //      case "Puppies":
  //        return <Puppy D={DH.formToPuppyPreview()} />;
  //      default:
  //        return null;
  //    }
  //  }, [previewState, DH]);

  return (
    <>
      <div className={css["main"]}>
        <SubmissionMsg success={formState.success} message={formState.error} />
        <div id={css["what-to-work"]}>
          <label>What do you want to work with?</label>
          <select
            ref={formTypeRef}
            onChange={(e) => {
              setAdminState(e.target.value as AdminState);
              formState.state = e.target.value as AdminState;
            }}
            defaultValue={adminState}
          >
            {/**
             * Could have looped over an array. Just didn't want to.
             * Feels safer to have the values hardcoded.
             * Also, this way I have more control on the order of the options,
             * which will help UX.
             **/}
            <option value={DH.adminStates["Litters"]}>
              {DH.adminStates["Litters"]}
            </option>
            <option value={DH.adminStates["Puppies"]}>
              {DH.adminStates["Puppies"]}
            </option>
            <option value={DH.adminStates["Adults"]}>
              {DH.adminStates["Adults"]}
            </option>
            <option value={DH.adminStates["Families"]}>
              {DH.adminStates["Families"]}
            </option>
          </select>
        </div>
        <div className={css["stats"]}>
          <h4>Session Stats</h4>
          <p>You have submitted:</p>
          <ul>
            <li>
              <strong>{statState.Litters}</strong> Litters
            </li>
            <li>
              <strong>{statState.Puppies}</strong> Puppies
            </li>
            <li>
              <strong>{statState.Adults}</strong> Adults
            </li>
            <li>
              <strong>{statState.Families}</strong> Families
            </li>
          </ul>
          <button onClick={() => setStatState(statInit)}>Clear Stats</button>
        </div>
        <h3>{formState.state}</h3>
        <Form
          action={formAction}
          ref={formRef}
          onSubmitCapture={() => {
            const updatedValue = statState[adminState] + 1;
            const newState = { ...statState, [adminState]: updatedValue };

            setStatState(newState);
          }}
        >
          <input name="formType" type="hidden" value={adminState} />

          <FormContext.Provider value={{ DH, formRef, inputData }}>
            {(() => {
              switch (adminState) {
                case DH?.adminStates["Adults"]:
                  return <ParentForm />;
                case DH?.adminStates["Puppies"]:
                  return <PuppyForm />;
                case DH?.adminStates["Litters"]:
                  return <LitterForm />;
                case DH?.adminStates["Families"]:
                  return <FamilyForm />;
                default:
                  return <LitterForm />;
              }
            })()}
          </FormContext.Provider>

          <p style={{ marginTop: "2rem", textAlign: "center" }}>
            Be sure to check important fields.
          </p>
          <button type="submit">Submit</button>
        </Form>
      </div>
    </>
  );
}

export default NewDogForm;
