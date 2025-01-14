"use client";
export const runtime = "edge";

import Form from "next/form";

import {
  useState,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useActionState,
} from "react";

// Utilities
import ClientAdminDataHandler, {
  type AdminState,
} from "@/components/new-dog-form/constants/client-data-handler";
import ServerAdminDataHandler from "@/components/new-dog-form/constants/server-data-handler";
import handleFormSubmission from "@/components/new-dog-form/constants/handle-form-submission";

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
};

function NewDogForm({
  /**Consider using context or forwardRef for this instead of prop drilling.*/
  inputData,
}: {
  inputData: ServerAdminDataHandler["inputData"];
}) {
  // Refs
  const formRef: React.RefObject<HTMLFormElement | null> = useRef(null);

  // Memos
  const DH = useMemo(() => new ClientAdminDataHandler(), []);

  // States
  const [adminState, setAdminState]: [
    AdminState,
    React.Dispatch<React.SetStateAction<AdminState>>
  ] = useState("" as AdminState);

  /**TODO: Create Previewable views of Dogs.*/
  //  const [previewState, setPreviewState]: [
  //    AdminState,
  //    React.Dispatch<React.SetStateAction<AdminState>>
  //  ] = useState("" as AdminState);

  const formStateInit: FormState = {
    success: false,
    error: null,
  };

  const [formState, formAction] = useActionState(
    handleFormSubmission,
    formStateInit
  );

  const renderForm = useCallback(() => {
    if (!formRef.current) return;

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
        return null;
    }
  }, [adminState, DH, formRef]);

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
      <div className={css["form"]}>
        <SubmissionMsg success={formState.success} message={formState.error} />
        <Form
          action={formAction}
          ref={formRef}
        >
          <label>What do you want to work with?</label>
          <select
            name="formType"
            onChange={(e) => {
              if (!formRef.current) return;
              DH.stored = e.target.value as AdminState;
              setAdminState(e.target.value as AdminState);
            }}
          >
            <option>--</option>
            {Object.values(DH.adminStates).map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>

          <FormContext.Provider value={{ DH, formRef, inputData }}>
            {renderForm()}
          </FormContext.Provider>

          {(() => {
            const marginTop = "2em";
            return (
              <>
                <hr style={{ marginTop }} />

                <p style={{ marginTop }}>Be sure to check important fields.</p>
              </>
            );
          })()}
          <button type="submit">Submit</button>
        </Form>
      </div>
    </>
  );
}

export default NewDogForm;
