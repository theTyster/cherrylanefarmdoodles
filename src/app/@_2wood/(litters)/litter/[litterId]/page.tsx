export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  previousLittersQuery,
  type PreviousLittersQueryData as PlQ,
} from "@/constants/queries";
import { getFirstRecentFamily } from "@/components/dog-about/constants/family-constants";
import DateCalculator from "@/constants/dates";

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

  return (
    <>
      <div className={css["litter-woodSection"]}>
        {previousLitters.length ? (
          <h1>Other litters from {mom[G.adultName]}</h1>
        ) : (
          ""
        )}
        {(() => {
          const id = previousLitters[0][1]; /** <--Litter Id*/
          if (id && previousLitters.length === 1) {
            return (
              <div key={`FTM-${id}`} className={css["litter-woodsection"]}>
                <h2>This is {mom.adultName}&apos;s first litter!</h2>
                <SvgFirstTimeMother style={{ maxWidth: "700px" }} />
              </div>
            );
          }
        })()}
        <hr />
        <div className={css["previous-litters"]}>
          {previousLitters.map((litter) => {
            const [
              GroupImage,
              id,
              birthday,
              dueDate,
              applicantsInQueue,
              availablePuppies,
              totalPuppies,
            ] = litter;

            const date = new DateCalculator({
              litterBirthday: birthday ? new Date(birthday) : null,
              dueDate: dueDate ? new Date(dueDate) : null,
            });

            // Case for the first time mother.
            if (id === Number.parseFloat(litterId)) return;
            else
              return (
                <Fragment key={`GP-${id}`}>
                  <div className={css["litter-group"]}>
                    {(() => {
                      switch (date.nextEvent.type) {
                        case "born":
                          return <h2>Born {date.prettified.nextEvent}</h2>;
                        case "due":
                          return <h2>Due {date.prettified.nextEvent}</h2>;
                        case "pickDay":
                          return (
                            <h2>
                              Available for picks {date.prettified.nextEvent}
                            </h2>
                          );
                        case "goHome":
                          return (
                            <h2>Going home {date.prettified.nextEvent}</h2>
                          );
                      }
                    })()}
                    <GroupPhoto
                      alt={`${mom.adultName}'s Previous Litter with ID ${id}'`}
                      src={GroupImage}
                      litterId={id}
                      puppiesLeft={{
                        availablePuppies,
                        totalPuppies,
                        applicantsInQueue,
                      }}
                    />
                  </div>
                </Fragment>
              );
          })}
        </div>
      </div>
      <div className={css["litter-woodSection"]}>
        <h2>Meet the Momma: {`${mom[G.adultName]}`}</h2>
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
