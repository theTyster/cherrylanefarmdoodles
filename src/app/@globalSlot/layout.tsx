export const runtime = "edge";
import css from "@styles/root-layout.module.scss";
import Theme from "@styles/theme.module.scss";

export default function WhiteSectionPuppyLayout({
  children,
  _1white,
  _2wood,
  _3tan,
}: {
  children: React.ReactNode;
  _1white: React.ReactNode;
  _2wood: React.ReactNode;
  _3tan: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      {children}
      <div className={css["white-layout"]}>
        <div className={css["left-flex"]} />
        <div className={css["content-box"]}>{_1white}</div>
        <div className={css["right-flex"]} />
      </div>
      <div className={`${css['wood-layout']} ${Theme.woodgrain}`}>
        <div className={css["left-flex"]} />
        <div className={css["content-box"]}>{_2wood}</div>
        <div className={css["right-flex"]} />
      </div>
      <div className={css["tan-layout"]}>
        <div className={css["left-flex"]} />
        <div className={css["content-box"]}>{_3tan}</div>
        <div className={css["right-flex"]} />
      </div>
    </>
  );
}
