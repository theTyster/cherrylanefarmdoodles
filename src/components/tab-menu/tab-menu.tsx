"use client";
import { useState, Fragment } from "react";

//CSS
import css from "@styles/tab-menu.module.scss";

export type MenuNamesObj = {
  [key: string]: number;
};

export type MenuDataArr = Array<{
  id: string;
  title: { string: string; component: React.ReactNode };
  tabContent: React.ReactNode;
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
            {menuDataArr.map(function (...args) {
              const index = args[1];
              return (
                <Fragment key={`${menuDataArr[index].id}`}>
                  {index % 3 === 0 && (
                    <tr>
                      <td>
                        <button
                          aria-label={menuDataArr[index].title.string}
                          data-tabmenu-item-id={menuDataArr[index].id}
                          className={`${css.selectorButton} ${
                            menuDataArr[index] === currentSelected
                              ? css["selected"]
                              : ""
                          }`}
                          onClick={
                            menuDataArr[index].buttonClick
                              ? menuDataArr[index].buttonClick
                              : undefined
                          }
                        >
                          {menuDataArr[index].title.component}
                        </button>
                      </td>
                      {menuDataArr[index + 1] ? (
                        <td>
                          <button
                            aria-label={menuDataArr[index + 1].title.string}
                            data-tabmenu-item-id={menuDataArr[index + 1].id}
                            className={`${css.selectorButton} ${
                              menuDataArr[index + 1] === currentSelected
                                ? css["selected"]
                                : ""
                            }`}
                            onClick={
                              menuDataArr[index + 1].buttonClick
                                ? menuDataArr[index + 1].buttonClick
                                : undefined
                            }
                          >
                            {menuDataArr[index + 1].title.component}
                          </button>
                        </td>
                      ) : null}
                      {menuDataArr[index + 2] ? (
                        <td>
                          <button
                            aria-label={menuDataArr[index + 2].title.string}
                            data-tabmenu-item-id={menuDataArr[index + 2].id}
                            className={`${css.selectorButton} ${
                              menuDataArr[index + 2] === currentSelected
                                ? css["selected"]
                                : ""
                            }`}
                            onClick={
                              menuDataArr[index + 2].buttonClick
                                ? menuDataArr[index + 2].buttonClick
                                : undefined
                            }
                          >
                            {menuDataArr[index + 2].title.component}
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </menu>
      <div>{currentSelected.tabContent}</div>
    </>
  );
}

export default TabMenu;
