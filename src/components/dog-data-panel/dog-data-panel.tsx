"use client";
export const runtime = "edge";

import Form from "next/form";

import {
  useState,
  useRef,
  useEffect,
  createContext,
  useActionState,
} from "react";

// Utilities
import AdminDataHandler, {
  ADMIN_STATES,
  type AdminState,
} from "@/components/dog-data-panel/actions/admin-data-handler";
import handleFormSubmission from "@/components/dog-data-panel/actions/handle-form-submission";

// Style
import css from "@styles/dog-data-panel.module.scss";

// External Components
import PuppyForm from "@/components/dog-data-panel/components/puppy-form";
import ParentForm from "@/components/dog-data-panel/components/parent-form";
import FamilyForm from "@/components/dog-data-panel/components/family-form";
import LitterForm from "@/components/dog-data-panel/components/litter-form";

// Local Components
import SubmissionMsg from "@/components/dog-data-panel/components/submission-message";
import Stats from "@/components/dog-data-panel/components/stats";

export type StatStateType = {
  Litters: number;
  Puppies: number;
  Adults: number;
  Families: number;
};

export type UsedStatStatesType = [
  StatStateType,
  React.Dispatch<React.SetStateAction<StatStateType>>
];

export const statInit: StatStateType = {
  Litters: 0,
  Puppies: 0,
  Adults: 0,
  Families: 0,
};

export type PanelContextType = {
  formRef: React.RefObject<HTMLFormElement | null>;
  currentData: AdminDataHandler["currentData"];
  usedStatStates: UsedStatStatesType;
  variant: DogDataPanelVariantsType;
} | null;
export const PanelContext = createContext<PanelContextType>(null);

export type FormState = {
  success: boolean;
  error?: string | null;
  state: AdminState;
};

export const DogDataPanelVARIANTS = {
  create: "create",
  change: "change",
} as const;

export type DogDataPanelVariantsType = keyof typeof DogDataPanelVARIANTS;

function DogDataPanel({
  currentData,
  variant,
}: {
  currentData: AdminDataHandler['currentData'];
  variant: DogDataPanelVariantsType;
}) {
  // Refs
  const formRef: React.RefObject<HTMLFormElement | null> = useRef(null);
  const formTypeRef: React.RefObject<HTMLSelectElement | null> = useRef(null);

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
  ] = useState(null as unknown as AdminState);

  const usedStatStates: UsedStatStatesType = useState(statInit);

  const [statState, setStatState] = usedStatStates;

  useEffect(() => {
    if (!formTypeRef.current) return;
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
    <PanelContext.Provider value={{ formRef, currentData,  usedStatStates, variant }}>
      <div className={css["main"]}>
        <SubmissionMsg success={formState.success} message={formState.error} />
        <Stats />
        <h3>
          <div id={css["what-to-work"]}>
            <select
              ref={formTypeRef}
              onChange={(e) => {
                setAdminState(e.target.value as AdminState);
                formState.state = e.target.value as AdminState;
              }}
            >
              {/**
               * Could have looped over an array. Just didn't want to.
               * Feels safer to have the values hardcoded.
               * Also, this way I have more control on the order of the options,
               * which will help UX.
               **/}
              <option value={ADMIN_STATES["Litters"]}>
                {ADMIN_STATES["Litters"]}
              </option>
              <option value={ADMIN_STATES["Puppies"]}>
                {ADMIN_STATES["Puppies"]}
              </option>
              <option value={ADMIN_STATES["Adults"]}>
                {ADMIN_STATES["Adults"]}
              </option>
              <option value={ADMIN_STATES["Families"]}>
                {ADMIN_STATES["Families"]}
              </option>
            </select>
          </div>
        </h3>
        <Form
          action={formAction}
          ref={formRef}
          onSubmitCapture={() => {
            const updatedValue = statState[adminState] + 1;
            const newState = { ...statState, [adminState]: updatedValue };
            setStatState(newState);
          }}
        >
          <input name="formType" type="hidden" value={formState.state} />

          {(() => {
            switch (adminState) {
              case ADMIN_STATES["Adults"]:
                return <ParentForm />;
              case ADMIN_STATES["Puppies"]:
                return <PuppyForm />;
              case ADMIN_STATES["Litters"]:
                return <LitterForm />;
              case ADMIN_STATES["Families"]:
                return <FamilyForm />;
              default:
                return <LitterForm />;
            }
          })()}

          <p style={{ marginTop: "2rem", textAlign: "center" }}>
            Be sure to check important fields.
          </p>
          <button type="submit">Submit</button>
        </Form>
      </div>
    </PanelContext.Provider>
  );
}

export default DogDataPanel;
