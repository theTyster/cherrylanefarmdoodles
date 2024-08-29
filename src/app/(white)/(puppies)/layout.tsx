export const runtime = "edge";
import "./layout.scss";

export default async function WhiteSectionPuppyLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element | null> {
  return (
    <>
      {children}
    </>
  );
}
