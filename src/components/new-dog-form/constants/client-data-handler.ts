import ServerAdminDataHandler, {
  ADMIN_STATES,
  type AdminState as AdminStateType,
  FORMDATA_STATES,
  type FormDataState as FormDataStateType,
  PREVIEW_STATES,
  type PreviewState as PreviewStateType,
} from "@/components/new-dog-form/constants/server-data-handler";

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
  set stored(values: AdminState) {
    window.localStorage.setItem(this.storageKey, values);
  }

}
