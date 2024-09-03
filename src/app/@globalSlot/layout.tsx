export const runtime = "edge";
import "@styles/root-layout.scss";
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
      <div className="white-layout">
        <div className="left-flex" />
        <div className="content-box">{_1white}</div>
        <div className="right-flex" />
      </div>
      <div className={`wood-layout ${Theme.woodgrain}`}>
        <div className="left-flex" />
        <div className="content-box">{_2wood}</div>
        <div className="right-flex" />
      </div>
      <div className="tan-layout">
        <div className="left-flex" />
        <div className="content-box">{_3tan}</div>
        <div className="right-flex" />
      </div>
    </>
  );
}
