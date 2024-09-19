export const runtime = "edge";
// Components
import Nav from "@/components/nav/nav";
import Image from "next/image";
import Link from "next/link";

// Static
import Logo from "@pub/images/cherry-lane-farm-logo--256px.png";

// Types
import { type Metadata } from "next";

// Styles
import "@styles/reset.scss";
import "@styles/global.scss";
import css from "@styles/root-layout.module.scss";
import Theme from "@styles/theme.module.scss";
import { font } from "@styles/font";

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

export default function CLFMain({
  children,
  _2wood,
  _3tan,
  modal,
}: {
  children: React.ReactNode;
  _2wood: React.ReactNode;
  _3tan: React.ReactNode;
  modal: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={font.className}>
        <header>
          <Link className={css["home-button"]} href="/">
            <Image
              src={Logo}
              placeholder="blur"
              alt="Cherry Lane Farm Doodles logo"
              width={250}
              height={250}
            />
          </Link>
        </header>
        <main>
          <Nav />
          {modal}
          <div className={css["white-layout"]}>
            <div className={css["left-flex"]} />
            <div className={css["content-box"]}>{children}</div>
            <div className={css["right-flex"]} />
          </div>
          <div className={`${css["wood-layout"]} ${Theme.woodgrain}`}>
            <div className={css["left-flex"]} />
            <div className={css["content-box"]}>{_2wood}</div>
            <div className={css["right-flex"]} />
          </div>
          <div className={css["tan-layout"]}>
            <div className={css["left-flex"]} />
            <div className={css["content-box"]}>{_3tan}</div>
            <div className={css["right-flex"]} />
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
