export const runtime = "edge";
import Ty from "@pub/images/Ty.jpg";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";

// Styles
import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <div>
        <h1>Meet the Developer</h1>
        <AttentionGetterImage
          imgSrc={Ty}
          imgAlt="Ty"
          imgLink="https://portfolio.thetyster.dev/my-work/cherry-lane-farms/"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <div className={css["side-text"]}>
                <p>
                  Ty is a software developer with a passion for fast, lean, and
                  honest code. He built this website completely from scratch using
                  Next.js, React, Typescript, SCSS, and a myriad of serverless
                  technologies offered by Cloudflare.
                </p>
                <p>
                  The most amazing thing about this site is how fast it is.
                  Not only that, but all of the features you see here were completely free
                  to utilize.
                </p>
                <p>
                  If you want to learn more about how Ty made this site, take a
                  look at his portfolio{" "}
                  <a className={css['portfolio-link']} href="https://portfolio.thetyster.dev/my-work/cherry-lane-farms/">
                    here
                  </a>
                  .
                </p>
              </div>
            </>
          }
        />
      </div>
    </>
  );
}
