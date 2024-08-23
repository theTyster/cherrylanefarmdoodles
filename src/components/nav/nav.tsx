"use client";
// Components
import Link from "next/link";
//import SVGHamburger from "@/components/svg/hamburger.svg";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

// Static
import Logo from "@pub/images/cherry-lane-farm-logo--256px.png";

// Styles
import navCSS from "@styles/nav.module.scss";
import Theme from "@styles/theme.module.scss";

export const runtime = "edge";

function Nav() {
  const navRef = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const hamTlOpen = gsap.timeline({
        //defaults: { ease: "elastic.inOut(1, .3)" },
      });
      hamTlOpen
        .to("#ham-top", { y: 40, ease: "back.inOut" })
        .to("#ham-mid", { y: 20, ease: "back.inOut" }, "<")
        .to("#ham-top, #ham-bot", {
          x: "+=3",
          y: "-=20",
          fill: Theme.lightTertiaryCherry,
          transformOrigin: "left",
          rotation: -20,
        })
        .to(
          "#ham-mid",
          {
            x: "+=2.5",
            y: "-=22.5",
            fill: Theme.lightTertiaryCherry,
            transformOrigin: "left",
            rotation: 20,
          },
          "<"
        )
        .reverse();

      hamTlOpen.totalDuration(0.6);
      let menuIsOpen = false;
      const menuButton =
        navRef.current?.querySelector<HTMLButtonElement>("title-menu-button");

      menuButton?.addEventListener("click", () => {
        alert("menuButton clicked");
        menuIsOpen ? (menuIsOpen = false) : (menuIsOpen = true);
        // Every time the button is clicked, an animation is played in reverse.
        hamTlOpen.reversed(!hamTlOpen.reversed());
      });
    },
    { scope: navRef }
  );
  return (
    <>
      <nav className={navCSS.sliderMenu} ref={navRef}>
          {/*          <button id={navCSS["title-menu-button"]} ref={hamTlTrigger}>
            <SVGHamburger dim={60} />
          </button>*/
        /*          <menu>
            <Link href="/">This is a test</Link>
            <Link href="/">This is a test</Link>
            <Link href="/">This is a test</Link>
          </menu>*/}
          <Link className={navCSS["home-button"]} href="/">
            {/*            <svg
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
