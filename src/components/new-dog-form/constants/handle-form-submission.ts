"use server";
import { type FormState } from "@/components/new-dog-form/new-dog-form";
import { type AdminState } from "@/components/new-dog-form/constants/server-data-handler";
import { getRequestContext } from "@cloudflare/next-on-pages";
import D1Statements, { DogsDBTableValTypes } from "@/constants/statements";
import { FormTransformer } from "@/components/new-dog-form/constants/form-data-transformer";

export type FormattedDogsFormDataType = DogsDBTableValTypes<"Dogs", "id"> &
  (DogsDBTableValTypes<"Puppies", "id"> | DogsDBTableValTypes<"Adults", "id">);

/**
 * This function handles every form submission and needs to be able to adapt
 * for the different form states.
 **/
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
       * an ID of 0 is inserted for queries that do not return an id that succeeded.
       * an ID of -1 is inserted for queries that do not return an id that failed.
       **/
      type DogsDBResultsType = { id: number; msg: string };
      type UpdateResults = { msg: string };
      const dogsDBResults: (DogsDBResultsType & UpdateResults)[] = [];

      /**
       * If the data contains a newly created dog, then insert the dog into the
       * dog table first and get the new id.
       **/
      if (data.length === 2) {
        /**
         * The rows that will be inserted into the Adult or Puppy table.
         **/
        const pupOrAdultRows = data[0];
        /**
         * The rows that will be inserted into the dog table.
         **/
        const dogRows = data[1];

        /**
         * Insert the Adult or Puppy first.
         **/
        const pupOrAdultInsertStmt = Statements.makeInsertStatement(
          adminState,
          pupOrAdultRows
        );


        /**
         * Insert the Adult or Puppy as a dog into the dog table second.
         **/
        const dogInsertStmt = Statements.makeInsertStatement("Dogs", dogRows);

        try {
          const dogInsertResults = await Promise.all([
            //Insert into the Adults or Puppies table.
            D1.prepare(pupOrAdultInsertStmt).run<{ id: number }>(),

            //Insert into the Dogs Table.
            D1.prepare(dogInsertStmt).run<{ id: number }>(),
          ]);

          dogsDBResults.push(
            {
              id: dogInsertResults[0].results[0].id,
              msg: "The Adult has been added,\n",
            },
            {
              id: dogInsertResults[1].results[0].id,
              msg: "The dog has been added,\n",
            }
          );
        } catch (e) {
          dogsDBResults.push({
            id: -1,
            msg: "The dog could not be added,\n" + e,
          });
        }

        /**
         * This object is used to generate the update statement and contains
         * the dogId for the newly created dog for updating the Adult.
         **/
        const dogIdObj = {
          dogId: dogsDBResults[1].id,
        };

        /**
         * Update the Adult or Puppy with the new dog id.
         **/
        const pupOrAdultUpdateStmt = Statements.makeUpdateStmt(
          adminState,
          dogIdObj,
          dogsDBResults[0].id
        );


        try {
          // Update the Adult or Puppy with the new dog id.
          await D1.prepare(pupOrAdultUpdateStmt).run<Record<string, never>>();

          dogsDBResults.push({
            id: 0,
            msg: "and the Adult or Puppy was updated with the correct dogId. ",
          });
        } catch (e) {
          dogsDBResults.push({
            id: -1,
            msg:
              `but the Adult or Puppy could not be updated with the correct dogId: ${dogIdObj.dogId}` +
              e +
              "\n",
          });

          try {
            // If any of the queries failed, then delete the dog and adult or puppy.
            Promise.all([
              D1.prepare(
                Statements.makeDeleteStmt("Adults", dogsDBResults[0].id)
              ).run(),
              D1.prepare(
                Statements.makeDeleteStmt("Dogs", dogsDBResults[1].id)
              ).run(),
            ]);
          } catch (e) {
            //If the dog could not be deleted, then the database is in an inconsistent state.
            //TODO: This will need to be managed by a cron job that will clean up the fragmented data later.
            console.error(e);
          }
        }

        // Alternately, the data does not contain a newly created dog.
      } else {
        /**
         * The SQL statement created using the data provided from the form.
         **/
        const insertStmt = Statements.makeInsertStatement(adminState, data[0]);


        try {
          const results = await D1.prepare(insertStmt).run<{ id: number }>();
          dogsDBResults.push({
            id: results.results[0].id,
            msg: "The data was inserted.\n",
          });
        } catch (e) {
          dogsDBResults.push({
            id: -1,
            msg: "The data could not be inserted.\n\n" + e,
          });
        }
      }


      const submissionResults: {
        success?: boolean;
        msg?: string;
      } = {
        success: undefined,
        msg: undefined,
      };

      // If any of the results have an id of -1, then a submission failed.
      if (dogsDBResults.some((result) => result.id === -1)) {
        submissionResults.msg = dogsDBResults
          .filter((result) => result.msg)
          .join("\n");
        submissionResults.msg +=
          "\n\nThe Changes made have been cleared from the database. Please, try again. If this error persists, contact Ty.";
        submissionResults.success = false;
      } else {
        const resultantMessages = dogsDBResults.map((result) => result.msg);

        submissionResults.msg = resultantMessages.join("\n ");

        submissionResults.msg +=
          "You should see the changes reflect on the website in the next 8 hours.";
        submissionResults.success = true;
      }

      nextFormState = {
        success: submissionResults.success,
        error: submissionResults.msg,
      };

      return nextFormState;
    } catch (e) {
      nextFormState = {
        success: false,
        error: `D1 was unable to execute the SQL statement. Please, try again. If this error persists, contact Ty. \n Error: ${e}`,
      };
      return nextFormState;
    }
  }

  return nextFormState;
}
