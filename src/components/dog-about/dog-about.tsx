import { getRequestContext } from "@cloudflare/next-on-pages";
export const runtime = "edge";

import { calcAge, normalizeEpochDate } from "thetyster-utils";
import { MorF } from "cherrylanefarms-utils";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import CLFImage from "@/components/CLFImage/CLFImage";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";

// Styling
import sass from "@/styles/dog-about.module.scss";
import Theme from "@/styles/theme.module.scss";

// Types
import type * as DogAboutTypes from "@/types/dog-about";

// Constants
import {
  familyQuery,
  type familyQueryData,
  adultDogsQuery,
  type adultDogsQueryData,
  dogsQuery,
  type dogsQueryData,
} from "@/constants/queries";

export const css: DogAboutTypes.CSS = {
  Headshots_Lg: sass.Headshots_Lg,
  Headshots_Sm: sass.Headshots_Sm,
  [D1T.Group_Photos]: sass[D1T.Group_Photos],
  adultBirthday: sass.adultBirthday,
  adultName: sass.adultName,
  applicantsInQueue: sass.applicantsInQueue,
  attentionGetter: sass.attentionGetter,
  availablePuppies: sass.availablePuppies,
  breeder: sass.breeder,
  coatColor: sass.coatColor,
  dogAbout: sass.dogAbout,
  dogInfoList: sass.dogInfoList,
  dogTitle: sass.dogTitle,
  dueDate: sass.dueDate,
  energyLevel: sass.energyLevel,
  eyeColor: sass.eyeColor,
  favActivities: sass.favActivities,
  gender: sass.gender,
  isRetired: sass.isRetired,
  litterBirthday: sass.litterBirthday,
  mainDog: sass.mainDog,
  noseColor: sass.noseColor,
  partnerBirthday: sass.partnerBirthday,
  partnerBreeder: sass.partnerBreeder,
  partnerBreederPhoto: sass.partnerBreederPhoto,
  partnerData: sass.partnerData,
  partnerLastLitter: sass.partnerLastLitter,
  partnerName: sass.partnerName,
  partnerPhoto: sass.partnerPhoto,
  partnerVisuals: sass.partnerVisuals,
  personality: sass.personality,
  weight: sass.weight,
} as const;

