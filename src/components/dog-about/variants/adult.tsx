export const runtime = "edge";
import { calcAge } from "thetyster-utils";
import DateCalculator from "@/constants/dates";
import { MorF } from "@/constants/Morf";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";

// Css
import theme from "@/styles/dog-about.module.scss";

// Types
import type { ParentData } from "@/types/dog-about";

export default function Adult({
  D,
  css,
}: {
  D: ParentData;
  css?: { [key: string]: string };
}) {
  if (!D.partnerData) throw new Error("No partner data provided.");
  if (!css) css = theme;
  const partnerMorf = MorF(D.partnerData[G.gender]);

  const litterBirthday = D.litterData[G.litterBirthday],
    dueDate = D.litterData[G.dueDate];

  const calc = new DateCalculator({
    litterBirthday: litterBirthday ? new Date(litterBirthday) : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });
  /**Returns a string containing information about available puppies.*/
  function hasPuppies(): string {
    let hasPuppiesString: string | undefined = undefined;
    const dueDate = D.litterData[G.dueDate];
    if (D.litterData[G.availablePuppies] === 0 && dueDate && !litterBirthday) {
      hasPuppiesString = `${D.dogData[G.adultName]}'s next litter is due on ${
        calc.prettified.currentDOB
      }`;
    } else if (
      D.litterData[G.availablePuppies] > 0 &&
      D.litterData[G.litterBirthday]
    )
      hasPuppiesString = `${D.dogData.adultName} has ${
        D.litterData[G.availablePuppies]
      } ${
        D.litterData[G.availablePuppies] > 1 ? "puppies" : "puppy"
      } available!` as string;
    else
      hasPuppiesString = "";
    return hasPuppiesString;
  }

  /**Returns a string containing information about the most recent litter.*/
  function relevantLitter(): string {
    const birthday = D.litterData[G.litterBirthday];
    const dueDate = D.litterData[G.dueDate];
    let relevantLitterString: string | undefined = undefined;

    if (D.litterData[G.availablePuppies] === 0 && dueDate) {
      relevantLitterString = `Next litter due on ${calc.prettified.currentDOB}`;
    }
    if (birthday) {
      relevantLitterString = `Last litter born on ${calc.prettified.currentDOB}`;
    }
    if (!relevantLitterString) {
      relevantLitterString = "Currently not expecting any litters.";
    }

    return relevantLitterString;
  }
  return (
    <>
      <div className={css.dogTitle}>
        <h1 className={css.dogName}>Meet {D.dogData[G.adultName]}</h1>
        <hr />
        <h2 className={css.breeder}>
          <BreederLine breeder={D.dogData[G.breeder]} />
        </h2>
      </div>
      <article className={css.mainDog}>
        <div className={css.attentionGetter}>
          <LargeHeadshot
            variant={G.Headshots_Lg}
            className={css.Headshots_Lg}
            src={D.dogData[G.Headshots_Lg]}
            alt={D.dogData[G.adultName]}
            gender={D.dogData[G.gender]}
            priority
          />
          <table className={css.dogInfoList}>
            <colgroup>
              <col span={1} className={css.col1} />
              <col span={1} className={css.col2} />
            </colgroup>
            <thead>
              <tr>
                <th
                  colSpan={2}
                  style={{ color: css.tertiaryCherry, lineHeight: "1.3em" }}
                >
                  {hasPuppies()}
                </th>
              </tr>
            </thead>
            <tbody>
              {D.dogData[G.adultBirthday] ? (
                <tr>
                  <td>
                    <b>Age:</b>
                  </td>
                  <td>
                    {calcAge(D.dogData[G.adultBirthday]!.toString())} years old
                  </td>
                </tr>
              ) : undefined}
              <tr>
                <td>
                  <b>Weight:</b>
                </td>
                <td>{D.dogData[G.weight]}</td>
              </tr>
              <tr>
                <td>
                  <b>Energy Level:</b>
                </td>
                <td>{D.dogData[G.energyLevel]}</td>
              </tr>
              <tr>
                <td>
                  <b>Eye Color:</b>
                </td>
                <td>{D.dogData[G.eyeColor]}</td>
              </tr>
              {D.dogData[G.favActivities] ? (
                <tr>
                  <td>
                    <b>Favorite Activities:</b>
                  </td>
                  <td>{D.dogData[G.favActivities]}</td>
                </tr>
              ) : undefined}
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
        </div>
        {(() => {
          // No partner, and no previous litter data.
          if (D.partnerData[G.adultName] === "Unrecorded") return;

          return (
            <div className={`${css.partnerData}`}>
              <div className={css.partnerVisuals}>
                {(() => {
                  // Has litter but no available puppies.
                  // Show who they were previously matched with.
                  if (
                    D.partnerData[G.adultName] !== "Unrecorded" &&
                    D.litterData[G.litterBirthday] &&
                    !D.litterData[G.availablePuppies]
                  )
                    return (
                      <>
                        <h3 className={css.partnerName}>
                          {`Previously matched with ${
                            D.partnerData[G.adultName]
                          }.`}
                        </h3>
                      </>
                    );
                  // Has litter and available puppies. (default)
                  else
                    return (
                      <>
                        <h3 className={`${css.partnerName}`}>
                          {`Currently matched with ${
                            D.partnerData[G.adultName]
                          }.`}
                        </h3>
                      </>
                    );
                })()}
                <h4 className={css.partnerLastLitter}>{relevantLitter()}</h4>
                <GroupPhoto
                  className={css[D1T.Group_Photos]}
                  src={D.ids[D1T.Group_Photos]}
                  alt={`${D.dogData[G.adultName]} and ${
                    D.partnerData[G.adultName]
                  }'s last litter.'`}
                  litterId={D.ids[G.litterId]}
                />
              </div>
              <div className={css.partnerPhoto}>
                <Link
                  href={`/${partnerMorf("sires", "dams")}/${D.ids[G.litterId]}`}
                >
                  <SmallHeadshot
                    variant={D1T.Headshots_Sm}
                    gender={D.partnerData[G.gender]}
                    src={D.partnerData[G.Headshots_Sm]}
                    alt={D.partnerData[G.adultName]}
                    className={css.Headshots_Sm}
                  />
                </Link>
                <h4 className={css.partnerBreeder}>
                  <BreederLine breeder={D.partnerData[G.breeder]} />
                </h4>
              </div>
            </div>
          );
        })()}
      </article>
    </>
  );
}
