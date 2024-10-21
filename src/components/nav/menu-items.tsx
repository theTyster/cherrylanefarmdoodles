// Components
import Link from "next/link";
import NavMenu from "@/components/nav/nav";

// Styles
import navCSS from "@styles/nav.module.scss";

// Types
import { MenuItemData, MenuDataType
} from "@/constants/nav";


export const runtime = "edge";

async function SubMenu({
  menuData,
}: {
  menuData: MenuDataType;
}) {
  const {
    motherData,
    litterData,
  }: { motherData: MenuItemData; litterData: MenuItemData } = menuData;

  function renderSubMenuOf(
    menuItemCollection: typeof motherData | typeof litterData
  ) {
    return menuItemCollection.map((item) => (
      <Link
        key={item.name + item.id}
        href={`/litter/${item.id}`}
        className={navCSS["menu-item"]}
      >
        {item.name}
      </Link>
    ));
  }
    return (
      <NavMenu
        menuData={{
          Mothers: <>{renderSubMenuOf(motherData)}</>,
          Litters: <>{renderSubMenuOf(litterData)}</>,
        }}
      />
    );
}

export default SubMenu;
