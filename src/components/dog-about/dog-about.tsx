import { getRequestContext } from "@cloudflare/next-on-pages";
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

// Constants
import {
  getParentData,
  getMostRecentFamily,
} from "@/components/dog-about/adult-constants";

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
  adultId,
  primaryParent,
  secondaryParent,
  pup,
}: {
  variant: Variant;
  adultId: number;
  /**
   * The dog whom this page is about.
   **/
  primaryParent: "mother" | "father";
  /**
   * The dog who has been partnered with the primary dog.
   **/
  secondaryParent?: "mother" | "father";
  /**The puppy whom this page is about.*/
  pup?: { puppyDogsTable: DogAboutTypes.D1DQ; puppy: DogAboutTypes.D1PQ };
}) {
  const D1 = getRequestContext().env.dogsDB;
  /**Applicable to both adult and puppy variants*/
  const mostRecentFamily = await getMostRecentFamily(
    D1,
    primaryParent,
    adultId
  );
  // Adults {
  async function connectAdultData(
    adultId?: number,
    primaryParent?: "mother" | "father",
    secondaryParent?: "mother" | "father"
  ) {
    if (!adultId) throw new Error("No adultId provided.");
    if (!primaryParent) throw new Error("No primaryParent provided.");
    if (!secondaryParent) throw new Error("No secondaryParent provided.");
    const parents = [primaryParent, secondaryParent] as const;
    const parentData = await getParentData(D1, parents, mostRecentFamily);

    function formatAdultData(
      parentData: readonly [
        DogAboutTypes.D1DQ & DogAboutTypes.D1AQ,
        DogAboutTypes.D1DQ & DogAboutTypes.D1AQ
      ],
      mostRecentFamily: DogAboutTypes.D1FQ
    ) {
      const convertParent = (i: number) =>
        ({
          [G.adultName]: parentData[i][G.adultName],
          [G.breeder]: parentData[i][G.breeder],
          [G.adultBirthday]: new Date(parentData[i][G.adultBirthday]),
          [G.eyeColor]: parentData[i][G.eyeColor],
          [G.activityStatus]: parentData[i][G.activityStatus] as
            | "Active"
            | "Retired"
            | "Break",
          [G.favActivities]: parentData[i][G.favActivities],
          [G.weight]: Number.parseFloat(parentData[i][G.weight]),
          [G.energyLevel]: parentData[i][G.energyLevel] as
            | "Low"
            | "Medium-low"
            | "Medium"
            | "Medium-high"
            | "High",
          [G.gender]: parentData[i][G.gender] as "M" | "F",
          [G.noseColor]: parentData[i][G.noseColor],
          [G.coat]: parentData[i][G.coat],
          [G.personality]: parentData[i][G.personality],
          [G.Headshots_Lg]: parentData[i][G.Headshots_Lg],
          [G.Headshots_Sm]: parentData[i][G.Headshots_Sm],
          [G.dogId]: Number.parseFloat(parentData[i][G.dogId]),
          [G.certifications]: parentData[i][G.certifications] as
            | "Embark"
            | "Embark-equivalent"
            | null,
        } satisfies DogAboutTypes.DogData);
      return {
        dogData: convertParent(0),
        partnerData: convertParent(1),
        litterData: {
          [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
          [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
          [G.applicantsInQueue]: Number.parseFloat(
            mostRecentFamily[G.applicantsInQueue]
          ),
          [G.availablePuppies]: Number.parseFloat(
            mostRecentFamily[G.availablePuppies]
          ),
          [G.totalPuppies]: Number.parseFloat(mostRecentFamily[G.totalPuppies]),
        },
        ids: {
          [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
          [G.mother]: Number.parseFloat(mostRecentFamily[G.mother]),
          [G.father]: Number.parseFloat(mostRecentFamily[G.father]),
          [G.litterId]: Number.parseFloat(mostRecentFamily[G.litterId]),
        },
      } satisfies VariantTypes["adult"];
    }
    const dogAboutData = formatAdultData(parentData, mostRecentFamily);

    Object.freeze(dogAboutData);
    Object.freeze(dogAboutData.dogData);
    Object.freeze(dogAboutData.partnerData);
    Object.freeze(dogAboutData.litterData);
    Object.freeze(dogAboutData.ids);
    return { ...dogAboutData };
  }
  // }

  // Puppy {
  /**Connects data for one puppy.*/
  function connectPuppyData(
    mostRecentFamily: DogAboutTypes.D1FQ,
    pup?: {
      puppyDogsTable: DogAboutTypes.D1DQ;
      puppy: DogAboutTypes.D1PQ;
    }
  ) {
    if (!pup) throw new Error("No puppy data provided.");
    function formatPupData(
      pup: { puppyDogsTable: DogAboutTypes.D1DQ; puppy: DogAboutTypes.D1PQ },
      mostRecentFamily: DogAboutTypes.D1FQ
    ) {
      return {
        dogData: {
          [G.puppyName]: pup.puppy[G.puppyName],
          [G.collarColor]: pup.puppy[G.collarColor],
          [G.availability]: pup.puppy[G.availability] as
            | "Available"
            | "Picked"
            | "Adopted"
            | "Held Back",
          [G.gender]: pup.puppyDogsTable[G.gender] as "M" | "F",
          [G.noseColor]: pup.puppyDogsTable[G.noseColor],
          [G.coat]: pup.puppyDogsTable[G.coat],
          [G.personality]: pup.puppyDogsTable[G.personality],
          [G.Headshots_Lg]: pup.puppyDogsTable[G.Headshots_Lg],
          [G.Headshots_Sm]: pup.puppyDogsTable[G.Headshots_Sm],
        },
        litterData: {
          [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
          [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
          [G.applicantsInQueue]: Number.parseFloat(
            mostRecentFamily[G.applicantsInQueue]
          ),
          [G.availablePuppies]: Number.parseFloat(
            mostRecentFamily[G.availablePuppies]
          ),
          [G.totalPuppies]: Number.parseFloat(mostRecentFamily[G.totalPuppies]),
        },
        ids: {
          [G.dogId]: Number.parseFloat(pup.puppy[G.dogId]),
          [G.litterId]: Number.parseFloat(mostRecentFamily[G.litterId]),
          [G.mother]: Number.parseFloat(mostRecentFamily[G.mother]),
          [G.father]: Number.parseFloat(mostRecentFamily[G.father]),
        },
      } satisfies VariantTypes["puppy"];
    }
    const dogAboutData = formatPupData(pup, mostRecentFamily);

    Object.freeze(dogAboutData);
    Object.freeze(dogAboutData.dogData);
    Object.freeze(dogAboutData.litterData);
    Object.freeze(dogAboutData.ids);

    return { ...dogAboutData };
  }
  // }

  /**
   * Ultimately determines which variant's data will be used for this
   * component.
   **/
  async function possibleVariants<PV extends Variant>(
    variantPossibility: PV
  ): Promise<VariantTypes[PV]> {
    switch (variantPossibility) {
      case V.adult:
        return (await connectAdultData(
          adultId,
          primaryParent,
          secondaryParent
        )) as VariantTypes["adult"] as PV extends typeof V.adult
          ? VariantTypes[PV]
          : never;
      case V.puppy:
        return connectPuppyData(
          mostRecentFamily,
          pup
        ) as VariantTypes["puppy"] as PV extends typeof V.puppy
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
    const partnerMorf = MorF(D<V['adult']>().partnerData[G.gender]);
  return (
    <>
      <div className={css.dogTitle}>
        <h1 className={css.dogName}>Meet {D<V['adult']>().dogData[G.adultName]}</h1>
                <hr />
        <h2 className={css.breeder}>
          <BreederLine breeder={D<V['adult']>().dogData[G.breeder]} />
        </h2>
      </div>
      <article className={css.mainDog}>
        <div className={css.attentionGetter}>
          <LargeHeadshot
            variant={G.Headshots_Lg}
            id={css.Headshots_Lg}
            src={D<V['adult']>().dogData[G.Headshots_Lg]}
            alt={D<V['adult']>().dogData[G.adultName]}
            gender={D<V['adult']>().dogData[G.gender]}
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
              {D<V['adult']>().litterData[G.litterBirthday]
                ? `Previously matched with ${D<V['adult']>().partnerData[G.adultName]}.`
                : `Currently matched with ${D<V['adult']>().partnerData[G.adultName]}.`}
            </h3>
            <h4 className={css.partnerLastLitter}>
              {D<V['adult']>().litterData[G.litterBirthday]
                ? `Last litter born on ${normalizeEpochDate(
                    D<V['adult']>().litterData[G.litterBirthday]!.toLocaleDateString()
                  ).replace(/.at.*/, "")}`
                : `Next litter due on ${normalizeEpochDate(
                    D<V['adult']>().litterData[G.dueDate].toLocaleDateString()
                  ).replace(/.at.*/, "")}`}
              {D<V['adult']>().litterData[G.dueDate].toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0]
                ? `...That's today!!`
                : undefined}
            </h4>
            <CLFImage
              id={css[D1T.Group_Photos]}
              src={D<V['adult']>().ids[D1T.Group_Photos]}
              alt={`${D<V['adult']>().dogData[G.adultName]} and ${
                D<V['adult']>().partnerData[G.adultName]
              }'s last litter.'`}
              width={600}
              height={400}
            />
          </div>
          <div className={css.partnerPhoto}>
            <Link
              href={`/${partnerMorf("sires", "dams")}/${
                D<V['adult']>().ids[partnerMorf("father", "mother")]
              }`}
            >
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={D<V['adult']>().partnerData[G.gender]}
                src={D<V['adult']>().partnerData[G.Headshots_Sm]}
                alt={D<V['adult']>().partnerData[G.adultName]}
                id={css.Headshots_Sm}
              />
            </Link>
            <h4 className={css.partnerBreeder}>
              <BreederLine breeder={D<V['adult']>().partnerData[G.breeder]} />
            </h4>
          </div>
        </div>
      </article>
    </>
  );
  }
}
