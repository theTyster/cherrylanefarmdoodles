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
  [D1T.Group_Photos]: sass[D1T.Group_Photos],
  [G.Headshots_Lg]: sass[G.Headshots_Lg],
  [G.Headshots_Sm]: sass[G.Headshots_Sm],
  [G.adultBirthday]: sass[G.adultBirthday],
  [G.adultName]: sass[G.adultName],
  [G.applicantsInQueue]: sass[G.applicantsInQueue],
  [G.availablePuppies]: sass[G.availablePuppies],
  [G.breeder]: sass[G.breeder],
  [G.coatColor]: sass[G.coatColor],
  [G.dueDate]: sass[G.dueDate],
  [G.energyLevel]: sass[G.energyLevel],
  [G.eyeColor]: sass[G.eyeColor],
  [G.favActivities]: sass[G.favActivities],
  [G.gender]: sass[G.gender],
  [G.isRetired]: sass[G.isRetired],
  [G.litterBirthday]: sass[G.litterBirthday],
  [G.noseColor]: sass[G.noseColor],
  [G.personality]: sass[G.personality],
  [G.totalPuppies]: sass[G.totalPuppies],
  [G.weight]: sass[G.weight],
  attentionGetter: sass.attentionGetter,
  dogAbout: sass.dogAbout,
  dogInfoList: sass.dogInfoList,
  dogTitle: sass.dogTitle,
  mainDog: sass.mainDog,
  partnerBirthday: sass.partnerBirthday,
  partnerBreeder: sass.partnerBreeder,
  partnerBreederPhoto: sass.partnerBreederPhoto,
  partnerData: sass.partnerData,
  partnerLastLitter: sass.partnerLastLitter,
  partnerName: sass.partnerName,
  partnerPhoto: sass.partnerPhoto,
  partnerVisuals: sass.partnerVisuals,
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

  function formatData() {

  return {
    dogData: parentData[0],
    partnerData: parentData[1],
    litterData: {
      [G.dueDate]: new Date(mostRecentFamily[G.dueDate]),
      [G.litterBirthday]: new Date(mostRecentFamily[G.litterBirthday]),
      [G.applicantsInQueue]: Number.parseFloat(mostRecentFamily[G.applicantsInQueue]),
      [G.availablePuppies]: Number.parseFloat(mostRecentFamily[G.availablePuppies]),
      [G.totalPuppies]: Number.parseFloat(mostRecentFamily[G.totalPuppies]),
    },
    ids: {
      [G.Group_Photos]: mostRecentFamily[G.Group_Photos],
      [G.mother]: mostRecentFamily[G.mother],
      [G.father]: mostRecentFamily[G.father],
      [G.litterId]: Number.parseFloat(mostRecentFamily[G.litterId]),
    }
  } satisfies DogAboutTypes.Data;
  }
  const DA = formatData();

  Object.freeze(DA);
  Object.freeze(DA.dogData);
  Object.freeze(DA.partnerData);
  Object.freeze(DA.litterData);

  const mainMorf = MorF(DA.dogData.gender);
  const partnerMorf = MorF(DA.partnerData.gender);

  return (
    <div className={css.dogAbout}>
      <div className={css.dogTitle}>
        <h1 className={css.adultName}>Meet {DA.dogData.adultName}</h1>
        <hr />
        <h2 className={css.breeder}>
          <BreederLine breeder={DA.dogData.breeder} />
        </h2>
      </div>
      <article className={css.mainDog}>
        <div className={css.attentionGetter}>
          <LargeHeadshot
            largeOrSmall={G.Headshots_Lg}
            id={css.Headshots_Lg}
            src={DA.dogData.Headshots_Lg}
            alt={DA.dogData.adultName}
            gender={DA.dogData.gender}
          />
          {
            //prettier-ignore
            <ul className={css.dogInfoList}>
            <li className={css.adultBirthday}>                <b>Age:</b> {calcAge(DA.dogData.adultBirthday.toString())} years old         </li>
            <li className={css.applicantsInQueue}> <b>Puppies Picked:</b> {DA.litterData.availablePuppies}/{DA.litterData[G.totalPuppies]}</li>
            <li className={css.favActivities}><b>Favorite Activities:</b> {DA.dogData.favActivities}                                            </li>
            <li className={css.weight}>                    <b>Weight:</b> {DA.dogData.weight}                                                   </li>
            <li className={css.energyLevel}>         <b>Energy Level:</b> {DA.dogData.energyLevel}                                              </li>
            <li className={css.noseColor}>             <b>Nose Color:</b> {DA.dogData.noseColor}                                                </li>
            <li className={css.eyeColor}>               <b>Eye Color:</b> {DA.dogData.eyeColor}                                                 </li>
            <li className={css.coatColor}>             <b>Coat Color:</b> {DA.dogData.coatColor}                                                </li>
            <li className={css.personality}>          <b>Personality:</b> {DA.dogData.personality}                                              </li>
          </ul>
          }
        </div>
        <div
          className={css.partnerData}
          style={{ backgroundColor: mainMorf(Theme.lightDad, Theme.lightMom) }}
        >
          <div className={css.partnerVisuals}>
            <div>
              <h3 className={css.partnerName}>
                {DA.litterData.litterBirthday
                  ? `Previously matched with ${DA.partnerData.adultName}.`
                  : `Currently matched with ${DA.partnerData.adultName}.`}
              </h3>
              <h4 className={css.partnerLastLitter}>
                {DA.litterData.litterBirthday
                  ? `Last litter born on ${normalizeEpochDate(
                      DA.litterData.litterBirthday.toLocaleDateString()
                    ).replace(/.at.*/, "")}`
                  : `Next litter due on ${normalizeEpochDate(
                      DA.litterData.dueDate.toLocaleDateString()
                    ).replace(/.at.*/, "")}`}
                {DA.litterData.dueDate.toISOString().split("T")[0] ===
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
          <div className={css.partnerPhoto}>
          <Link href={`/${partnerMorf('sires', 'dams')}/${DA.ids[partnerMorf('father', 'mother')]}`}>
            <SmallHeadshot
              largeOrSmall={D1T.Headshots_Sm}
              gender={DA.partnerData.gender}
              src={DA.partnerData.Headshots_Sm}
              alt={DA.partnerData.adultName}
              id={css.Headshots_Sm}
            />
            </Link>
            <h4 className={css.partnerBreeder}>
              <BreederLine breeder={DA.partnerData.breeder} />
            </h4>
          </div>
        </div>
      </article>
    </div>
  );
}
