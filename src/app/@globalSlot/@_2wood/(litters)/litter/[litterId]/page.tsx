export const runtime = "edge";
import { GlobalNameSpaces as G } from "@/constants/data";
import { getRequestContext } from "@cloudflare/next-on-pages";
import CLFImage from "@/components/CLFImage/CLFImage";
import SvgFirstTimeMother from "@/components/svg/first-time-mother.svg";
import Link from "next/link";
import {
  previousLittersQuery,
  type PreviousLittersQueryData as PlQ,
} from "@/constants/queries";

import AdultDogData, {
  getMostRecentFamily,
} from "@/components/dog-about/constants/adult-constants";
export { puppiesMeta as generateMetadata } from "@/constants/meta-generators/puppies-meta";

export default async function WoodSectionLitter({
  params,
}: {
  params: { litterId: string };
}): Promise<React.JSX.Element | null> {
  const D1 = getRequestContext().env.dogsDB;

  const mostRecentFamily = await getMostRecentFamily<"first">(
    D1,
    params.litterId,
  );
  const motherId = mostRecentFamily[G.mother];
  const mom = await new AdultDogData(D1, motherId, "mother").getAdultData();
  const previousLitters = await D1.prepare(previousLittersQuery)
    .bind(motherId)
    .raw<PlQ>();
  return (
    <>
      <div>
        <h2>Previous Litters</h2>
        {previousLitters.map((litter) => {
          const litterId = litter[1];
          const GroupPhoto = litter[0];
          if (litterId === Number.parseFloat(params.litterId) && previousLitters.length === 1){
            return (
              <div key={`FTM-${litterId}`} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                <SvgFirstTimeMother style={{maxWidth: "700px"}}/>
              </div>
            );
          }
          if (litterId === Number.parseFloat(params.litterId)) return;
            return (
              <Link href={`/litter/${litterId}`} key={`GP-${litterId}`}>
                <CLFImage
                  alt={`${mom.adultName}'s Previous Litter with ID ${litterId}'`}
                  src={GroupPhoto}
                  width={400}
                  height={300}
                />
              </Link>
            );
        })}
      </div>
    </>
  );
}