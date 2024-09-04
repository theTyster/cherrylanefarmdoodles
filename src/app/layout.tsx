export const runtime = "edge";
// Components
import Nav from "@/components/nav/nav";

// Types
import { type Metadata } from "next";

// Styles
import "@styles/reset.scss";
import "@styles/global.scss";
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
  globalSlot,
  modal
}: {
  children: React.ReactNode;
  globalSlot: React.ReactNode;
  modal: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={font.className}>
        <main>
          <Nav />
          {children}
          {modal}
          {globalSlot}
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
