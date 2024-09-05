import { normalizeEpochDate } from "thetyster-utils";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";
import AvailabilityIcon from "@/components/svg/availability-icon.svg";

// Css
import theme from "@styles/puppy.module.scss";

// Types
import type { PuppyData } from "@/types/dog-about";

export default function Puppy({
  D,
  css,
}: {
  D: PuppyData;
  css?: { [key: string]: string };
}) {
  if (!D.parentData)
    throw new Error(D.dogData.puppyName + " has no mother data.");
  if (!D.parentData.partnerData)
    throw new Error(D.dogData.puppyName + " has no father data.");

  if (!css) css = theme;

  const puppyName = D.dogData[G.puppyName] ?? "Unnamed Puppy";
  return (
    <>
      <article className={css.mainDog}>
        <div className={css.attentionGetter}>
          <LargeHeadshot
            variant={G.Headshots_Lg}
            id={css.Headshots_Lg}
            src={D.dogData[G.Headshots_Lg]}
            alt={puppyName}
            gender={D.dogData[G.gender]}
          />
          <div className={`${css.dogTitle}`}>
            <h1 className={css.dogName}>{puppyName}</h1>
            <hr />
            <h2 className={css.availability}>
              {D.dogData[G.availability]}
              <AvailabilityIcon availability={D.dogData[G.availability]}/>
            </h2>
          </div>
        </div>
        <div className={css.familyData}>
          <div className={css.partnerVisuals}>
            <h3 className={css.parentsLine}>
              {D.dogData.gender === "F"
                ? "Daughter of " +
                  D.parentData.dogData[G.adultName] +
                  " and " +
                  D.parentData.partnerData[G.adultName]
                : "Son of " +
                  D.parentData.dogData[G.adultName] +
                  " and " +
                  D.parentData.partnerData[G.adultName]}
            </h3>
            <table className={css.dogTable}>
              <thead>
                <tr>
                  <th colSpan={2}>
                    {D.litterData[G.litterBirthday]
                      ? `Born on ${normalizeEpochDate(
                          D.litterData[G.litterBirthday]!.toLocaleDateString()
                        ).replace(/.at.*/, "")}`
                      : `Due on ${normalizeEpochDate(
                          D.litterData[G.dueDate].toLocaleDateString()
                        ).replace(/.at.*/, "")}`}
                    {D.litterData[G.dueDate].toISOString().split("T")[0] ===
                    new Date().toISOString().split("T")[0]
                      ? `...That's today!!`
                      : undefined}
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col span={1} className={css.col1} />
                <col span={1} className={css.col2} />
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    <b>Gender:</b>
                  </td>
                  <td>{D.dogData[G.gender]}</td>
                </tr>
                <tr>
                  <td>
                    <b>Nose Color:</b>
                  </td>
                  <td>{D.dogData[G.noseColor]}</td>
                </tr>
                <tr>
                  <td>
                    <b>Coat Color:</b>
                  </td>
                  <td>{D.dogData[G.coat]}</td>
                </tr>
                {D.dogData[G.personality] ? (
                  <tr>
                    <td>
                      <b>Personality:</b>
                    </td>
                    <td>{D.dogData[G.personality]}</td>
                  </tr>
                ) : undefined}
              </tbody>
            </table>
            <h4 className={css.partnerLastLitter}></h4>
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
            <Link href={`/sires/${D.ids[G.father]}`}></Link>
            <SmallHeadshot
              variant={D1T.Headshots_Sm}
              gender={D.parentData.dogData[G.gender]}
              src={D.parentData.dogData[G.Headshots_Sm]}
              alt={D.parentData.dogData[G.adultName]}
              id={css.Headshots_Sm}
            />
            <h4 className={css.breederLine}>
              <BreederLine breeder={D.parentData.dogData[G.breeder]} />
            </h4>
            <SmallHeadshot
              variant={D1T.Headshots_Sm}
              gender={D.parentData.partnerData[G.gender]}
              src={D.parentData.partnerData[G.Headshots_Sm]}
              alt={D.parentData.partnerData[G.adultName]}
              id={css.Headshots_Sm}
            />
            <h4 className={css.breederLine}>
              <BreederLine breeder={D.parentData.partnerData[G.breeder]} />
            </h4>
          </div>
        </div>
      </article>
    </>
  );
}
