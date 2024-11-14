export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  previousLittersQuery,
  type PreviousLittersQueryData as PlQ,
} from "@/constants/queries";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";

// Components
import { Fragment } from "react";
import Link from "next/link";
import AdultDogData from "@/components/dog-about/constants/adult-constants";
import Headshot from "@/components/Headshots/Headshots";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import SvgFirstTimeMother from "@/components/svg/first-time-mother.svg";

// Styles
import css from "./page.module.scss";

//export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

async function WoodSectionLitter({
  params,
}: {
  params: Promise<{ litterId: string }>;
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;
  const { litterId } = await params;

  const mostRecentFamily = await getFirstRecentFamily(D1, litterId);
  const motherId = mostRecentFamily[G.mother];
  const mom = await new AdultDogData(D1, motherId, "mother").getAdultData();
  const previousLitters = await D1.prepare(previousLittersQuery)
    .bind(motherId)
    .raw<PlQ>();
  const woodSectionStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties;

  return (
    <>
      <div
        style={{
          ...woodSectionStyle,
        }}
      >
        {previousLitters.map((litter) => {
          const previousLitterId = litter[1];
          const GroupImage = litter[0];
          // Case for the first time mother.
          if (
            previousLitterId &&
            previousLitters.length === 1
          ) {
            return (
              <div
                key={`FTM-${previousLitterId}`}
                style={{
                  ...woodSectionStyle,
                }}
              >
                <SvgFirstTimeMother style={{ maxWidth: "700px" }} />
              </div>
            );
            // Case for the current litter.
          } else if (previousLitterId === Number.parseFloat(litterId)) return;
          else
            return (
              <Fragment key={`GP-${previousLitterId}`}>
                <h2
                  style={{
                    marginBottom: "1em",
                  }}
                >
                  Other litters from {mom[G.adultName]}
                </h2>
                <GroupPhoto
                  alt={`${mom.adultName}'s Previous Litter with ID ${previousLitterId}'`}
                  src={GroupImage}
                  litterId={previousLitterId}
                />
              </Fragment>
            );
        })}
      </div>
      <div>
        <h2
          style={{
            marginBottom: "1em",
          }}
        >
          Meet the Momma: {`${mom[G.adultName]}`}
        </h2>
        <Link href={`/dams/${litterId}`}>
          <Headshot
            className={css.currentLitter__momHeadshot}
            alt={mom[G.adultName]}
            variant={G.Headshots_Lg}
            gender={mom[G.gender]}
            src={mom[G.Headshots_Lg]}
            priority
          />
        </Link>
      </div>
    </>
  );
}
export default WoodSectionLitter;
