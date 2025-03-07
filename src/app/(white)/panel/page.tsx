export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";
import AdminDataHandler from "@/components/dog-data-panel/actions/admin-data-handler";

// Components
import DogDataPanel from "@/components/dog-data-panel/dog-data-panel";
import TabMenu, {
  type MenuDataArr,
  type MenuNamesObj,
} from "@/components/tab-menu/tab-menu";

async function Page() {
  const D1 = getRequestContext().env.dogsDB;
  const DH = new AdminDataHandler();
  await DH.getCurrentData(D1);

  const menuNamesObj: MenuNamesObj = {
    create: 0,
    edit: 1,
  };

  const menuDataArr: MenuDataArr = [
    {
      id: "create",
      title: {
        string: "Create New",
        component: "Create New",
      },
      tabContent: <DogDataPanel variant={"create"} currentData={DH.currentData} />,
    },
    {
      id: "edit",
      title: {
        string: "Edit Existing",
        component: "Edit Existing",
      },
      tabContent: <DogDataPanel variant={"change"} currentData={DH.currentData} />,
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
