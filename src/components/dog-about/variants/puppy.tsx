import { normalizeEpochDate } from "thetyster-utils";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import LargeHeadshot from "@/components/Headshots/Headshots";
import SmallHeadshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";
import FormLink from "@/components/form-link/form-link";
import AvailabilityIcon from "@/components/svg/availability-icon.svg";

// Css
import theme from "@styles/puppy.module.scss";

// Types
import type { PuppyData } from "@/types/dog-about";
import { PuppyAvailability } from "@/constants/data";

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

  const puppyName = D.dogData[G.puppyName];

  function hasPuppies(): string | undefined {
    const hasPuppiesString: { descriptor: string | undefined } = {
      descriptor: undefined,
    };

    const dueDate = D.litterData[G.dueDate];
    const birthday = D.litterData[G.litterBirthday];
    if (dueDate) {
      const dueDateObject = new Date(dueDate);
      hasPuppiesString.descriptor = `Due on ${normalizeEpochDate(
        dueDateObject,
        "date-only"
      )}`;

      hasPuppiesString.descriptor +=
        dueDateObject.toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0]
          ? `... that's today!!`
          : "";

      if (birthday) {
        const birthdayObject = new Date(birthday);
        hasPuppiesString.descriptor = `Born on ${normalizeEpochDate(
          birthday,
          "date-only"
        )}`;

        hasPuppiesString.descriptor +=
          birthdayObject.toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
            ? `... that's today!!`
            : "";
        return hasPuppiesString.descriptor;
      }

      return hasPuppiesString.descriptor;
    }
    else if (birthday) {
        const birthdayObject = new Date(birthday);
        hasPuppiesString.descriptor = `Born on ${normalizeEpochDate(
          birthday,
          "date-only"
        )}`;

        hasPuppiesString.descriptor +=
          birthdayObject.toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
            ? `... that's today!!`
            : "";
        return hasPuppiesString.descriptor;
      }
    else {
      return hasPuppiesString.descriptor;
    }
  }
  return (
    <>
      <article className={css.mainDog}>
        <div className={css.attentionGetter}>
          <LargeHeadshot
            variant={G.Headshots_Lg}
            src={D.dogData[G.Headshots_Lg]}
            alt={puppyName}
            gender={D.dogData[G.gender]}
            priority
          />
          <div className={`${css.dogTitle}`}>
            <h1 className={css.dogName}>
              {puppyName}
              <AvailabilityIcon availability={D.dogData[G.availability]} />
            </h1>
            <hr></hr>
            <h2 className={css.availability}>{D.dogData[G.availability]}</h2>
          </div>
        </div>
        {(D.dogData[G.availability] === PuppyAvailability["Available"] ||
          D.dogData[G.availability] ===
            PuppyAvailability["Available Guardian"]) && (
          <FormLink>
            <b>Apply for</b> <br />
            <span style={{ lineHeight: "1.5em", fontSize: "1.5em" }}>
              {puppyName}
            </span>
          </FormLink>
        )}
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
                  <th colSpan={2}>{hasPuppies()}</th>
                </tr>
              </thead>
              <colgroup>
                <col span={1} className={css.col1} />
                <col span={1} className={css.col2} />
              </colgroup>
              <tbody>
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
            <GroupPhoto
              className={css[D1T.Group_Photos]}
              src={D.ids[D1T.Group_Photos]}
              alt={`${D.parentData.partnerData[G.adultName]} and ${
                D.parentData.dogData[G.adultName]
              }'s last litter.'`}
              litterId={D.ids[G.litterId]}
            />
          </div>
          <div className={css.partnerPhoto}>
            <Link href={`/dams/${D.ids[G.litterId]}`}>
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={D.parentData.dogData[G.gender]}
                src={D.parentData.dogData[G.Headshots_Sm]}
                alt={D.parentData.dogData[G.adultName]}
                className={css.Headshots_Sm}
              />
            </Link>
            <h4 className={css.breederLine}>
              <BreederLine breeder={D.parentData.dogData[G.breeder]} />
            </h4>
            <Link href={`/sires/${D.ids[G.litterId]}`}>
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={D.parentData.partnerData[G.gender]}
                src={D.parentData.partnerData[G.Headshots_Sm]}
                alt={D.parentData.partnerData[G.adultName]}
                className={css.Headshots_Sm}
              />
            </Link>
            <h4 className={css.breederLine}>
              <BreederLine breeder={D.parentData.partnerData[G.breeder]} />
            </h4>
          </div>
        </div>
      </article>
    </>
  );
}
