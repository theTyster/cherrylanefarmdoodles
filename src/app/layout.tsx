export const runtime = "edge";
// Components
import Image from "next/image";
import Link from "next/link";
import MainLayouts from "@/components/main-layouts/main-layouts";

// Static
import Logo from "@pub/images/cherry-lane-farm-logo--256px.png";

// Types
import { type Metadata } from "next";

// Styles
import "@styles/reset.scss";
import "@styles/global.scss";
import css from "@styles/root-layout.module.scss";
import { font } from "@styles/font";

// Utilities
import { getRequestContext } from "@cloudflare/next-on-pages";
import NavMenuData from "@/constants/nav";

export const metadata: Metadata = {
  title: {
    default: "Cherry Lane Farm | Temperament Focused Dog Breeding",
    template: "%s | Cherry Lane Farm",
  },
  description: `Cherry Lane Farms focuses on temperament, health, and socialization to provide the best possible pet for your family. Located in Murfreesboro TN.`,
  metadataBase: new URL("https://cherrylanefarmdoodles.com"),
  generator: "Next.js",
  applicationName: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "pets",
  keywords: [
    "dog breeder",
    "temperament",
    "Goldendoodles",
    "puppies",
    "Murfreesboro TN",
  ],
  authors: [{ name: "Jenny Moffit" }],
  creator: "Tyler Davis",
  publisher: "Cherry Lane Farms",
  alternates: {
    canonical: "https://cherrylanefarmdoodles.com",
  },
  //TODO:
  //verification: {
  //  google: 'google',
  //  yandex: 'yandex',
  //  yahoo: 'yahoo',
  //  other: {
  //    me: ['my-email', 'my-link'],
  //  },
  //},
  //}
  // CONFIGURED BY NEXT.JS BY DEFAULT
  //  openGraph: {
  //    images: ['./opengraph-image.png',]
  //  },
  //  twitter: {
  //    images: ['./twitter-image.png',]
  //  }
};

export default async function CLFMain({
  children,
  _2wood,
  _3tan,
  modal,
}: {
  children: React.ReactNode;
  _2wood: React.ReactNode;
  _3tan: React.ReactNode;
  modal: React.ReactNode;
}): Promise<React.JSX.Element> {
  const D1 = getRequestContext().env.dogsDB;
  const menuData = await new NavMenuData(D1).getData();
  return (
    <html lang="en">
      <body 
        className={font.className}>
        <header>
          <Link className={css["home-button"]} href="/">
            <Image
              className={css["logo"]}
              src={Logo}
              placeholder="blur"
              alt="Cherry Lane Farm Doodles logo"
              width={250}
              height={250}
              priority
            />
          </Link>
        </header>
        <main>
          <MainLayouts
            modal={modal}
            _2wood={_2wood}
            _3tan={_3tan}
            css={css}
            menuData={menuData}
          >
          {children}
          </MainLayouts>
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
