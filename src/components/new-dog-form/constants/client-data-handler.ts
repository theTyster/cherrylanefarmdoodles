import ServerAdminDataHandler, {
  ADMIN_STATES,
  type AdminState as AdminStateType,
  FORMDATA_STATES,
  type FormDataState as FormDataStateType,
  PREVIEW_STATES,
  type PreviewState as PreviewStateType,
} from "@/components/new-dog-form/constants/server-data-handler";

import {
  type PuppyData as PuppyDataType,
  type ParentData as ParentDataType,
} from "@/types/dog-about";

import { castPuppyFromD1, castParentFromD1 } from "@/types/dog-about";

export const adminState = ADMIN_STATES;
export type AdminState = AdminStateType;

export const formDataState = FORMDATA_STATES;
export type FormDataState = FormDataStateType;

export const previewState = PREVIEW_STATES;
export type PreviewState = PreviewStateType;

export default class ClientAdminDataHandler extends ServerAdminDataHandler {
  storageKey: "adminData";
  constructor() {
    super();
    this.D1 = undefined;
    this.storageKey = "adminData";
  }

  /**
   * localStorage is the source of truth for both the form and the hash URL
   * It should be a stringified object.
   * @see getFormAsObject
   **/
  get stored(): AdminState {
    const stored = window.localStorage.getItem(this.storageKey);
    if (!stored) return "" as AdminState;
    else return stored as AdminState;
  }

  /**
   * Updates localStorage with the values of whatever is passed in.
   * If a string is passed in, it should be a stringified object.
   *
   * @see getFormAsObject
   **/
  set stored(
    values:
      | HTMLFormElement
      | string
      | Record<string, string>
      | { [key: string]: FormDataEntryValue }
  ) {
    if (typeof values === "string") {
      window.localStorage.setItem(this.storageKey, values);
    } else if (values instanceof HTMLFormElement) {
      const formValues = this.getFormAsObject(values);
      window.localStorage.setItem(this.storageKey, JSON.stringify(formValues));
    } else {
      window.localStorage.setItem(this.storageKey, JSON.stringify(values));
    }
  }

  /**
   * Returns the hash string as a URLSearchParams object.
   **/
  getHashAsParams(): URLSearchParams {
    const currentHashString = new URLSearchParams(
      window.location.hash.slice(1)
    );
    return currentHashString;
  }

  /**
   * Returns the hash string as an Object.
   **/
  getHashAsObject(): { [key: string]: FormDataEntryValue } {
    return Object.fromEntries(this.getHashAsParams());
  }

  /**
   * Returns the values of the form as an Object.
   **/
  getFormAsObject(form: HTMLFormElement): {
    [key: string]: FormDataEntryValue;
  } {
    return Object.fromEntries(new FormData(form));
  }

  /**
   * Returns the values of the form as a URLSearchParams object.
   **/
  getFormAsParams(form: HTMLFormElement): URLSearchParams {
    const formAsParams = new URLSearchParams();
    const formAsObject = this.getFormAsObject(form);
    for (const [key, value] of Object.entries(formAsObject)) {
      formAsParams.append(key, value.toString());
    }
    return formAsParams;
  }

  /**
   * Updates the form values with the values from localStorage.
   **/
  updateFormValues(form: HTMLFormElement): void {
    if (!this.stored) return;
    const storedObject: AdminState = this.stored;
    for (const [key, value] of Object.entries(storedObject)) {
      const input = form.querySelector<HTMLInputElement>(`[name=${key}]`);
      if (input) {
        input.value = value;
      }
    }
  }

  /**
   * Updates the hash URL with the values of the form.
   **/
  updateHashURL(): void {
    const newHashURL = new URLSearchParams();
    if (!this.stored) return;
    for (const [key, value] of Object.entries(this.stored)) {
      newHashURL.append(key, value.toString());
    }

    window.location.hash = newHashURL.toString();
  }

  /**
   * Updates the form, and the hashURL with values from localStorage.
   **/
  updateFormAndHashURL(form: HTMLFormElement): void {
    this.updateFormValues(form);
    this.updateHashURL();
  }

  /**
   * Converts the form values to a PuppyData object.
   **/
  formToPuppyPreview(stored?: AdminState): PuppyDataType {
    if (!stored) stored = this.stored;

    try {
      // @ts-expect-error This function is not being used.
      const puppyData = castPuppyFromD1(stored);
      return puppyData;
    } catch (e) {
      console.error(e);
      return "Error" as unknown as PuppyDataType;
    }
  }

  /**
   * Converts the form values to a ParentData object.
   **/
  formToParentPreview(stored?: AdminState): ParentDataType {
    if (!stored) stored = this.stored;

    try {
      // @ts-expect-error This function is not being used.
      const parentData = castParentFromD1(stored);
      return {
        dogData: parentData,
        partnerData: {},
        litterData: {},
        ids: {},
      } as ParentDataType;
    } catch (e) {
      console.error(e);
      return "Error" as unknown as ParentDataType;
    }
  }
}
