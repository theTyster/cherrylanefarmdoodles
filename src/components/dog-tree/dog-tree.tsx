// Styling
import css from "@styles/dog-tree.module.scss";

// Components
import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import Link from "next/link";
import NextFamilyDate from "@/components/next-family-date/next-family-date";

// Headshots
import MomHeadshot from "@/components/Headshots/Headshots";
import DadHeadshot from "@/components/Headshots/Headshots";
import UnrecordedDog from "@/components/Headshots/Headshots";

// Constants
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";

// Types
import type { DogTreeData } from "@/types/dog-tree";

// Static
import unrecordedDogIMG from "@pub/images/unrecorded-dog.png";
import CheckBackSoon from "@/components/svg/check-back-soon";

export const runtime = "edge";

export default function DogTree({ familyData }: { familyData: DogTreeData }) {
  const {
    [G.mother]: mother,
    [G.father]: father,
    litterData,
    ids,
  } = familyData;

  Object.freeze(mother);
  Object.freeze(father);
  Object.freeze(litterData);
  Object.freeze(ids);

          const litterBirthday = litterData[G.litterBirthday],
            dueDate = litterData[G.dueDate];
          const calcInit = {
            litterBirthday: litterBirthday
              ? new Date(litterBirthday)
              : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          };
  return (
    <>
      <div className={css.top}>
        {mother[G.adultName] === "Unrecorded" ? (
          <MomHeadshot
            variant={D1T[G.Headshots_Sm]}
            className={css.momHeadshot}
            src={mother[G.Headshots_Sm]}
            alt="Mother Dog"
            gender="F"
            priority
          />
        ) : (
          <Link href={"dams/" + ids[G.litterId]}>
            <MomHeadshot
              variant={D1T[G.Headshots_Sm]}
              className={css.momHeadshot}
              src={mother[G.Headshots_Sm]}
              alt="Mother Dog"
              gender="F"
              priority
            />
          </Link>
        )}
        <h1 className={`${css.desktopOnly} ${css.heading}`}>
          <NextFamilyDate
            className={css.goingHome}
            calcInit={calcInit}
            availablePuppies={litterData[G.availablePuppies]}
          />
        </h1>
        {father[G.adultName] === "Unrecorded" ? (
          <UnrecordedDog
            variant={D1T[G.Headshots_Sm]}
            className={css.unrecordedDog}
            src={unrecordedDogIMG}
            alt="Father Dog"
            gender="U"
          />
        ) : (
          <Link href={"sires/" + ids[G.litterId]}>
            <DadHeadshot
              variant={D1T[G.Headshots_Sm]}
              className={css.dadHeadshot}
              src={father[G.Headshots_Sm]}
              alt="Father Dog"
              gender="M"
            />
          </Link>
        )}
      </div>
      <h1 className={`${css.mobileOnly} ${css.heading}`}>
        <NextFamilyDate
          className={css.goingHome}
          calcInit={calcInit}
          availablePuppies={litterData[G.availablePuppies]}
        />
      </h1>
      <div className={css.bottom}>
        {(() => {
          if (ids[G.Group_Photos])
            return (
              <GroupPhoto
                className={css.puppyGroup}
                src={ids[G.Group_Photos]}
                alt="Puppies"
                litterId={ids[G.litterId]}
                puppiesLeft={familyData.puppies}
              />
            );
          else {
            return (
              <CheckBackSoon litterId={ids[G.litterId]}/>
            );
          }
        })()}
      </div>
    </>
  );
}
