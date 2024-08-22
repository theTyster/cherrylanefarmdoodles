"use client";
import { useState } from "react";

//CSS
import css from "@styles/tab-menu.module.scss";
import Theme from "@styles/theme.module.scss";
import { font } from "@styles/font";

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
}: {
  menuDataArr: MenuDataArr;
  menuNamesObj: MenuNamesObj;
  initial: string;
}): JSX.Element {
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
        {menuDataArr.map((item, index) => (
          <>
            <style jsx>
              {`
                button {
                  border-radius: ${setBorderRadius(index)};
                }
                @media screen and (max-width: ${Theme.LgPhoneViewport}) {
                  button {
                    border-radius: ${Theme.buttonRadius};
                  }
                }
              `}
            </style>
            <button
              key={item.id}
              aria-label={item.title}
              data-tabmenu-item-id={item.id}
              className={`${css.selectorButton} ${
                item === currentSelected
                  ? Theme["woodgrain-light"] + " " + css["selected"]
                  : Theme["woodgrain"]
              }`}
              onClick={item.buttonClick ? item.buttonClick : undefined}
            >
              <h2 className={font.className /**Important*/}>{item.title}</h2>
            </button>
          </>
        ))}
      </menu>
      <div className="menu-content">{currentSelected.component}</div>
    </div>
  );
}

export default TabMenu;
