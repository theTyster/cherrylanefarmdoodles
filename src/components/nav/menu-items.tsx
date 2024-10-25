// Components
import Link from "next/link";
import NavMenu from "@/components/nav/nav";

// Styles
import navCSS from "@styles/nav.module.scss";

// Types
import { MenuItemData, MenuDataType
} from "@/constants/nav";


export const runtime = "edge";

function SubMenu({
  menuData,
  exitRef,
}: {
  menuData: MenuDataType;
  exitRef: React.RefObject<HTMLDivElement>;
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
        className={navCSS["submenu-item"]}
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
        exitRef={exitRef}
      />
    );
}

export default SubMenu;
