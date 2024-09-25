export const runtime = "edge";
import JennyMatt from "@pub/images/Jenny_Matthew.jpeg";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";

// Styles
import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <h1>About Cherry Lane Farms</h1>
      <AttentionGetterImage
        imgSrc={JennyMatt}
        imgAlt="Jenny"
        imgLink="/about"
        className={css["attention-getter-image"]}
        sideText_classPrefix="sideText"
        sideText={
          <>
            <p>
              My husband and I have a love for animals, plants, and farm life.
              That&apos;s why we decided to start our hobby farm! We&apos;ve had
              many different kinds of animals on our farm over the years. It has
              been such a fun experience.
            </p>
            <p>
              My love for animals and my husbands dog breeding family planted
              the seed of dog breeding in our heads. After several years of
              researching genetics, canine DNA, puppy curriculums and dog
              training we decided to take the leap into breeding Goldendoodles.
              I am passionate about preparing our puppies to be great additions
              to their families. To do this, I begin working with the puppies at
              a young age teaching them to be obedient and to seek attention by
              behaving, not acting out. Other breeders who have gotten our
              puppies are amazed at the puppy&apos;s training and behavior. I
              remain a resource for any of our puppy families long after they
              leave our home.
            </p>
          </>
        }
      />
    </>
  );
}
