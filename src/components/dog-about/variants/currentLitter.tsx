import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import SmallHeadshot from "@/components/Headshots/Headshots";
import Link from "next/link";

// Css
import css from "@/styles/dog-about.module.scss";

// Types
import type { PuppyData } from "@/types/dog-about";

export default function CurrentLitter({ D }: { D: PuppyData }) {
  console.log(D)
    return (
      <>
            <div className={css.partnerPhoto}>
              <Link scroll={false} href={`/pup/${D.ids.puppyId}`}>
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
              </Link>
              <h4 className={css.partnerBreeder}>
                {D.dogData[G.puppyName]}
              </h4>
            </div>
      </>
    );
  }
