"use server";
import { type FormState } from "@/components/new-dog-form/new-dog-form";
import { type AdminState } from "@/components/new-dog-form/constants/server-data-handler";
import { getRequestContext } from "@cloudflare/next-on-pages";
import D1Statements from "@/constants/statements";
import { FormTransformer } from "@/components/new-dog-form/constants/form-data-transformer";

/**
 * This function handles every form submission and needs to be able to adapt
 * for the different form states.
 **/
//async  handleFormSubmission<T extends AdminState>(currentFormState: T,
//formData: DogsDBTableValTypes<T>): Promise<T>{
export default async function handleFormSubmission(
  currentFormState: FormState,
  formData?: FormData
): Promise<typeof currentFormState> {
  if (!formData) {
    return {
      success: false,
      error: "No form data was provided.",
    };
  }

  const D1 = getRequestContext().env.dogsDB;
  let nextFormState: FormState = {
    success: false,
    error: "No form data was provided.",
  };

  const adminState = formData.get("formType") as AdminState;

  if (adminState) {
    try {
      const Statements = new D1Statements();
      const F = new FormTransformer();

      /**
       * The Data from the form as a POJO.
       **/
      const data = F.transform(adminState, formData);

      /**
       * The SQL statement created using the data provided from the form.
       **/
      const stmt = Statements.makeInsertStatement(adminState, data);

      console.log(stmt);

      const results = await D1.prepare(stmt).all();
      console.log(results);
      nextFormState = {
        success: results.success,
        error:
          results?.error ?? results.meta.changed_db
            ? "The Database was changed succesfully. You should see the changes reflect on the website in the next 8 hours."
            : "No changes were made.",
      };

      return nextFormState;
    } catch (e) {
      nextFormState = {
        success: false,
        error:
          `D1 was unable to execute the SQL statement. Please, try again. If this error persists, contact Ty. \n Error: ${e}`,
      };
      return nextFormState;
    }
  }

  return nextFormState;
}
