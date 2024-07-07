// Types
import Head from "next/head";
import { type Metadata } from "next"; // {
// Styles
import "@/styles/reset.scss";
import "@/styles/global.scss";
import { font } from "@/styles/font";

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description: `Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.`,
  alternates: {
    canonical: "/",
  },
// CONFIGURED BY NEXT.JS BY DEFAULT
//  openGraph: {
//    images: ['./opengraph-image.png',]
//  },
//  twitter: {
//    images: ['./twitter-image.png',]
//  }
};

export default function CLFMain({
  children,
  wood,
  tan,
}: {
  children: React.ReactNode;
  wood: React.ReactNode;
  tan: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={font.className}>
        <Head>
          <title>Welcome to Cherry Lane Farms</title>
        </Head>
        <main>
          <div className="white-layout">
            <div className="left-flex" />
            <div className="content-box">{children}</div>
            <div className="right-flex" />
          </div>
          <div
            style={{ backgroundImage: "url('images/woodgrain.svg')" }}
            className="wood-layout"
          >
            <div className="left-flex" />
            <div className="content-box">{wood}</div>
            <div className="right-flex" />
          </div>
          <div className="tan-layout">
            <div className="left-flex" />
            <div className="content-box">{tan}</div>
            <div className="right-flex" />
          </div>
        </main>
        <footer>
          <p style={{ margin: "unset" }}>
            &copy; {new Date().getFullYear()} Cherry Lane Farm Doodles
          </p>
        </footer>
      </body>
    </html>
  );
}
