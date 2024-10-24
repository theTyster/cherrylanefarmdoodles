export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import SvgFirstTimeMother from "@/components/svg/first-time-mother.svg";
import {
  previousLittersQuery,
  type PreviousLittersQueryData as PlQ,
} from "@/constants/queries";

import { Fragment } from "react";

import AdultDogData from "@/components/dog-about/constants/adult-constants";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";
//export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

export default async function WoodSectionLitter({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;

  const mostRecentFamily = await getFirstRecentFamily(D1, params.litterId);
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
  } as React.CSSProperties;;

  return (
    <>
      <div
        style={{
          ...woodSectionStyle,
        }}
      >
        {previousLitters.map((litter) => {
          const litterId = litter[1];
          const GroupImage = litter[0];
          // Case for the first time mother.
          if (
            litterId === Number.parseFloat(params.litterId) &&
            previousLitters.length === 1
          ) {
            return (
              <div
                key={`FTM-${litterId}`}
                style={{
                  ...woodSectionStyle,
                }}
              >
                <SvgFirstTimeMother style={{ maxWidth: "700px" }} />
              </div>
            );
            // Case for the current litter.
          } else if (litterId === Number.parseFloat(params.litterId)) return;
          else
            return (
              <Fragment key={`GP-${litterId}`}>
                <h2
                  style={{
                    marginBottom: "1em",
                  }}
                >
                  Other litters from {mom[G.adultName]}
                </h2>
                <GroupPhoto
                  alt={`${mom.adultName}'s Previous Litter with ID ${litterId}'`}
                  src={GroupImage}
                  litterId={litterId}
                />
              </Fragment>
            );
        })}
      </div>
    </>
  );
}
