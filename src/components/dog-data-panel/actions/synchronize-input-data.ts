"use server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import AdminDataHandler from "@/components/dog-data-panel/actions/admin-data-handler";

export default async function synchronizeInputData() {
  const D1 = getRequestContext().env.dogsDB;
  const DH = new AdminDataHandler(D1);
  const inputData = await DH.getInputData();
  return inputData;
}
