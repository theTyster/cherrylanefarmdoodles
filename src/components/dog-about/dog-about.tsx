import { calcAge, normalizeEpochDate } from "thetyster-utils";
import { MorF } from "cherrylanefarms-utils";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import CLFImage from "@/components/CLFImage/CLFImage";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";

// Css
import css from "@/styles/dog-about.module.scss";

// Types
import type * as DogAboutTypes from "@/types/dog-about";

// Local Constants
/**All possible variants for this component.*/
const V = {
  adult: "adult",
  puppy: "puppy",
} as const;

// Local Types
type V = typeof V;

type Variant = (typeof V)[keyof typeof V];

type VariantTypes = {
  adult: DogAboutTypes.AdultData;
  puppy: DogAboutTypes.PuppyData;
};

export default async function DogAbout({
  variant,
  variantData,
}: {
  variant: Variant;
  variantData: DogAboutTypes.AdultData | DogAboutTypes.PuppyData;
}) {

  /**
   * Ultimately determines which variant's data will be used for this
   * component.
   **/
  async function possibleVariants<PV extends Variant>(
    variantPossibility: PV
  ): Promise<VariantTypes[PV]> {
    switch (variantPossibility) {
      case V.adult:
        return variantData as VariantTypes[typeof V.adult] as PV extends typeof V.adult
          ? VariantTypes[PV]
          : never;
      case V.puppy:
        return variantData as VariantTypes[typeof V.puppy] as PV extends typeof V.puppy
          ? VariantTypes[PV]
          : never;
      default:
        throw new Error("Invalid variant provided: " + variantPossibility);
    }
  }

  // Seperating out the call from the generics function so I don't have to
  // write 'await' everywhere.
  // This also makes it a bit easier to ensure that data isn't fetched multiple times.
  const componentData = await possibleVariants(variant);
  const D = function <PV extends Variant>(): VariantTypes[PV] {
    return componentData as VariantTypes[PV];
  };

  if (variant === V.adult) {
    const partnerMorf = MorF(D<V["adult"]>().partnerData[G.gender]);
    return (
      <>
        <div className={css.dogTitle}>
          <h1 className={css.dogName}>
            Meet {D<V["adult"]>().dogData[G.adultName]}
          </h1>
          <hr />
          <h2 className={css.breeder}>
            <BreederLine breeder={D<V["adult"]>().dogData[G.breeder]} />
          </h2>
        </div>
        <article className={css.mainDog}>
          <div className={css.attentionGetter}>
            <LargeHeadshot
              variant={G.Headshots_Lg}
              id={css.Headshots_Lg}
              src={D<V["adult"]>().dogData[G.Headshots_Lg]}
              alt={D<V["adult"]>().dogData[G.adultName]}
              gender={D<V["adult"]>().dogData[G.gender]}
            />
            {
              //prettier-ignore
              <ul className={css.dogInfoList}>
            <li className={css.adultBirthday}>                <b>Age:</b> {calcAge(D<V['adult']>().dogData[G.adultBirthday].toString())} years old         </li>
            <li className={css.applicantsInQueue}> <b>Puppies Available:</b> {D<V['adult']>().litterData[G.availablePuppies]}/{D().litterData[G.totalPuppies]}</li>
            <li className={css.favActivities}><b>Favorite Activities:</b> {D<V['adult']>().dogData[G.favActivities]}                                            </li>
            <li className={css.weight}>                    <b>Weight:</b> {D<V['adult']>().dogData[G.weight]}                                                   </li>
            <li className={css.energyLevel}>         <b>Energy Level:</b> {D<V['adult']>().dogData[G.energyLevel]}                                              </li>
            <li className={css.noseColor}>             <b>Nose Color:</b> {D<V['adult']>().dogData[G.noseColor]}                                                </li>
            <li className={css.eyeColor}>               <b>Eye Color:</b> {D<V['adult']>().dogData[G.eyeColor]}                                                 </li>
            <li className={css[G.coat]}>             <b>Coat Color:</b> {D<V['adult']>().dogData[G.coat]}                                                </li>
            <li className={css.personality}>          <b>Personality:</b> {D<V['adult']>().dogData[G.personality]}                                              </li>
          </ul>
            }
          </div>
          <div className={css.partnerData}>
            <div className={css.partnerVisuals}>
              <h3 className={css.partnerName}>
                {D<V["adult"]>().litterData[G.litterBirthday]
                  ? `Previously matched with ${
                      D<V["adult"]>().partnerData[G.adultName]
                    }.`
                  : `Currently matched with ${
                      D<V["adult"]>().partnerData[G.adultName]
                    }.`}
              </h3>
              <h4 className={css.partnerLastLitter}>
                {D<V["adult"]>().litterData[G.litterBirthday]
                  ? `Last litter born on ${normalizeEpochDate(
                      D<V["adult"]>().litterData[
                        G.litterBirthday
                      ]!.toLocaleDateString()
                    ).replace(/.at.*/, "")}`
                  : `Next litter due on ${normalizeEpochDate(
                      D<V["adult"]>().litterData[G.dueDate].toLocaleDateString()
                    ).replace(/.at.*/, "")}`}
                {D<V["adult"]>()
                  .litterData[G.dueDate].toISOString()
                  .split("T")[0] === new Date().toISOString().split("T")[0]
                  ? `...That's today!!`
                  : undefined}
              </h4>
              <CLFImage
                id={css[D1T.Group_Photos]}
                src={D<V["adult"]>().ids[D1T.Group_Photos]}
                alt={`${D<V["adult"]>().dogData[G.adultName]} and ${
                  D<V["adult"]>().partnerData[G.adultName]
                }'s last litter.'`}
                width={600}
                height={400}
              />
            </div>
            <div className={css.partnerPhoto}>
              <Link
                href={`/${partnerMorf("sires", "dams")}/${
                  D<V["adult"]>().ids[partnerMorf("father", "mother")]
                }`}
              >
                <SmallHeadshot
                  variant={D1T.Headshots_Sm}
                  gender={D<V["adult"]>().partnerData[G.gender]}
                  src={D<V["adult"]>().partnerData[G.Headshots_Sm]}
                  alt={D<V["adult"]>().partnerData[G.adultName]}
                  id={css.Headshots_Sm}
                />
              </Link>
              <h4 className={css.partnerBreeder}>
                <BreederLine breeder={D<V["adult"]>().partnerData[G.breeder]} />
              </h4>
            </div>
          </div>
        </article>
      </>
    );
  }
  if (variant === V.puppy) {
    return (
      <>
        <div className={css.dogTitle}>
          <h1 className={css.dogName}>
            Meet {D<V["puppy"]>().dogData[G.puppyName]}
          </h1>
          <hr />
          <h2 className={css.breeder}>
            <BreederLine breeder="Cherry Lane Farms" />
          </h2>
        </div>
        <article className={css.mainDog}>
          <div className={css.attentionGetter}>
            <LargeHeadshot
              variant={G.Headshots_Lg}
              id={css.Headshots_Lg}
              src={D<V["puppy"]>().dogData[G.Headshots_Lg]}
              alt={
                D<V["puppy"]>().dogData[G.puppyName]
                  ? D<V["puppy"]>().dogData[G.puppyName]!
                  : "Goldendoodle Puppy"
              }
              gender={D<V["puppy"]>().dogData[G.gender]}
            />
            {
              //prettier-ignore
              <ul className={css.dogInfoList}>
          {D<V['puppy']>().litterData[G.litterBirthday] ? 
            <li className={css.adultBirthday}>                <b>Age:</b> {calcAge(D<V['puppy']>().litterData[G.litterBirthday]!.toString())} years old         </li>
            : undefined}
            <li className={css.applicantsInQueue}> <b>Puppies Available:</b> {D<V['puppy']>().litterData[G.availablePuppies]}/{D().litterData[G.totalPuppies]}</li>
            <li className={css.noseColor}>             <b>Nose Color:</b> {D<V['puppy']>().dogData[G.noseColor]}                                                </li>
            <li className={css[G.coat]}>             <b>Coat Color:</b> {D<V['puppy']>().dogData[G.coat]}                                                </li>
            <li className={css.personality}>          <b>Personality:</b> {D<V['puppy']>().dogData[G.personality]}                                              </li>
          </ul>
            }
          </div>
          <div className={css.partnerData}>
            <div className={css.partnerVisuals}>
              <h3 className={css.mother}>
                {D<V["puppy"]>().litterData[G.litterBirthday]
                  ? `Previously matched with ${"--mother goes here--"}.`
                  : `Currently matched with ${"--mother goes here--"}.`}
              </h3>
              <h4 className={css.partnerLastLitter}>
                {D<V["puppy"]>().litterData[G.litterBirthday]
                  ? `Last litter born on ${normalizeEpochDate(
                      D<V["puppy"]>().litterData[
                        G.litterBirthday
                      ]!.toLocaleDateString()
                    ).replace(/.at.*/, "")}`
                  : `Next litter due on ${normalizeEpochDate(
                      D<V["puppy"]>().litterData[G.dueDate].toLocaleDateString()
                    ).replace(/.at.*/, "")}`}
                {D<V["puppy"]>()
                  .litterData[G.dueDate].toISOString()
                  .split("T")[0] === new Date().toISOString().split("T")[0]
                  ? `...That's today!!`
                  : undefined}
              </h4>
              <CLFImage
                id={css[D1T.Group_Photos]}
                src={D<V["puppy"]>().ids[D1T.Group_Photos]}
                alt={`${
                  D<V["puppy"]>().dogData[G.puppyName]
                } and ${"--mother name here--"}'s last litter.'`}
                width={600}
                height={400}
              />
            </div>
            <div className={css.partnerPhoto}>
              <Link href={`/sires/${"--father id here--"}`}></Link>
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={D<V["puppy"]>().dogData[G.gender]}
                src={D<V["puppy"]>().dogData[G.Headshots_Sm]}
                alt={
                  D<V["puppy"]>().dogData[G.puppyName]
                    ? D<V["puppy"]>().dogData[G.puppyName]!
                    : "Goldendoodle Puppy"
                }
                id={css.Headshots_Sm}
              />
              <h4 className={css.partnerBreeder}>
                <BreederLine breeder="Cherry Lane Farms" />
              </h4>
            </div>
          </div>
        </article>
      </>
    );
  }
}
