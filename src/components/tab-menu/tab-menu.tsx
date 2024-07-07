"use client";
import { useState } from "react";
//CSS
// FIXME: import "./tab-menu.scss";

export type MenuNamesObj = {
  [key: string]: number;
};

export type MenuDataArr = Array<{
  id: string;
  title: string;
  component: JSX.Element;
  buttonClick?: React.MouseEventHandler;
}>;

function TabMenu({
  menuDataArr,
  menuNamesObj,
  initial,
}:
{
  menuDataArr: MenuDataArr;
  menuNamesObj: MenuNamesObj;
  initial: string;
}): JSX.Element {
  const [menuState, setMenuState] = useState(initial);
  const currentSelected = menuDataArr[menuNamesObj[menuState]];

  const handleTabMenuClick: React.MouseEventHandler = (event) => {
    console.log(event.target);
    console.log(event.target instanceof HTMLElement);
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
    <div className="tabmenu">
      <menu onClick={handleTabMenuClick}>
        {menuDataArr.map((item) => (
          <button
            key={item.id}
            aria-label={item.title}
            data-tabmenu-item-id={item.id}
            className={item === currentSelected ? "selected" : ""}
            onClick={item.buttonClick ? item.buttonClick : undefined}
          >
            <h2
              className={`tabmenu-item-title${
                item.title ? `-${item.title}` : ""
              }`}
            >
              {item.title}
            </h2>
          </button>
        ))}
      </menu>
      <div className="menu-content">{currentSelected.component}</div>
    </div>
  );
}

export default TabMenu;
