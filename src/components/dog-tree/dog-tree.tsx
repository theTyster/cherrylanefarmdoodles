// Styling
import Theme from "@/styles/theme.module.scss";
import css from "@/styles/dog-tree.module.scss";

// Components
import Image from "next/image";
import Link from "next/link";
import MomHeadshot from "@/components/Headshots/Headshots";
import DadHeadshot from "@/components/Headshots/Headshots";

// Constants
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { normalizeEpochDate } from "thetyster-utils";

// Types
import type { DogTree_Litters } from "@/types/dog-tree";

export const runtime = "edge";

export default async function DogTree({
  familyData,
}: {
  familyData: {
    [G.mother]: D1Dogs & D1Adults;
    [G.father]: D1Dogs & D1Adults;
    [D1T.Litters]: DogTree_Litters;
    [G.Group_Photos]: D1Families[typeof G.Group_Photos];
  };
}) {
  const {
    [G.mother]: mother,
    [G.father]: father,
    [D1T.Litters]: litterData,
    [G.Group_Photos]: familyPhoto,
  } = familyData;

  const goingHome = () => {
    const date = () => litterData.litterBirthday ? litterData.litterBirthday : litterData.dueDate;
    if ( new Date(date()).getFullYear() ===  date().getFullYear() )
      return normalizeEpochDate(date()).split(",")[0];
    else if ( new Date(date()).toISOString().split("T")[0] === new Date().toISOString().split("T")[0] )
      return "Today! 🎉";
    else
      return normalizeEpochDate(date()).split(",")[0];
  };
  return (
    <>
      <div className={css.top}>
        <Link href={"dams/" + mother[G.id]}>
          <MomHeadshot
            largeOrSmall={D1T[G.Headshots_Sm]}
            src={mother[G.Headshots_Sm]}
            alt="Mother Dog"
            gender="F"
          />
        </Link>
        <h1 className={`${Theme.desktopOnly} ${css.heading}`}>
          <div className={css.goingHome}>Going Home</div>
          {goingHome()}
        </h1>
        <Link href={"sires/" + father[G.id]}>
          <DadHeadshot
            largeOrSmall={D1T[G.Headshots_Sm]}
            src={father[G.Headshots_Sm]}
            alt="Father Dog"
            gender="M"
          />
        </Link>
      </div>
      <h1 className={`${Theme.mobileOnly} ${css.heading}`}>
        <div className={css.goingHome}>Going Home</div>
        {goingHome()}
      </h1>
      <div className={css.bottom}>
        <Image
          className={css.puppyGroup}
          src={familyPhoto}
          alt="Puppies"
          width={600}
          height={400}
        />
      </div>
    </>
  );
}
