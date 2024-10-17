export const runtime = "edge";
//import omaPuppy from "@pub/images/omaPuppy.png";

// Components
//import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";

// Styles
//import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      {/**This is temopararily here until Jenny has something she wants to replace.*/}
      <div>
        <p>
          My husband and I have a love for animals, plants, and farm life.
          That&apos;s why we decided to start our hobby farm! We&apos;ve had many
          different kinds of animals on our farm over the years. It has been such
          a fun experience.
        </p>
        <p>
          My love for animals and my husbands dog breeding family planted the seed
          of dog breeding in our heads. After several years of researching
          genetics, canine DNA, puppy curriculums and dog training we decided to
          take the leap into breeding Goldendoodles. I am passionate about
          preparing our puppies to be great additions to their families. To do
          this, I begin working with the puppies at a young age teaching them to
          be obedient and to seek attention by behaving, not acting out. Other
          breeders who have gotten our puppies are amazed at the puppy&apos;s
          training and behavior. I remain a resource for any of our puppy families
          long after they leave our home.
        </p>
      </div>
      {/**This Div Keeps the header, image and text together in the layout.*/}
      {/*      <div>
        <h1>What is Puppy Culture?</h1>
        <AttentionGetterImage
          imgSrc={omaPuppy}
          imgAlt="Jenny"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <p>
                Puppy Culture is a comprehensive socialization and training
                program designed to provide the optimal development environment
                of puppies and lasts for 12 weeks after birth. We want our
                puppies to grow up as confident, and happy dogs in their future
                homes. Cherry Lane Farm Puppies are shown a lot of love from
                birth.
              </p>
              <p>
                Puppy culture includes a series of protocols and practices aimed
                to promote well-adjusted, confident, and healthy puppies. Things
                like, problem prevention, early neurological stimulation, and
                basic training are all covered in the Puppy Culture Program.
              </p>
              <p>
                Our puppies are available to go home with their new families at
                8 weeks old. So, we will cover the first two thirds of the Puppy
                Culture Program before they leave us. This is a great start for
                your new puppy. But, we reccomend that you continue the program
                at home. If you are interested in keeping up with the Puppy
                Culture Program after your puppy goes home, reach out to me and
                I can help you get started.
              </p>
            </>
          }
        />
      </div>*/}
    </>
  );
}
