"use client";
export const runtime = "edge";

import Form from "next/form";

import {
  useState,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useEffect,
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
import Puppy from "@/components/dog-about/variants/puppy";
import PuppyForm from "@/components/new-dog-form/components/puppy-form";
import Adult from "@/components/dog-about/variants/adult";
import ParentForm from "@/components/new-dog-form/components/parent-form";
import FamilyForm from "@/components/new-dog-form/components/family-form";
import LitterForm from "@/components/new-dog-form/components/litter-form";
import SubmissionMsg from "@/components/new-dog-form/components/submission-message";
import RequiredStar from "@/components/new-dog-form/components/required-star";

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

  const [previewState, setPreviewState]: [
    AdminState,
    React.Dispatch<React.SetStateAction<AdminState>>
  ] = useState("" as AdminState);

  const formStateInit: FormState = {
    success: false,
    error: null,
  };

  const [formState, formAction] = useActionState(
    handleFormSubmission,
    formStateInit
  );

  useEffect(() => {
    if (!formRef.current) return;

    if (window.location.hash) {
      DH.stored = DH.getHashAsObject();
      setAdminState(DH.stored.formType as AdminState);
    }
  }, [formRef, DH, adminState]);

  useEffect(() => {
    //if (!formRef.current) return;
    //if (window.location.hash) {
    //  DH.updateFormValues(formRef.current);
    //  window.location.hash = "";
    //}
  });

  const renderForm = useCallback(() => {
    if (!formRef.current) return;
    //DH.updateFormValues(formRef.current);

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

  const renderPreview = useCallback(() => {
    switch (previewState) {
      case "Adults":
        return <Adult D={DH.formToParentPreview()} />;
      case "Puppies":
        return <Puppy D={DH.formToPuppyPreview()} />;
      default:
        return null;
    }
  }, [previewState, DH]);

  return (
    <>
      <div className={css["form"]}>
        <SubmissionMsg success={formState.success} message={formState.error} />
        <Form
          action={formAction}
          ref={formRef}
          onChange={() => {
            //if (!formRef.current) return;
            //DH.stored = JSON.stringify(DH.getFormAsObject(formRef.current));
            //DH.updateHashURL();
          }}
        >
          <label>What do you want to work with?</label>
          <select
            name="formType"
            onChange={(e) => {
              if (!formRef.current) return;
              setAdminState(e.target.value as AdminState);
              //DH.stored = JSON.stringify(DH.getFormAsObject(formRef.current));
              //DH.updateHashURL();
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
          <button type="submit">Submit</button>
        </Form>
        <p style={{fontSize: '1.3rem'}}><RequiredStar /> = denotes a form requirement that must be fulfilled to submit.</p> 
        <button
          onClick={() =>
            setPreviewState(DH.adminStates[DH.stored.formType as AdminState])
          }
        >
          Preview
        </button>
        {renderPreview()}
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            } else {
              // Works even if the user has disabled clipboard access in the browser.
              const textArea = document.createElement("textarea");
              textArea.value = window.location.href;
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              document.execCommand("copy");
              document.body.removeChild(textArea);
            }

            alert(
              "URL Copied to Clipboard. Your progress is saved in the URL."
            );
          }}
        >
          Save Progress For Later
        </button>
      </div>
    </>
  );
}

export default NewDogForm;
