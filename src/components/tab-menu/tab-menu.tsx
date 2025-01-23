"use client";
import { useState, Fragment } from "react";

//CSS
import css from "@styles/tab-menu.module.scss";

export type MenuNamesObj = {
  [key: string]: number;
};

export type MenuDataArr = Array<{
  id: string;
  title: { string: string; icon: React.ReactNode };
  component: React.ReactNode;
  buttonClick?: React.MouseEventHandler;
}>;

function TabMenu({
  menuDataArr,
  menuNamesObj,
  initial,
}: {
  menuDataArr: MenuDataArr;
  menuNamesObj: MenuNamesObj;
  initial: string;
}): React.ReactNode {
  const [menuState, setMenuState] = useState(initial);
  const currentSelected = menuDataArr[menuNamesObj[menuState]];

  const handleTabMenuClick: React.MouseEventHandler = (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.dataset instanceof DOMStringMap &&
      event.target.dataset &&
      event.target.dataset.tabmenuItemId
    ) {
      const state =
        menuDataArr[menuNamesObj[event.target.dataset.tabmenuItemId]].id;
      setMenuState(state);
    }
    if (
      event.target instanceof HTMLElement &&
      event.target.parentElement &&
      event.target.parentElement.dataset instanceof DOMStringMap &&
      event.target.parentElement.dataset.tabmenuItemId
    ) {
      const state =
        menuDataArr[
          menuNamesObj[event.target.parentElement.dataset.tabmenuItemId]
        ].id;
      setMenuState(state);
    }
  };

  return (
    <>
      <menu className={css.container} onClick={handleTabMenuClick}>
        <table>
          <tbody>
            <tr>
              {menuDataArr.map((item) => (
                <Fragment key={`${item.id}`}>
                  <td>
                    <button
                      aria-label={item.title.string}
                      data-tabmenu-item-id={item.id}
                      className={`${css.selectorButton} ${
                        item === currentSelected ? css["selected"] : ""
                      }`}
                      onClick={item.buttonClick ? item.buttonClick : undefined}
                    >
                      {item.title.icon}
                    </button>
                  </td>
                </Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </menu>
      <div>{currentSelected.component}</div>
    </>
  );
}

export default TabMenu;
