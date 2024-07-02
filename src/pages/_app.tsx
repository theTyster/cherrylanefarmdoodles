// Next
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import gsap from "gsap";
// Types
import { type Metadata } from "next"; // {
import { type AppProps } from "next/app"; // }
// Styles
import "@/styles/reset.scss";
import "@/pages/global.scss";
import { font } from "@/styles/font";
// Components
import SVGHamburger from "@/components/hamburger.svg";

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description: `Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.`,
};

export const sections = ["white", "wood", "tan"] as const;

export default function CLFMain({
  Component,
  pageProps,
}: AppProps): React.JSX.Element {
  const menuDim = 62;
  return (
    <>
      <Head>
        <title>Welcome to Cherry Lane Farms</title>
      </Head>
      <main className={font.className}>
        <nav>
          <button id={"title-menu-button"}>
            <SVGHamburger dim={menuDim} />
          </button>
          <menu>
            <Link href="/">This is a test</Link>
            <Link href="/">This is a test</Link>
            <Link href="/">This is a test</Link>
          </menu>
          <Link className="home-button" href="/">
            <h1 className="site-name">Cherry Lane Farm</h1>
            <img className="logo" src="images/paw.svg" width={menuDim} alt="" />
            <h1 className="site-name">Doodles</h1>
          </Link>
        </nav>
        <Component {...pageProps} />
      </main>
      <footer>
        <p className={font.className}>
          &copy; {new Date().getFullYear()} Cherry Lane Farm Doodles
        </p>
      </footer>
      <Script
        id="gsap"
        src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
        strategy="lazyOnload"
        onReady={() => {
          const hamTlOpen = gsap.timeline({
            //defaults: { ease: "elastic.inOut(1, .3)" },
          });
          hamTlOpen
            .to("#ham-top", { y: 40, ease: "back.out" })
            .to("#ham-mid", { y: 20, ease: "back.out" }, "<")
            .to("#ham-top, #ham-bot", { x: "+=3",y: "-=20", fill: "#FFC9D8", transformOrigin: "left", rotation: -20 })
            .to("#ham-mid", { x: "+=2.5", y: "-=22.5", fill: "#FFC9D8", transformOrigin: "left", rotation: 20 }, "<")
            .reverse();

          hamTlOpen.totalDuration(.6);
          let menuIsOpen = false;
          const menuButton = document
            .getElementById("title-menu-button") as HTMLButtonElement;

            menuButton.addEventListener("click", () => {
              menuIsOpen ? (menuIsOpen = false) : (menuIsOpen = true);
              hamTlOpen.reversed(!hamTlOpen.reversed());
            })
        }}
      />
    </>
  );
}
