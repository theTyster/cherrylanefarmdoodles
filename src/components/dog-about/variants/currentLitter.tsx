import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";
import AvailabilityIcon from "@/components/svg/availability-icon.svg";

// Components
import SmallHeadshot from "@/components/Headshots/Headshots";
import Link from "next/link";

// Css
import theme from "@/styles/currentLitter.module.scss";

// Types
import type { PuppyData } from "@/types/dog-about";

export default function CurrentLitter({
  D,
  css,
}: {
  D: PuppyData;

  css?: { [key: string]: string };
}) {
  if (!css) css = theme;
  // Adds a message to an puppy when hovered.
  function availabilityMessage(): string {
    let message: string | undefined = undefined;
    if (D.dogData.puppyName) message = D.dogData.puppyName;
    else message = "This puppy";
    switch (D.dogData[G.availability]) {
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
      <div className={css.partnerPhoto} title={availabilityMessage()}>
        <Link
          className={css.puppyLink}
          scroll={false}
          href={`/pup/${D.ids.puppyId}`}
        >
          <SmallHeadshot
            variant={D1T.Headshots_Sm}
            gender={D.dogData[G.gender]}
            src={D.dogData[G.Headshots_Sm]}
            alt={
              (D.dogData[G.puppyName]
                ? D.dogData[G.puppyName]!
                : "Goldendoodle Puppy")
                .concat(
                    ` (${D.dogData.gender === "F" ? "Female" : "Male"})`
                  )
            }
            id={css.Headshots_Sm}
          />
          <AvailabilityIcon
            className={css.availabilityIcon}
            availability={D.dogData[G.availability]}
          />
        </Link>
        <h4 className={css.partnerBreeder}>{D.dogData[G.puppyName]}</h4>
      </div>
    </>
  );
}
