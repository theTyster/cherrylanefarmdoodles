export const runtime = "edge";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";
import DogCoatInfo from "@/components/dog-coat-info/dog-coat-info";
import Showcase from "@/components/showcase/showcase";
import CLFImage from "@/components/CLFImage/CLFImage";

// Static
import css from "./page.module.scss";
import PuppyPen from "@pub/images/puppy-pen.png";
import PuppyWagon from "@pub/images/puppy-wagon.png";
import PuppyBed from "@pub/images/puppy-bed.png";
import omaPuppy from "@pub/images/omaPuppy.png";
import JennyMatt from "@pub/images/Jenny_Matthew.jpeg";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <div className={css["about"]}>
        <h1>About Cherry Lane Farm Doodles</h1>
        <AttentionGetterImage
          imgSrc={JennyMatt}
          imgAlt="Jenny"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <p>
                In 2013, my husband and I purchased a small hobby farm in
                Murfreesboro, Tennessee. We immediately planted a large garden, an
                orchard, and began purchasing various animals. In the past decade
                we have had horses, cows, pigs, sheep, goats, cats, dogs,
                chickens, ducks, geese, turkeys, and honeybees!
              </p>
              <p>
                As my children started getting older and the demands on my time
                decreased, I began looking for a hobby. I followed my passion for
                animals, and it led me to dog breeding. I started researching and
                studying different dog breeds, training programs, and I discovered
                that I had a passion for the genetics underlying dog breeding,
                specifically Golden Doodles. My research taught me that to have a
                superior dog, you must have superior genetics and superior
                training.
              </p>
              <p>
                After a couple of years of in-depth research, I decided I was
                ready to take the plunge into the exciting world of Golden Doodles
                and <b>Cherry Lane Farm Doodles</b> was born!
              </p>
            </>
          }
        />
        <h1 id="goldendoodle-coat-types">Goldendoodle Coat Types</h1>
        <AttentionGetterImage
          imgSrc={omaPuppy}
          imgAlt="Jenny and Husband"
          className={css["attention-getter-image"]}
          sideText={
            <>
              <p>
                Here at <b>Cherry Lane Farm Doodles</b> each puppy is raised in my
                home, loved like a child, and constantly handled and socialized.
                Our breeding dogs live in my home, or in loving guardian homes.
                None of our dogs are raised in a kennel environment. Each puppy
                from <b>Cherry Lane Farm Doodles</b> is handled daily, taught a
                daily puppy curriculum (Puppy Culture), exposed to ESI (early
                scent introduction) and ENS (early neurological stimulation).
                Puppies are exposed to numerous sounds, textures/surfaces, people
                of all ages and other dogs in a way that creates a confident and
                well-rounded puppy. We give each puppy the best start in life that
                we possibly can.
              </p>
              <DogCoatInfo />
              <p>
                Here at <b>Cherry Lane Farm Doodles</b>, we breed
                multigenerational Goldendoodles. Goldendoodles have three
                different coat types: curly, wavy and straight. They each provide
                a different look and grooming commitment. A curly coat requires
                the most brushing and a straight coat the least. We provide a
                variety of different coat types and colors in each of our
                carefully chosen breeding pairs.
              </p>
            </>
          }
        />
        <h1 id="training">Training</h1>
        <Showcase
          db={
            new Map([
              [
                {
                  "puppy-bed": 0,
                  "puppy-wagon": 1,
                  "puppy-pen": 2,
                },
                [
                  {
                    id: "puppy-bed",
                    img: (
                      <CLFImage
                        src={PuppyBed}
                        alt="Puppy Helmet"
                        width={250}
                        height={250}
                        key="puppy-bed"
                      />
                    ),
                  },
                  {
                    id: "puppy-wagon",
                    img: (
                      <CLFImage
                        src={PuppyWagon}
                        alt="Puppies in a Line"
                        width={250}
                        height={250}
                        key="puppy-wagon"
                      />
                    ),
                  },
                  {
                    id: "puppy-pen",
                    img: (
                      <CLFImage
                        src={PuppyPen}
                        alt="Puppy Pen"
                        width={250}
                        height={250}
                        key="puppy-pen"
                      />
                    ),
                  },
                ],
              ],
            ])
          }
        />
        <p>
          At <b>Cherry Lane Farm Doodles</b> we believe that training your pet
          while it is still young ensures that your puppy will transition smoothly
          into its role as a new member of your family. I utilize the training
          program “Baxter and Bella” and highly recommend you continue it at your
          home. Well trained dogs are well-behaved dogs, and this leads to your
          dog becoming a happy addition to your family. We train the puppies to be
          calm and sit for attention (rather than jumping on you or your guests)
          through our training program, and I spend hours looking for the best
          genetics to provide a calm, well-behaved dog. It is important that you
          continue the puppy’s training at home to help them be the best puppy/dog
          they can be!
        </p>
        <h1 id="nutrition">Nutrition</h1>
        <p>
          The nutrition and health of all our dogs is of utmost importance. At{" "}
          <b>Cherry Lane Farm Doodles</b>, we feed a holistic dog food called
          Pawtree. PawTree does not have any fillers and focuses on high quality
          ingredients. I have witnessed a noticeable change in my dogs, from their
          coats to their overall health, since changing their food to Pawtree. It
          exceeded my expectations, and I highly recommend it!
        </p>
        <h1 id="lifetime-support">Lifetime Support</h1>
        <p>
          Once you have selected a puppy, I am available as a resource for any
          questions that arise. I enjoy getting calls, texts, and pictures from
          former clients showing me their fur babies. Numerous clients have told
          me that their puppy was the best dog they’ve ever gotten. References are
          available upon request.
        </p>
      </div>
    </>
  );
}
