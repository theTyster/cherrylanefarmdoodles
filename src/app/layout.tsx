import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Cherry Lane Farm Doodles",
  description:
    "Cherry Lane Farm Doodles is a family-owned and operated business that breeds and raises Goldendoodles.",
};

function TopSection({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<section>{children}</section>);
}

function MiddleSection({ children }: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}

function BottomSection({ children }: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}

interface SectionedLayout {
  TopSection: typeof TopSection;
  Middle: typeof MiddleSection;
  Bottom: typeof BottomSection;
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Cherry Lane Farm Doodles</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy;  Cherry Lane Farm Doodles</p>
        </footer>
      </body>
    </html>
  );
}
