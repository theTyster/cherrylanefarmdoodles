export const runtime = "edge";
import css from "./layout.module.scss";

export default async function WhiteSectionParentsLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element | null> {
  return (
    <div className={css.currentLitter}>
      {children}
    </div>
  );
}
