// Types
import Head from "next/head";
import { type Metadata } from "next"; // {
import { type AppProps } from "next/app"; // }
// Styles
import "@/styles/reset.scss";
import "@/pages/global.scss";
import { font } from "@/styles/font";
// Components

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description: `Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.`,
};

export const sections = ["white", "wood", "tan"] as const;

export default function CLFMain({ Component, pageProps }: AppProps): React.JSX.Element {
  return (
    <>
      <Head>
          <title>Welcome to Cherry Lane Farms</title>
      </Head>
      <main className={font.className}>
          <Component {...pageProps} />
      </main>
      <footer>
        <p className={font.className}>&copy; {new Date().getFullYear()} Cherry Lane Farm Doodles</p>
      </footer>
    </>
  );
}
