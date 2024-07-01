import { WhiteWoodTanLayout } from "@/types";

export default function WhiteWoodTanStyler(
  WhiteLayout: WhiteWoodTanLayout[0],
  WoodLayout: WhiteWoodTanLayout[1],
  TanLayout: WhiteWoodTanLayout[2]
): React.JSX.Element[] {
  const sections = [];
  if (WhiteLayout()) {
    sections.push(
      <div key="white-layout" className="white-layout">
        <div key="tahoiaoeunatoheuaoeuaoei" className="left-flex" />
        <div key="thaeiuoieaoeiL " className="content-box">
          <WhiteLayout />
        </div>
        <div className="right-flex" />
      </div>
    );
  }

  if (WoodLayout()) {
    sections.push(
      <div
        key="wood-layout"
        style={{ backgroundImage: "url('images/woodgrain.svg')" }}
        className="wood-layout"
      >
        <div className="left-flex" />
        <div className="content-box">
          <WoodLayout />
        </div>
        <div className="right-flex" />
      </div>
    );
  }
  if (TanLayout()) {
    sections.push(
      <div key="tan-layout" className="tan-layout">
        <div className="left-flex" />
        <div className="content-box">
          <TanLayout />
        </div>
        <div className="right-flex" />
      </div>
    );
  }
  return sections;
}
