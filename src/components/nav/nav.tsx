"use client";
export const runtime = "edge";

//Utilities
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

// Styles
import navCSS from "@styles/nav.module.scss";

// Components
import Link from "next/link";

export const SUBMENU_STATES = {
  Initial: "Initial",
  Mothers: "Mothers",
  Litters: "Litters",
} as const;

export const MENU_STATES = {
  open: "open",
  closed: "closed",
  submenu: "submenu",
} as const;

export type MenuStateTypes = (typeof MENU_STATES)[keyof typeof MENU_STATES];
export type SubMenuStateTypes =
  (typeof SUBMENU_STATES)[keyof typeof SUBMENU_STATES];

function NavMenu({
  menuData,
}: {
  menuData: {
    [SUBMENU_STATES.Mothers]: React.ReactNode;
    [SUBMENU_STATES.Litters]: React.ReactNode;
  };
}) {
  const [subMenuState, setSubMenuState]: [
    SubMenuStateTypes,
    React.Dispatch<React.SetStateAction<SubMenuStateTypes>>
  ] = useState(SUBMENU_STATES["Initial"] as SubMenuStateTypes);

  // After the initial load the menu state is switched to closed. 'open' is the
  // correct initialization.
  const [menuState, setMenuState]: [
    MenuStateTypes,
    React.Dispatch<React.SetStateAction<MenuStateTypes>>
  ] = useState(MENU_STATES["open"] as MenuStateTypes);

  const menuTween: gsap.TweenVars = {
    display: "flex",
    width: "100%",
    height: "100%",
    padding: "0.25em 0",
    alignItems: "center",
    overflow: () =>
      window.innerWidth < Number.parseFloat(navCSS["LgPhoneViewport"])
        ? "scroll"
        : "visible",
    position: "fixed",
    top: 0,
    left: 0,
    ease: "linear",
    delay: 0,
  };

  const buttonTween: gsap.TweenVars = {
    position: "absolute",
    bottom: 5,
    boxShadow: "transparent 0px 0px 0px 0px",
    backgroundColor: navCSS.lightTertiaryCherry,
    color: navCSS.darkTertiaryCherry,
    display: "none",
    opacity: 0,
  };

  const menuRef = useRef<HTMLElement>(null),
    exitHandler = useRef<() => void>(),
    menuTl = useRef<gsap.core.Timeline>(),
    mothersMenuRef = useRef<HTMLLIElement>(null),
    littersMenuRef = useRef<HTMLLIElement>(null),
    backToMainMenuRef = useRef<HTMLLIElement>(null),
    buttonRef = useRef<HTMLButtonElement>(null);

  /**Protects focus while the menu is closed.*/
  function setMenuInerts(addOrRemove: "add" | "remove") {
    const noInertLinks = () =>
      menuRef.current?.querySelectorAll("a").forEach((link) => {
        link.inert = false;
      });
    const yesInertLinks = () =>
      menuRef.current?.querySelectorAll("a").forEach((link) => {
        link.inert = true;
      });
    switch (addOrRemove) {
      case "add":
        if (!menuRef.current)
          document.addEventListener("DOMContentLoaded", () => yesInertLinks, {
            once: true,
            passive: true,
          });
        else yesInertLinks();
        break;
      case "remove":
        if (!menuRef.current)
          document.addEventListener("DOMContentLoaded", () => noInertLinks, {
            once: true,
            passive: true,
          });
        else noInertLinks();
        break;
      default:
        throw new Error("Invalid argument for setMenuIndex: " + addOrRemove);
    }
  }

  const menuHeight: number = Number.parseFloat(navCSS["menuHeight"]);

  const setMenuPosition = async (height: number) => {
    if (window.innerWidth < Number.parseFloat(navCSS["LgPhoneViewport"]))
      await gsap.to(`.${navCSS["nav"]}`, {
        bottom: 0,
        height,
        duration: navCSS["transitionShort"],
      });
  };

  const reverseTl = async () => {
    if (!menuTl.current) throw new Error("Timeline not found.");
    if (!buttonRef.current) throw new Error("Button not found.");
    setMenuPosition(menuHeight);
    await menuTl.current.reversed(!menuTl.current.reversed());
    buttonRef.current.focus(); // This prevents menu items from stealing focus after the menu closes.
  };

  const buttonEventHandler = async () => {
    await reverseTl();
    exitHandler.current!();
  };

  const handleExit = async (e: MouseEvent | KeyboardEvent | Event) => {
    if (
      (((e as KeyboardEvent).key === "Escape" ||
        (e as KeyboardEvent).key === "Enter" ||
        (e as KeyboardEvent).key === " " ||
        e.type === "scroll" ||
        (e.type === "click" &&
          !menuRef.current?.contains(e.target as HTMLElement) &&
          (backToMainMenuRef.current !== e.target ||
            mothersMenuRef.current !== e.target ||
            littersMenuRef.current !== e.target ||
            menuRef.current !== e.target))) &&
        (menuState === MENU_STATES["open"] || MENU_STATES["submenu"])) ||
      (e.target as HTMLElement).classList.contains(navCSS["submenu-item"])
    ) {
      window.removeEventListener("click", handleExit);
      window.removeEventListener("keyup", handleExit);
      window.removeEventListener("scroll", handleExit);
      if (menuState === "submenu") {
        setMenuState(MENU_STATES["open"]);
        await setMenuPosition(menuHeight);
      }
      setSubMenuState(SUBMENU_STATES["Initial"]);
      await reverseTl();
    } else if (
      (e.type === "click" || e.type === "scroll") &&
      mothersMenuRef.current === e.target
    ) {
      setMenuState(MENU_STATES["submenu"]);
      setMenuPosition(350);
      setSubMenuState(SUBMENU_STATES["Mothers"]);
    } else if (e.type === "click" && littersMenuRef.current === e.target) {
      setMenuState(MENU_STATES["submenu"]);
      setMenuPosition(350);
      setSubMenuState(SUBMENU_STATES["Litters"]);
    } else if (
      (e.type === "click" || e.type === "scroll") &&
      backToMainMenuRef.current === e.target
    ) {
      setMenuState(MENU_STATES["open"]);
      setMenuPosition(menuHeight);
      setSubMenuState(SUBMENU_STATES["Initial"]);
    }
  };

  useGSAP(() => {
    setMenuInerts("add");
    gsap
      .to(`#${navCSS["title-menu-button"]}`, {
        boxShadow: `${navCSS.darkTertiaryCherry} ${navCSS.boxShadowX}px ${navCSS.boxShadowY}px ${navCSS.boxShadowBlur}px`,
      })
      .play();

    menuTl.current = gsap.timeline({
      defaults: { duration: Number.parseFloat(navCSS["transitionShort"]) },
    });

    menuTl.current
      .to(menuRef.current, { width: "100%", duration: 0.01 })
      .to(`#${navCSS["title-menu-button"]}`, {
        transition: "none",
        duration: 0,
      })
      .to(`.${navCSS["menu"]}`, menuTween, "<")
      .to(`#${navCSS["title-menu-button"]}`, buttonTween, "<")
      .to(`#${navCSS["title-menu-button"]}`, {
        clearProps: "transition",
        duration: 0,
      })
      .to(`.${navCSS["menu"]}`, { flexWrap: "wrap", duration: 0 }, ">")
      .call(setMenuInerts, ["remove"])
      .call(setMenuState, ["Initial"])
      .call(() => setMenuState(menuState === "closed" ? "open" : "closed"));
    menuTl.current.reversed(true);

    exitHandler.current = () => {
      window.addEventListener("click", handleExit, {
        passive: true,
      });
      window.addEventListener("keyup", handleExit, {
        passive: true,
      });
      window.addEventListener("scroll", handleExit, {
        passive: true,
      });
    };

    return () => {
      window.removeEventListener("click", handleExit);
      window.removeEventListener("keyup", handleExit);
      window.removeEventListener("scroll", handleExit);
    };
  });

  return (
    <nav className={navCSS["nav"]} ref={menuRef}>
      <button
        onClick={buttonEventHandler}
        id={navCSS["title-menu-button"]}
        ref={buttonRef}
        tabIndex={0}
      >
        Menu
      </button>
      <menu className={navCSS["menu"]}>
        {subMenuState === SUBMENU_STATES.Initial ? (
          <>
            <Link href="/" className={navCSS["menu-item"]}>
              Home
            </Link>
            <Link href="/about" className={navCSS["menu-item"]}>
              About
            </Link>
          </>
        ) : null}
        {(() => {
          if (subMenuState === SUBMENU_STATES.Mothers)
            return (
              <div className={navCSS["submenu"]}>
                <li
                  className={`${navCSS["menu-item"]} ${navCSS["back"]}`}
                  ref={backToMainMenuRef}
                >
                  &lt; Back
                </li>
                {menuData[SUBMENU_STATES.Mothers]}
              </div>
            );
          if (subMenuState === SUBMENU_STATES.Initial)
            return (
              <li className={`${navCSS["menu-item"]}`} ref={mothersMenuRef}>
                Mothers
              </li>
            );
        })()}
        {(() => {
          if (subMenuState === SUBMENU_STATES.Litters)
            return (
              <div
                className={`${navCSS["submenu"]} ${navCSS["litter-submenu"]}`}
              >
                <li
                  className={`${navCSS["menu-item"]} ${navCSS["back"]}`}
                  ref={backToMainMenuRef}
                >
                  &lt; Back
                </li>
                {menuData[SUBMENU_STATES.Litters]}
              </div>
            );
          if (subMenuState === SUBMENU_STATES.Initial)
            return (
              <li className={navCSS["menu-item"]} ref={littersMenuRef}>
                Recent Litters
              </li>
            );
        })()}
      </menu>
    </nav>
  );
}

export default NavMenu;
