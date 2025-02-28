"use server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import AdminDataHandler, {
  type CurrentDataKeys,
  type CurrentData,
  type IdName
} from "@/components/dog-data-panel/actions/admin-data-handler";

export default async function synchronizeInputData(
  whichOptions: CurrentDataKeys
): Promise<IdName[]> {
  const D1 = getRequestContext().env.dogsDB;
  const DH = new AdminDataHandler();
  const data = await DH.getCurrentData(D1);
  const currentData = data[whichOptions] as CurrentData[typeof whichOptions];
  return currentData;
}
