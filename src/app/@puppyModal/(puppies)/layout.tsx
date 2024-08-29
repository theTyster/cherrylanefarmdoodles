export const runtime = "edge";
import "./layout.scss";
export default async function LitterPuppyModalLayout({
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
