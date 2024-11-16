//CSS
import css from "@/styles/showcase.module.scss";
import { Fragment } from "react";

// This component requires a pseudo SQL database shaped Map that has the following constraints:
// I. An Object which contains Id's pointing to indexes. {["id"]: 0}
// II. An Array which contains objects holding:
//    1.) A unique id for each entry.
//    2.) A title for the image to be displayed.
//    3.) An Image array. [src, alt]
//    4.) A method for an onClick function --OR-- a link array. ["uri/index.html", "_blank"]
//    [{
//      //0
//      id: "id",
//      title: "Title",
//      onClick: undefined,
//      link: ["uri/index.html", "_blank"],
//      img: ["./img/image.png", "Example Alt Text."],
//    }]
interface ShowcaseDB<T = HTMLAnchorElement> {
  Data: {
    id: string;
    img: React.ReactNode;
    title?: string;
    onClick?: () => void;
    link?: [
      React.AnchorHTMLAttributes<T>["href"],
      React.AnchorHTMLAttributes<T>["target"]?
    ];
    className?: string;
  };
  Names: Record<string, number>;
  Map: Map<ShowcaseDB["Names"], ShowcaseDB["Data"][]>;
}

const hasLink = (s: ShowcaseDB["Data"]) => {
  if (!s.className) s.className = "";
  if (s.link)
    return (
      <a
        className={`${s.className}`}
        key={s.id}
        data-showcase-item-id={s.id}
        href={s.link[0]}
        target={s.link[1] ? s.link[1] : ""}
        rel={s.link[1] === "_blank" ? "noreferrer noopener" : undefined}
      >
        <div className={css["showcase-item"]}>
          {s.title ? <h3>{s.title}</h3> : ""}
          {s.img}
        </div>
      </a>
    );
  else if (s.onClick)
    return (
      <button
        className={s.className}
        key={s.id}
        data-showcase-item-id={s.id}
        onClick={s.onClick}
      >
        <div className={css["showcase-item"]}>
          {s.title ? <h3>{s.title}</h3> : ""}
          {s.img}
        </div>
      </button>
    );
  else
    return (
      <Fragment key={s.id}>
        {s.title ? <h3>{s.title}</h3> : ""}
        <div className={css["showcase-item"]}>
          {s.img}
        </div>
      </Fragment>
    );
};

const Showcase = ({ db }: { db: ShowcaseDB["Map"] }) => {
  //const showcaseNamesObj = db.keys().next().value;
  const showcaseDataArr: ShowcaseDB["Data"][] = db.values().next().value;

  return (
    <div key={"showcase" + Math.random()} className={css["showcase"]}>
      {showcaseDataArr.map((s, index) => {
        if (index === 0) {
          return (
            <>
              <div
                key={s.id + " showcase_currently-showcased"}
                className={css["currently-showcased"]}
              >
                {hasLink(s)}
              </div>
            </>
          );
        } else {
          return hasLink(s);
        }
      })}
    </div>
  );
};

export default Showcase;
