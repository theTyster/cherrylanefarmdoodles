"use client";
import { useState, Fragment } from "react";

//CSS
import css from "@styles/tab-menu.module.scss";
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

  const setBorderRadiusRow = (index: number) =>
    //Gives the left most button a border-radius on left corners.
    index === 0
      ? `${css.buttonRadius} 0 0 ${css.buttonRadius}`
      : //Gives the right most button a border-radius on right corners.
      index === menuDataArr.length - 1
      ? `0 ${css.buttonRadius} ${css.buttonRadius} 0`
      : //Sets other buttons to no border-radius by default.
        "0 0 0 0";

   const setBorderRadiusColumn = (index: number) =>
    //Gives the top most button a border-radius on top corners.
    index === 0
      ? `${css.buttonRadius} ${css.buttonRadius} 0 0`
      : //Gives the bottom most button a border-radius on bottom corners.
      index === menuDataArr.length - 1
      ? `0 0 ${css.buttonRadius} ${css.buttonRadius}`
      : //Sets other buttons to no border-radius by default.
        "0 0 0 0";

  return (
    <>
      <menu className={css.container} onClick={handleTabMenuClick}>
        {menuDataArr.map((item, index) => (
          <Fragment key={`${item.id}`}>
            <style jsx>
              {`
                button {
                  border-radius: ${setBorderRadiusRow(index)};
                }
                @media screen and (max-width: ${css.LgPhoneViewport}) {
                  button {
                    border-radius: ${setBorderRadiusColumn(index)};
                  }
                }
              `}
            </style>
            <button
              aria-label={item.title}
              data-tabmenu-item-id={item.id}
              className={`${css.selectorButton} ${
                item === currentSelected
                  ? css["woodgrain-light"] + " " + css["selected"]
                  : css["woodgrain"]
              }`}
              onClick={item.buttonClick ? item.buttonClick : undefined}
            >
              <h2 className={font.className /**Important*/}>{item.title}</h2>
            </button>
          </Fragment>
        ))}
      </menu>
      {currentSelected.component}
    </>
  );
}

export default TabMenu;
