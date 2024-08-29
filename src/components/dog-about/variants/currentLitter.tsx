import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
export const runtime = "edge";

// Components
import SmallHeadshot from "@/components/Headshots/Headshots";
import BreederLine from "@/components/breeder-line/breeder-line";
import Link from "next/link";

// Css
import css from "@/styles/dog-about.module.scss";

// Types
import type { PuppyData } from "@/types/dog-about";

export default function CurrentLitter({ D }: { D: PuppyData }) {
    return (
      <>
            <div className={css.partnerPhoto}>
              <Link href={`/sires/${"--father id here--"}`}></Link>
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
              <h4 className={css.partnerBreeder}>
                <BreederLine breeder="Cherry Lane Farms" />
              </h4>
            </div>
      </>
    );
  }
