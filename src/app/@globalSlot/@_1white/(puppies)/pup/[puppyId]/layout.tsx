export const runtime = "edge";
import "./layout.scss";

export default function WhiteSectionPuppyLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      {children}
    </>
  );
}
