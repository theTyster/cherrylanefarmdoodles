// Types
import { type Metadata } from "next";
// Styles
import "@/styles/reset.scss";
import "@/styles/global.scss";
import { font } from "@/styles/font";

export const metadata: Metadata = {
  title: {
    default: "Cherry Lane Farms | Temperament focused dog breeder",
    template: "%s | Cherry Lane Farm Doodles",
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
  authors: [
    { name: "Jenny Moffit" },
  ],
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
        <main>
          <div className="white-layout">
            <div className="left-flex" />
            <div className="content-box">{children}</div>
            <div className="right-flex" />
          </div>
          <div
            style={{ backgroundImage: "url('images/woodgrain.svg')" }}
            className="wood-background wood-layout"
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
