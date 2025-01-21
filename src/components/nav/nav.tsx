"use client";
export const runtime = "edge";

//Utilities
import gsap from "gsap";
import { useRef, useState, useMemo } from "react";

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
  superPositioned: "superPositioned",
} as const;

export type MenuStateTypes = (typeof MENU_STATES)[keyof typeof MENU_STATES];
export type SubMenuStateTypes =
  (typeof SUBMENU_STATES)[keyof typeof SUBMENU_STATES];

function NavMenu({
  menuData,
  exitRef,
}: {
  menuData: {
    [SUBMENU_STATES.Mothers]: React.ReactNode;
    [SUBMENU_STATES.Litters]: React.ReactNode;
  };
  exitRef: React.RefObject<HTMLDivElement>;
}) {
  const [subMenuState, setSubMenuState]: [
    SubMenuStateTypes,
    React.Dispatch<React.SetStateAction<SubMenuStateTypes>>
  ] = useState(SUBMENU_STATES["Initial"] as SubMenuStateTypes);

  const [menuState, setMenuState]: [
    MenuStateTypes,
    React.Dispatch<React.SetStateAction<MenuStateTypes>>
  ] = useState(MENU_STATES["closed"] as MenuStateTypes);

  const menuRef = useRef<HTMLElement>(null),
    navRef = useRef<HTMLElement>(null),
    mothersMenuRef = useRef<HTMLButtonElement>(null),
    littersMenuRef = useRef<HTMLButtonElement>(null),
    backToMainMenuRef = useRef<HTMLButtonElement>(null),
    buttonRef = useRef<HTMLButtonElement>(null);

  const MenuAnimation = useMemo(
    () =>
      class MenuAnimation {
        setMenuState: React.Dispatch<React.SetStateAction<MenuStateTypes>>;
        menuState: MenuStateTypes;
        subMenuState: SubMenuStateTypes;
        setSubMenuState: React.Dispatch<
          React.SetStateAction<SubMenuStateTypes>
        >;
        exit: React.RefObject<HTMLDivElement>;
        buttonTween?: gsap.core.Tween;

        constructor(
          setMenuState: React.Dispatch<React.SetStateAction<MenuStateTypes>>,
          menuState: MenuStateTypes,
          subMenuState: SubMenuStateTypes,
          setSubMenuState: React.Dispatch<
            React.SetStateAction<SubMenuStateTypes>
          >,
          exit: React.RefObject<HTMLDivElement>
        ) {
          this.setMenuState = setMenuState;
          this.menuState = menuState;
          this.setSubMenuState = setSubMenuState;
          this.subMenuState = subMenuState;
          this.exit = exit;
        }

        menuOpenTween: gsap.TweenVars = {
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "0.25em 0",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          ease: "linear",
          delay: 0,
        };

        menuCloseTween: gsap.TweenVars = {
          width: 0,
        };

        buttonOpenTween: gsap.TweenVars = { y: 50, opacity: 0 };
        buttonCloseTween: gsap.TweenVars = { y: 0, opacity: 1 };

        menuNavigationButtons = [
          mothersMenuRef,
          littersMenuRef,
          backToMainMenuRef,
        ];

        menuHeight = Number.parseFloat(navCSS["menuHeight"]);

        // Tweens {
        tweenMenuButton(tween: gsap.TweenVars, toOrFrom: "to" | "from" = "to") {
          return gsap[toOrFrom](`#${navCSS["title-menu-button"]}`, tween);
        }

        tweenMenu(tween: gsap.TweenVars, toOrFrom: "to" | "from" = "to") {
          return gsap[toOrFrom](`.${navCSS["menu"]}`, tween);
        }

        tweenNav(tween: gsap.TweenVars, toOrFrom: "to" | "from" = "to") {
          return gsap[toOrFrom](`.${navCSS["nav"]}`, tween);
        }

        async menuOpen() {
          if (this.menuState !== MENU_STATES["closed"]) return;
          this.menuStateSetter(MENU_STATES["superPositioned"]);
          menuRef.current!.style.display = "flex";
          menuRef.current!.style.overflow = "hidden";

          this.tweenMenuButton(this.buttonOpenTween).then(
            () => (buttonRef.current!.style.display = "none")
          );
          this.tweenNav({
            width: "100%",
          }).then(() => (menuRef.current!.style.overflow = ""));

          this.menuStateSetter(MENU_STATES["open"]);
          this.addListeners();
          await this.tweenMenu(this.menuOpenTween);
        }

        async menuClose() {
          if (this.menuState !== MENU_STATES["open"]) return;
          this.removeListeners();
          this.menuStateSetter(MENU_STATES["superPositioned"]);
          menuRef.current!.style.overflow = "hidden";
          buttonRef.current!.style.display = "block";

          this.tweenMenuButton(this.buttonCloseTween);
          await this.tweenNav({
            width: 0,
          }).then(() => (menuRef.current!.style.display = "none"));

          menuRef.current!.style.overflow = "";
          this.menuStateSetter(MENU_STATES["closed"]);
          this.subMenuStateSetter(SUBMENU_STATES["Initial"]);
        }

        async positionMenuForScreenSize(height: number) {
          if (window.innerWidth >= Number.parseFloat(navCSS["LgPhoneViewport"]))
            await this.tweenNav({
              top: 0,
              height,
              duration: navCSS["transitionLong"],
            });
          await this.tweenNav({
            bottom: 0,
            height,
            duration: navCSS["transitionShort"],
          });
        }
        // }

        exitEventHandler() {
          this.menuClose();
        }
        mouseExitEventHandlerFunc(/*e: MouseEvent*/) {
          this.menuClose();
        }
        keyboardExitEventHandlerFunc(e: KeyboardEvent) {
          if (
            (e.key === "Escape" || e.key === "Backspace") &&
            this.menuState === "open"
          )
            this.menuClose();
          else if (
            (e.key === "Enter" || e.key === "Space") &&
            this.menuState === "closed"
          )
            this.menuOpen();
          else return false;
        }
        scrollExitEventHandlerFunc(/*e: Event*/) {
          this.menuClose();
        }

        /**
         * This handler is intentionally leaving the submenu items alone.
         * This provides a better UX since users in a specific submenu are
         * likely to want to view multiple items in that category without needing
         * to click through to it each time.
         **/
        mouseMenuEventHandlerFunc(
          e: React.MouseEvent<HTMLElement, MouseEvent>
        ) {
          if (
            ((e.target as HTMLElement).classList.contains(
              navCSS["menu-item"]
            ) ||
              (e.target as HTMLElement).classList.contains(
                navCSS["submenu-item"]
              )) &&
            !this.menuNavigationButtons.some(
              (button) => e.target === button.current
            )
          )
            this.menuClose();
        }

        removeListeners() {
          this.exit.current!.removeEventListener(
            "click",
            this.exitEventHandler.bind(this)
          );
          window.removeEventListener("keyup", this.exitEventHandler.bind(this));
          window.removeEventListener(
            "scroll",
            this.exitEventHandler.bind(this)
          );
        }
        addListeners() {
          this.exit.current!.addEventListener(
            "click",
            this.mouseExitEventHandlerFunc.bind(this),
            {
              once: true,
              passive: true,
            }
          );
          window.addEventListener(
            "keyup",
            this.keyboardExitEventHandlerFunc.bind(this),
            {
              passive: true,
            }
          );
          window.addEventListener(
            "scroll",
            this.scrollExitEventHandlerFunc.bind(this),
            {
              once: true,
              passive: true,
            }
          );
        }

        subMenuStateSetter(subMenuState: SubMenuStateTypes) {
          this.subMenuState = subMenuState;
          this.setSubMenuState(this.subMenuState);
        }

        menuStateSetter(menuState: MenuStateTypes) {
          this.menuState = menuState;
          this.setMenuState(this.menuState);
        }
        async toggleMenu(menuState: MenuStateTypes) {
          if (!buttonRef.current) throw new Error("Button not found.");

          if (menuState === MENU_STATES["open"]) {
            await this.menuClose();
          } else if (menuState === MENU_STATES["closed"]) {
            await this.menuOpen();
          }
        }
      },
    []
  ); /** END MENUANIMATION CLASS*/

  const M = useMemo(
    () =>
      new MenuAnimation(
        setMenuState,
        menuState,
        subMenuState,
        setSubMenuState,
        exitRef
      ),
    [
      MenuAnimation,
      setMenuState,
      menuState,
      subMenuState,
      setSubMenuState,
      exitRef,
    ]
  );

  const buttonEventHandler = async (
    menuState: MenuStateTypes
  ) => {
    await M.toggleMenu(menuState);
  };

  return (
    <nav className={navCSS["nav"]} ref={navRef}>
      <button
        onClick={() => buttonEventHandler(menuState)}
        id={navCSS["title-menu-button"]}
        ref={buttonRef}
        tabIndex={0}
      >
        Menu
      </button>
      <menu
        className={navCSS["menu"]}
        onClick={(e) => {
          M.mouseMenuEventHandlerFunc(e);
        }}
        ref={menuRef}
      >
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
          if (subMenuState === SUBMENU_STATES["Mothers"])
            return (
              <div
                className={`${navCSS["submenu"]} ${navCSS["mothers-submenu"]}`}
              >
                <button
                  className={`${navCSS["menu-item"]} ${navCSS["back"]}`}
                  ref={backToMainMenuRef}
                  onClick={() => setSubMenuState(SUBMENU_STATES["Initial"])}
                >
                  &lt; Back
                </button>
                {menuData[SUBMENU_STATES["Mothers"]]}
              </div>
            );
          if (subMenuState === SUBMENU_STATES["Initial"])
            return (
              <button
                className={`${navCSS["menu-item"]}`}
                onClick={() => setSubMenuState(SUBMENU_STATES["Mothers"])}
                ref={mothersMenuRef}
              >
                Mothers
              </button>
            );
        })()}
        {(() => {
          if (subMenuState === SUBMENU_STATES["Litters"])
            return (
              <div
                className={`${navCSS["submenu"]} ${navCSS["litters-submenu"]}`}
              >
                <button
                  className={`${navCSS["menu-item"]} ${navCSS["back"]}`}
                  ref={backToMainMenuRef}
                  onClick={() => setSubMenuState(SUBMENU_STATES["Initial"])}
                >
                  &lt; Back
                </button>
                {menuData[SUBMENU_STATES["Litters"]]}
              </div>
            );
          if (subMenuState === SUBMENU_STATES["Initial"])
            return (
              <button
                className={navCSS["menu-item"]}
                onClick={() => setSubMenuState(SUBMENU_STATES["Litters"])}
                ref={littersMenuRef}
              >
                Recent Litters
              </button>
            );
        })()}
      </menu>
    </nav>
  );
}

export default NavMenu;
