import type { Metadata } from "next"; // {
import styles from "@/styles/layout.module.scss";
import { font } from "@/styles/global";
//import { WhiteLayout, WoodLayout, TanLayout } from "@/pages/layout";
import { AppProps } from "next/app"; // }

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description: `Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.`,
};

const sections = ["white", "wood", "tan"];

export default function CLFMain({ Component }: AppProps) {

  return (
    <>
      <main>
        <section className={`${styles["white-layout"]} ${font.className}`}>
          <Component section={sections[0]} />
        </section>
        <section className={`${styles["wood-layout"]} ${font.className}`}>
          <Component section={sections[1]} />
        </section>
        <section className={`${styles["tan-layout"]} ${font.className}`}>
          <Component section={sections[2]} />
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Cherry Lane Farm Doodles</p>
      </footer>
    </>
  );
}
