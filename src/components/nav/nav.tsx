// FIX TAB INDEX FOR MENU ITEMS
"use client";
// Components
import Link from "next/link";
import { font } from "@styles/font";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

// Styles
import navCSS from "@styles/nav.module.scss";

export const runtime = "edge";

function Nav() {
  const menuTween: gsap.TweenVars = {
    display: "flex",
    width: "100%",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    ease: "linear",
    delay: 0,
  };

  const buttonTween: gsap.TweenVars = {
    position: "absolute",
    bottom: 5,
    height: Number.parseFloat(navCSS["menuButtonHeight"]) / 2 + "px",
    borderRadius: Number.parseFloat(navCSS["buttonRadius"]) - 0.5 + "rem",
    boxShadow: "transparent 0px 0px 0px 0px",
    fontSize: "1rem",
    backgroundColor: navCSS.lightTertiaryCherry,
    color: navCSS.darkTertiaryCherry,
    display: "none", // use this until their is more to put in the menu.
    opacity: 0, // use this until their is more to put in the menu.
  };

  const menuRef = useRef<HTMLElement>(null),
    menuTl = useRef<gsap.core.Timeline>(),
    buttonRef = useRef<HTMLButtonElement>(null),
    refChecker = () => {
      const button = buttonRef.current;
      const tl = menuTl.current;
      const nav = menuRef.current;

      if (!tl) throw new Error("Gsap timeline not found in the menu: " + tl);
      if (!nav) throw new Error("Nav not found in the dom: " + nav);
      if (!button) throw new Error("Button not found: " + button);
      return { button, tl, nav };
    };
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

  useGSAP(
    () => {
      menuTl.current = gsap.timeline({
        paused: true,
        defaults: { duration: Number.parseFloat(navCSS["transitionShort"]) },
      });

      gsap
        .to(`#${navCSS["title-menu-button"]}`, {
          boxShadow: `${navCSS.darkTertiaryCherry} ${navCSS.boxShadowX}px ${navCSS.boxShadowY}px ${navCSS.boxShadowBlur}px`,
        })
        .play();

      setMenuInerts("add");
      menuTl.current
        .call(setMenuInerts, ["remove"])
        .to(menuRef.current, { width: "100%", duration: 0 })
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
        .to(`.${navCSS["menu"]}`, { flexWrap: "wrap", duration: 0 }, ">");
      const { button } = refChecker();
      button.addEventListener("click", firstClickHandler, {
        once: true,
        passive: true,
      });
    },
    {
      scope: menuRef,
      dependencies: [buttonRef, menuTween, buttonTween],
    }
  );

  const reverseTl = async () => {
    const { tl, button } = refChecker();
    await tl.reversed(!tl.reversed());
    button.focus(); // This prevents menu items from stealing focus after the menu closes.
  };

  const playTl = async () => {
    const { tl } = refChecker();
    await tl.play(0);
  };

  const tlIsOpen = () => {
    const { tl } = refChecker();
    if (tl.progress() === 1) return true;
    else if (tl.progress() === 0) return false;
    else
      throw new Error("Timeline is not at the start or end: " + tl.progress());
  };

  const keyCloser = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      subsequentClicksHandler();
    }
  };

  const addCloserListeners = () => {
    document.addEventListener("click", subsequentClicksHandler);
    document.addEventListener("keyup", keyCloser);
    document.addEventListener("scroll", subsequentClicksHandler);
  };

  const removeCloserListeners = () => {
    document.removeEventListener("click", subsequentClicksHandler);
    document.removeEventListener("keyup", keyCloser);
    document.removeEventListener("scroll", subsequentClicksHandler);
  };

  const subsequentClicksHandler = async () => {
    const { button } = refChecker();
    removeCloserListeners();
    await reverseTl();

    if (tlIsOpen()) {
      addCloserListeners();
      setMenuInerts("remove");
    } else {
      button.addEventListener("click", subsequentClicksHandler, {
        once: true,
        passive: true,
      });
      setMenuInerts("add");
    }
  };

  const firstClickHandler = async () => {
    await playTl();
    addCloserListeners();
    setMenuInerts("remove");
  };

  return (
    <>
      <nav className={navCSS["sliderMenu"]} ref={menuRef}>
        <button
          className={font.className}
          id={navCSS["title-menu-button"]}
          ref={buttonRef}
          tabIndex={0}
        >
          Menu
        </button>
        <menu className={navCSS["menu"]}>
          <Link className={navCSS["link"]} href="/">
            Home
          </Link>
          <Link className={navCSS["link"]} href="/about">
            About
          </Link>
          <Link className={navCSS["link"]} href="/dams/1">
            Mothers
          </Link>
          <Link className={navCSS["link"]} href="/litter/1">
            Litters
          </Link>
        </menu>
      </nav>
    </>
  );
}

export default Nav;
