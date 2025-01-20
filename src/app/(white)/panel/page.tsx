export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";
import AdminDataHandler from "@/components/new-dog-form/actions/server-data-handler";

// Components
import NewDogForm from "@/components/new-dog-form/new-dog-form";
import TabMenu, {
  type MenuDataArr,
  type MenuNamesObj,
} from "@/components/tab-menu/tab-menu";

function EditExisting({
  inputData,
}: {
  inputData: AdminDataHandler["inputData"];
}) {
  return JSON.stringify(inputData);
}

async function Page() {
  const D1 = getRequestContext().env.dogsDB;
  const DH = new AdminDataHandler(D1);
  const inputData = await DH.getInputData();

  const menuNamesObj: MenuNamesObj = {
    create: 0,
    edit: 1,
  };

  const menuDataArr: MenuDataArr = [
    {
      id: "create",
      title: "Create New",
      component: <NewDogForm inputData={inputData} />,
    },
    {
      id: "edit",
      title: "Edit Existing",
      component: <EditExisting inputData={inputData} />,
    },
  ];

  return (
    <>
      <h2>Site Administration</h2>
      <TabMenu
        menuDataArr={menuDataArr}
        menuNamesObj={menuNamesObj}
        initial={"create"}
      />
    </>
  );
}
export default Page;
