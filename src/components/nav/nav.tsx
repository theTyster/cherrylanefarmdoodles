"use client";
// Components
import Link from "next/link";
import Image from "next/image";
import { font } from "@styles/font";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

// Static
import Logo from "@pub/images/cherry-lane-farm-logo--256px.png";

// Styles
import navCSS from "@styles/nav.module.scss";
import Theme from "@styles/theme.module.scss";

export const runtime = "edge";

function Nav() {
  //    const navRef = useRef<HTMLElement>(null);
  //    const { contextSafe } = useGSAP(
  //      () => {
  //        const hamTlOpen = gsap.timeline({
  //          //defaults: { ease: "elastic.inOut(1, .3)" },
  //        });
  //        hamTlOpen
  //          .to("#ham-top", { y: 40, ease: "back.inOut" })
  //          .to("#ham-mid", { y: 20, ease: "back.inOut" }, "<")
  //          .to("#ham-top, #ham-bot", {
  //            x: "+=3",
  //            y: "-=20",
  //            fill: Theme.lightTertiaryCherry,
  //            transformOrigin: "left",
  //            rotation: -20,
  //          })
  //          .to(
  //            "#ham-mid",
  //            {
  //              x: "+=2.5",
  //              y: "-=22.5",
  //              fill: Theme.lightTertiaryCherry,
  //              transformOrigin: "left",
  //              rotation: 20,
  //            },
  //            "<"
  //          )
  //          .reverse();
  //
  //        hamTlOpen.totalDuration(0.6);
  //        let menuIsOpen = false;
  //        const menuButton =
  //          navRef.current?.querySelector<HTMLButtonElement>("title-menu-button");
  //
  //        menuButton?.addEventListener("click", () => {
  //          alert("menuButton clicked");
  //          menuIsOpen ? (menuIsOpen = false) : (menuIsOpen = true);
  //          // Every time the button is clicked, an animation is played in reverse.
  //          hamTlOpen.reversed(!hamTlOpen.reversed());
  //        });
  //      },
  //      { scope: navRef }
  //    );
  //    const hamTlTrigger = useRef<HTMLButtonElement>(null);

  const smallScreenTween = {
    display: "grid",
    width: "100%",
    height: "300px",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    ease: "back.out",
  };
  const largeScreenTween = {
    width: "100%",
    height: "150px",
    alignItems: "center",
    display: "flex",
    position: "fixed",
    ease: "back.out",
  };
  const buttonTween = {
    minWidth: "118px",
    top: 40,
    backgroundColor: Theme.lightTertiaryCherry,
    color: Theme.darkTertiaryCherry,
    ease: "back.out",
  };
  const [screenWidth, setScreenWidth] = useState<number>();
  const menuRef = useRef<HTMLElement>(null),
    menuTl = useRef<gsap.core.Timeline>();
  useGSAP(
    () => {
      const getScreenWidth = () => window.screen?.width;
      const menuTween =
        getScreenWidth() < 445 ? smallScreenTween : largeScreenTween;
      getScreenWidth() < 445
        ? (buttonTween.top =
            Number.parseFloat(Theme.spaceBetweenElements.replace("px", "")) / 2)
        : undefined;
      menuTl.current = gsap.timeline({
        paused: true,
        defaults: { duration: 1 },
      });
      menuTl.current
        .to(`.${navCSS["menu"]}`, {
          ...menuTween,
        })
        .to(
          `.${navCSS["home-button"]} .${navCSS["logo"]}`,
          { opacity: 0, height: 0 },
          "<"
        )
        .to(`#${navCSS["title-menu-button"]}`, buttonTween, "<");
      setScreenWidth(getScreenWidth());
    },
    {
      scope: menuRef,
      dependencies: [
        smallScreenTween,
        largeScreenTween,
        buttonTween,
        screenWidth,
      ],
    }
  );

  const menuToggle = () => {
    if (!menuTl.current) return;
    menuTl.current.seek(0);
    if (menuTl.current.paused()) menuTl.current.play();
    else menuTl.current.reversed(!menuTl.current.reversed());
    return;
  };

  return (
    <>
      <nav className={navCSS["sliderMenu"]} ref={menuRef}>
        <button
          className={font.className}
          id={navCSS["title-menu-button"]}
          onClick={menuToggle}
        >
          Menu
        </button>
        <menu className={navCSS["menu"]}>
          <Link className={navCSS["link"]} href="/litter/1">
            Litters
          </Link>
          <Link className={navCSS["link"]} href="/dams/1">
            Mothers
          </Link>
        </menu>
        <Link className={navCSS["home-button"]} href="/">
          {/*          <svg
            className={navCSS["site-name"]}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink={"http://www.w3.org/1999/xlink"}
            role="title"
            viewBox="0 0 500 60"
            fontWeight={700}
            fontSize={35}
            fill={Theme.darkPrimary}
          >
            <title>Cherry Lane Farm Doodles</title>
            <desc>Go back to the home page</desc>
            <text x={10} y={37}>
              Cherry Lane Farm Doodles
            </text>
          </svg>*/}
          <Image
            src={Logo}
            className={navCSS["logo"]}
            placeholder="blur"
            alt="Cherry Lane Farm Doodles logo"
            width={150}
            height={150}
          />
        </Link>
      </nav>
    </>
  );
}

export default Nav;
