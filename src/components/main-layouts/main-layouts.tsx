"use client";
import { useRef } from "react";
import Nav from "@/components/nav/menu-items";
import { type MenuDataType } from "@/constants/nav";

function MainLayouts({
  menuData,
  modal,
  children,
  _2wood,
  _3tan,
  css,
}: {
  menuData: MenuDataType;
  modal: React.ReactNode;
  children: React.ReactNode;
  _2wood: React.ReactNode;
  _3tan: React.ReactNode;
  css: Record<string, string>;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Nav menuData={menuData} exitRef={contentRef} />
      <div ref={contentRef}>
        {modal}
        <div className={css["white-layout"]}>
          <div className={css["left-flex"]} />
          <div className={css["content-box"]}>{children}</div>
          <div className={css["right-flex"]} />
        </div>
        <div className={`${css["wood-layout"]} ${css["woodgrain"]}`}>
          <div className={css["left-flex"]} />
          <div className={css["content-box"]}>{_2wood}</div>
          <div className={css["right-flex"]} />
        </div>
        <div className={css["tan-layout"]}>
          <div className={css["left-flex"]} />
          <div className={css["content-box"]}>{_3tan}</div>
          <div className={css["right-flex"]} />
        </div>
      </div>
    </>
  );
}

export default MainLayouts;
