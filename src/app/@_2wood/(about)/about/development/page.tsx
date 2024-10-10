export const runtime = "edge";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";
import CLFImage from "@/components/CLFImage/CLFImage";

// Styles
import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <div>
        <h1>Talk is cheap, show me the code</h1>

        <AttentionGetterImage
          node={
            <>
              <CLFImage
                src="https://portfolio.thetyster.dev/static/img/github-mark.svg"
                alt="Gihub Logo"
                className={css["image_gh"]}
                width={450}
                height={450}
              />
            </>
          }
          imgAlt="Github Logo"
          imgLink="https://github.com/theTyster/cherrylanefarmdoodles"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <p className={
                css['side-text']
                }>
                This website is open source. You can view the code{" "}
                <a className={css['gh-link']}href="https://github.com/theTyster/cherrylanefarmdoodles">
                  on github
                </a>
                .
              </p>
            </>
          }
        />
      </div>
    </>
  );
}
