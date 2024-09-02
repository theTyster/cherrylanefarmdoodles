import { calcAge, normalizeEpochDate } from "thetyster-utils";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";

// Css
import css from "@/styles/dog-about.module.scss";

// Types
import type {PuppyData} from "@/types/dog-about";

export default function Puppy({ D }: { D: PuppyData }) {
    return (
      <>
        <div className={css.dogTitle}>
          <h1 className={css.dogName}>
            Meet {D.dogData[G.puppyName]}
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
              src={D.dogData[G.Headshots_Lg]}
              alt={
                D.dogData[G.puppyName]
                  ? D.dogData[G.puppyName]!
                  : "Goldendoodle Puppy"
              }
              gender={D.dogData[G.gender]}
            />
            {
              //prettier-ignore
              <ul className={css.dogInfoList}>
          {D.litterData[G.litterBirthday] ? 
            <li className={css.adultBirthday}>                <b>Age:</b> {calcAge(D.litterData[G.litterBirthday]!.toString())} years old         </li>
            : undefined}
            <li className={css.applicantsInQueue}> <b>Puppies Available:</b> {D.litterData[G.availablePuppies]}/{D.litterData[G.totalPuppies]}</li>
            <li className={css.noseColor}>             <b>Nose Color:</b> {D.dogData[G.noseColor]}                                                </li>
            <li className={css[G.coat]}>             <b>Coat Color:</b> {D.dogData[G.coat]}                                                </li>
            <li className={css.personality}>          <b>Personality:</b> {D.dogData[G.personality]}                                              </li>
          </ul>
            }
          </div>
          <div className={css.partnerData}>
            <div className={css.partnerVisuals}>
              <h3 className={css.mother}>
                {D.litterData[G.litterBirthday]
                  ? `Previously matched with ${"--mother goes here--"}.`
                  : `Currently matched with ${"--mother goes here--"}.`}
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
              <GroupPhoto
                id={css[D1T.Group_Photos]}
                src={D.ids[D1T.Group_Photos]}
                alt={`${
                  D.dogData[G.puppyName]
                } and ${"--mother name here--"}'s last litter.'`}
                litterId={D.ids[G.litterId]}
              />
            </div>
            <div className={css.partnerPhoto}>
              <Link href={`/sires/${"--father id here--"}`}></Link>
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={D.dogData[G.gender]}
                src={D.dogData[G.Headshots_Sm]}
                alt={
                  D.dogData[G.puppyName]
                    ? D.dogData[G.puppyName]!
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
