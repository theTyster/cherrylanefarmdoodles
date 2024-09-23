export const runtime = "edge";
import css from "./parents.module.scss";

export default async function WoodSectionParentsLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element | null> {
  return (
    <>
      <div className={css.currentLitter}>{children}</div>
    </>
  );
}