export default async function DogAbout({
  adultId,
  primaryParent,
  secondaryParent,
}: {
  adultId: number;
  /**
   * The dog whom this page is about.
   **/
  primaryParent: "mother" | "father";
  /**
   * The dog who has been partnered with the primary dog.
   **/
  secondaryParent: "mother" | "father";
}) {
  const parents = [primaryParent, secondaryParent] as const;
  const D1 = getRequestContext().env.dogsDB;
  /**
   * The most recent family relationship of the primary dog on this page.
   **/
  const mostRecentFamily = await D1.prepare(familyQuery(primaryParent))
    .bind(adultId)
    .first<familyQueryData>()
    .then((familyTableData) => {
      if (!familyTableData)
        throw new Error(
          "Missing data sourced through the Families Table for ID: " + adultId
        );
      return familyTableData;
    });

  /**
   * Data for both parents. Order is consistent with the {@see parents}
   * First Dog is the primary dog of interest for this page.
   **/
  const parentData = await Promise.all(
    parents.map(async (role) => {
      return await D1.prepare(adultDogsQuery)
        .bind(mostRecentFamily[role])
        .first<adultDogsQueryData>()
        .then(async (adultsTableData) => {
          if (!adultsTableData)
            throw new Error(
              "Missing " +
                role +
                " data in Adult Table for ID: " +
                mostRecentFamily[role]
            );
          const completedData = await D1.prepare(dogsQuery)
            .bind(adultsTableData[G.dogId])
            .first<dogsQueryData>()
            .then((dogTableData) => {
              if (!dogTableData)
                throw new Error(
                  "Missing " +
                    role +
                    " data in Dogs Table for ID: " +
                    adultsTableData[G.dogId]
                );
              return { ...dogTableData, ...adultsTableData };
            });
          return completedData;
        });
    })
  );

  const DA = {
    css,
    dogData: parentData[0],
    partnerData: parentData[1],
    recentLitter: mostRecentFamily,
  };

  // Data and type conversions.
  if (typeof DA.recentLitter.availablePuppies === "number")
    DA.recentLitter.availablePuppies;
  else
    DA.recentLitter.availablePuppies = Number.parseFloat(
      DA.recentLitter.availablePuppies
    );
  DA.recentLitter.dueDate = new Date(DA.recentLitter.dueDate);

  if (DA.recentLitter.litterBirthday)
    DA.recentLitter.litterBirthday = new Date(DA.recentLitter.litterBirthday);
  DA.dogData.adultBirthday = new Date(DA.dogData.adultBirthday);

  Object.freeze(DA);
  Object.freeze(DA.css);
  Object.freeze(DA.dogData);
  Object.freeze(DA.partnerData);
  Object.freeze(DA.recentLitter);

  const morf = MorF(DA.dogData.gender);

  return (
    <div className={DA.css.dogAbout}>
      <div className={DA.css.dogTitle}>
        <h1 className={DA.css.adultName}>Meet {DA.dogData.adultName}</h1>
        <hr />
        <h2 className={DA.css.breeder}>
          <BreederLine breeder={DA.dogData.breeder} />
        </h2>
      </div>
      <article className={DA.css.mainDog}>
        <div className={DA.css.attentionGetter}>
          <LargeHeadshot
            largeOrSmall={G.Headshots_Lg}
            id={DA.css.Headshots_Lg}
            src={DA.dogData.Headshots_Lg}
            alt={DA.dogData.adultName}
            gender={DA.dogData.gender}
          />
          {
            //prettier-ignore
            <ul className={DA.css.dogInfoList}>
            <li className={DA.css.adultBirthday}>                     <b>Age:</b> {calcAge(DA.dogData.adultBirthday.toString())} years old         </li>
            <li className={DA.css.applicantsInQueue}> <b>Puppies Picked:</b> {DA.recentLitter.applicantsInQueue}/{DA.recentLitter.availablePuppies}</li>
            <li className={DA.css.favActivities}><b>Favorite Activities:</b> {DA.dogData.favActivities}                                            </li>
            <li className={DA.css.weight}>                    <b>Weight:</b> {DA.dogData.weight}                                                   </li>
            <li className={DA.css.energyLevel}>         <b>Energy Level:</b> {DA.dogData.energyLevel}                                              </li>
            <li className={DA.css.noseColor}>             <b>Nose Color:</b> {DA.dogData.noseColor}                                                </li>
            <li className={DA.css.eyeColor}>               <b>Eye Color:</b> {DA.dogData.eyeColor}                                                 </li>
            <li className={DA.css.coatColor}>             <b>Coat Color:</b> {DA.dogData.coatColor}                                                </li>
            <li className={DA.css.personality}>          <b>Personality:</b> {DA.dogData.personality}                                              </li>
          </ul>
          }
        </div>
        <div
          className={DA.css.partnerData}
          style={{ backgroundColor: morf(Theme.lightDad, Theme.lightMom) }}
        >
          <div className={DA.css.partnerVisuals}>
            <div>
              <h3 className={DA.css.partnerName}>
                {DA.recentLitter.litterBirthday
                  ? `Previously matched with ${DA.partnerData.adultName}.`
                  : `Currently matched with ${DA.partnerData.adultName}.`}
              </h3>
              <h4 className={DA.css.partnerLastLitter}>
                {DA.recentLitter.litterBirthday
                  ? `Last litter born on ${normalizeEpochDate(
                      DA.recentLitter.litterBirthday.toLocaleDateString()
                    ).replace(/.at.*/, "")}`
                  : `Next litter due on ${normalizeEpochDate(
                      DA.recentLitter.dueDate.toLocaleDateString()
                    ).replace(/.at.*/, "")}`}
                {DA.recentLitter.dueDate.toISOString().split("T")[0] ===
                new Date().toISOString().split("T")[0]
                  ? `...That's today!!`
                  : undefined}
              </h4>
              <CLFImage
                id={css[D1T.Group_Photos]}
                src={DA.ids[D1T.Group_Photos]}
                alt={`${DA.dogData.adultName} and ${DA.partnerData.adultName}'s last litter.'`}
                width={600}
                height={400}
              />
            </div>
          </div>
          <div className={DA.css.partnerPhoto}>
            <SmallHeadshot
              largeOrSmall={D1T.Headshots_Sm}
              gender={DA.partnerData.gender}
              src={DA.partnerData.Headshots_Sm}
              alt={DA.partnerData.adultName}
              id={DA.css.Headshots_Sm}
            />
            <h4 className={DA.css.partnerBreeder}>
              <BreederLine breeder={DA.partnerData.breeder} />
            </h4>
          </div>
        </div>
      </article>
    </div>
  );
}
