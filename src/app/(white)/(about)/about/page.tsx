export const runtime = "edge";
import JennyMatt from "@pub/images/Jenny_Matthew.jpeg";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";

// Styles
import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <div>
        <h1>About Cherry Lane Farm Doodles</h1>
        <AttentionGetterImage
          imgSrc={JennyMatt}
          imgAlt="Jenny"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <p>
                In 2013, my husband and I purchased a small hobby farm in
                Murfreesboro, Tennessee. We immediately planted a large garden,
                an orchard, and began purchasing various animals. In the past
                decade we have had horses, cows, pigs, sheep, goats, cats, dogs,
                chickens, ducks, geese, turkeys, and honeybees!
              </p>
              <p>
                As my children started getting older and the demands on my time
                decreased, I began looking for a hobby. I followed my passion
                for animals, and it led me to dog breeding. I started
                researching and studying different dog breeds, training
                programs, and I discovered that I had a passion for the genetics
                underlying dog breeding, specifically Golden Doodles. My
                research taught me that to have a superior dog, you must have
                superior genetics and superior training.
              </p>
              <p>
                After a couple of years of in-depth research, I decided I was
                ready to take the plunge into the exciting world of Golden
                Doodles and <b>Cherry Lane Farm Doodles</b> was born!
              </p>
            </>
          }
        />
      </div>
    </>
  );
}
