"use server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import AdminDataHandler from "@/components/new-dog-form/actions/server-data-handler";

export default async function synchronizeInputData() {
  const D1 = getRequestContext().env.dogsDB;
  const DH = new AdminDataHandler(D1);
  const inputData = await DH.getInputData();
  return inputData;
}
