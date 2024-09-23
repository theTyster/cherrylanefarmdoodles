export const runtime = "edge";
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { Fragment } from "react";

// Components
import SmallHeadshot from "@/components/Headshots/Headshots";
import Link from "next/link";
import NextFamilyDate from "@/components/next-family-date/next-family-date";
import AvailabilityIcon from "@/components/svg/availability-icon.svg";

// Css
import theme from "@/styles/currentLitter.module.scss";

// Types
import type { CurrentLitterData, PuppyData } from "@/types/dog-about";

export default function CurrentLitter({
  D,
  css,
}: {
  D: CurrentLitterData;
  css?: { [key: string]: string };
}) {
  if (!css) css = theme;
  // Adds a message to an puppy when hovered.
  function availabilityMessage(puppy: PuppyData): string {
    let message: string | undefined = undefined;
    if (puppy.dogData.puppyName) message = puppy.dogData.puppyName;
    else message = "This puppy";
    switch (puppy.dogData[G.availability]) {
      case "Available":
        message += " is available for adoption!";
        break;
      case "Picked":
        message += " has been picked!";
        break;
      case "Adopted":
        message += " has been adopted!";
        break;
      case "Held Back":
        message += " is going to be a new mother at Cherry Lane Farms!";
      default:
        message += "'s availability is unknown.";
    }
    return message;
  }
  return (
    <>
      {(() => {
        if (!D.parentData) return null;
        const calcInit = {
          litterBirthday: D.parentData.litterData[G.litterBirthday],
          dueDate: D.parentData.litterData[G.dueDate],
        };
        // Case for the first time mother.
        return D.parentData.litterData[G.totalPuppies] === 0 ? (
          <>
            <h1 className="litter-title">
              <NextFamilyDate
                calcInit={calcInit}
                availablePuppies={D.parentData.litterData[G.availablePuppies]}
                leade={`${
                  D.parentData.dogData[G.adultName]
                }'s First Litter is \n`}
              />
            </h1>
            <hr></hr>
            {/**
             * This will be where a subscription
             * button goes
             **/}
          </>
        ) : (
          <>
            <h1 className="litter-title">
              <NextFamilyDate
                calcInit={calcInit}
                availablePuppies={D.parentData.litterData[G.availablePuppies]}
                leade={`${
                  D.parentData.dogData[G.adultName]
                }'s Current Litter \n`}
              />
            </h1>
            <hr></hr>
          </>
        );
      })()}
      {D.puppies.map((puppyData) => (
        <Fragment key={puppyData.ids[G.dogId]}>
          <div
            className={css.partnerPhoto}
            title={availabilityMessage(puppyData)}
          >
            <Link
              className={css.puppyLink}
              scroll={false}
              href={`/pup/${puppyData.ids.puppyId}`}
            >
              <SmallHeadshot
                variant={D1T.Headshots_Sm}
                gender={puppyData.dogData[G.gender]}
                src={puppyData.dogData[G.Headshots_Sm]}
                alt={(puppyData.dogData[G.puppyName]
                  ? puppyData.dogData[G.puppyName]!
                  : "Goldendoodle Puppy"
                ).concat(
                  ` (${puppyData.dogData.gender === "F" ? "Female" : "Male"})`
                )}
                id={css.Headshots_Sm}
              />
              <AvailabilityIcon
                className={css.availabilityIcon}
                availability={puppyData.dogData[G.availability]}
              />
            </Link>
            <h4 className={css.partnerBreeder}>
              {puppyData.dogData[G.puppyName]}
            </h4>
          </div>
        </Fragment>
      ))}
    </>
  );
}
