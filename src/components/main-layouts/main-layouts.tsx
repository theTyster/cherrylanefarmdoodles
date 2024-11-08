"use client";
import { useRef } from "react";
import Nav from "@/components/nav/menu-items";
import { type MenuDataType } from "@/constants/nav";
import Image from "next/image";
import Link from "next/link";
import Logo from "@pub/images/cherry-lane-farm-logo--256px.png";

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
        <header>
          <Link className={css["home-button"]} href="/">
            <Image
              className={css["logo"]}
              src={Logo}
              placeholder="blur"
              alt="Cherry Lane Farm Doodles logo"
              width={250}
              height={250}
              priority
            />
          </Link>
        </header>
        {modal}
        <div className={css["white-layout"]}>
          <div className={css["left-flex"]} />
          <div className={css["content-box"]}>{children}</div>
          <div className={css["right-flex"]} />
        </div>
        <div className={`${css["wood-layout"]}`}>
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
