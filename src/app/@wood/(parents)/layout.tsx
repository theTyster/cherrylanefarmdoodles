export const runtime = "edge";
import css from "./layout.module.scss";

export default async function WoodSectionParentsLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element | null> {
  return (
    <>
      <h2>Current Litter</h2>
      <div className={css.currentLitter}>{children}</div>
    </>
  );
}
