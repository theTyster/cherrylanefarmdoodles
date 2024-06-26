import { type Metadata } from "next"; // {
import { font } from "@/styles/global";
import Theme from "@/styles/theme";
import { type AppProps } from "next/app"; // }

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description: `Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.`,
};

export const sections = ["white", "wood", "tan"] as const;

export default function CLFMain({ Component }: AppProps): React.JSX.Element {
  return (
    <>
      <main className={font.className}>
        <section>
          <style jsx>{`
            section {
              background-color: white;
            }
          `}</style>
          <Component section={sections[0]} />
        </section>
        <section>
          <style jsx>{`
            section {
              background: url("woodgrain.svg");
              background-color: ${Theme.colors.darkPrimary};
            }
          `}</style>
          <Component section={sections[1]} />
        </section>
        <section>
          <style jsx>{`
            section {
              background-color: ${Theme.colors.lightPrimary};
            }
          `}</style>
          <Component section={sections[2]} />
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Cherry Lane Farm Doodles</p>
      </footer>
    </>
  );
}
