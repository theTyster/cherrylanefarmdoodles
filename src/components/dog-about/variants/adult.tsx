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
import type { AdultData } from "@/types/dog-about";

export default function Adult({D}: {D: AdultData}) {
    const partnerMorf = MorF(D.partnerData[G.gender]);
    return (
      <>
        <div className={css.dogTitle}>
          <h1 className={css.dogName}>
            Meet {D.dogData[G.adultName]}
          </h1>
          <hr />
          <h2 className={css.breeder}>
            <BreederLine breeder={D.dogData[G.breeder]} />
          </h2>
        </div>
        <article className={css.mainDog}>
          <div className={css.attentionGetter}>
            <LargeHeadshot
              variant={G.Headshots_Lg}
              id={css.Headshots_Lg}
              src={D.dogData[G.Headshots_Lg]}
              alt={D.dogData[G.adultName]}
              gender={D.dogData[G.gender]}
            />
            {
              //prettier-ignore
              <ul className={css.dogInfoList}>
            <li className={css.adultBirthday}>                <b>Age:</b> {calcAge(D.dogData[G.adultBirthday].toString())} years old         </li>
            <li className={css.applicantsInQueue}> <b>Puppies Available:</b> {D.litterData[G.availablePuppies]}/{D.litterData[G.totalPuppies]}</li>
            <li className={css.favActivities}><b>Favorite Activities:</b> {D.dogData[G.favActivities]}                                            </li>
            <li className={css.weight}>                    <b>Weight:</b> {D.dogData[G.weight]}                                                   </li>
            <li className={css.energyLevel}>         <b>Energy Level:</b> {D.dogData[G.energyLevel]}                                              </li>
            <li className={css.noseColor}>             <b>Nose Color:</b> {D.dogData[G.noseColor]}                                                </li>
            <li className={css.eyeColor}>               <b>Eye Color:</b> {D.dogData[G.eyeColor]}                                                 </li>
            <li className={css[G.coat]}>             <b>Coat Color:</b> {D.dogData[G.coat]}                                                </li>
            <li className={css.personality}>          <b>Personality:</b> {D.dogData[G.personality]}                                              </li>
          </ul>
            }
          </div>
          <div className={css.partnerData}>
            <div className={css.partnerVisuals}>
              <h3 className={css.partnerName}>
                {D.litterData[G.litterBirthday]
                  ? `Previously matched with ${
                      D.partnerData[G.adultName]
                    }.`
                  : `Currently matched with ${
                      D.partnerData[G.adultName]
                    }.`}
              </h3>
              <h4 className={css.partnerLastLitter}>
                {D.litterData[G.litterBirthday]
                  ? `Last litter born on ${normalizeEpochDate(
                      D.litterData[
                        G.litterBirthday
                      ]!.toLocaleDateString()
                    ).replace(/.at.*/, "")}`
                  : `Next litter due on ${normalizeEpochDate(
                      D.litterData[G.dueDate].toLocaleDateString()
                    ).replace(/.at.*/, "")}`}
                {D
                  .litterData[G.dueDate].toISOString()
                  .split("T")[0] === new Date().toISOString().split("T")[0]
                  ? `...That's today!!`
                  : undefined}
              </h4>
              <CLFImage
                id={css[D1T.Group_Photos]}
                src={D.ids[D1T.Group_Photos]}
                alt={`${D.dogData[G.adultName]} and ${
                  D.partnerData[G.adultName]
                }'s last litter.'`}
                width={600}
                height={400}
              />
            </div>
            <div className={css.partnerPhoto}>
              <Link
                href={`/${partnerMorf("sires", "dams")}/${
                  D.ids[partnerMorf("father", "mother")]
                }`}
              >
                <SmallHeadshot
                  variant={D1T.Headshots_Sm}
                  gender={D.partnerData[G.gender]}
                  src={D.partnerData[G.Headshots_Sm]}
                  alt={D.partnerData[G.adultName]}
                  id={css.Headshots_Sm}
                />
              </Link>
              <h4 className={css.partnerBreeder}>
                <BreederLine breeder={D.partnerData[G.breeder]} />
              </h4>
            </div>
          </div>
        </article>
      </>
    );
  }
