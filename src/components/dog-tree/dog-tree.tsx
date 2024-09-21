// Styling
import Theme from "@/styles/theme.module.scss";
import css from "@/styles/dog-tree.module.scss";

// Components
import GroupPhoto from "../GroupPhoto/GroupPhoto";
import Link from "next/link";
import MomHeadshot from "@/components/Headshots/Headshots";
import DadHeadshot from "@/components/Headshots/Headshots";

// Constants
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { normalizeEpochDate } from "thetyster-utils";
import DateCalculator from "@/constants/dates";

// Types
import type { DogTreeData } from "@/types/dog-tree";

export const runtime = "edge";

export default async function DogTree({
  familyData,
}: {
  familyData: DogTreeData;
}) {
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

  const saveTheDate = () => {

    const now = new Date().getTime();
      const birthday = litterData[G.litterBirthday];
      const dueDate = litterData[G.dueDate];
      const calc = new DateCalculator({
        litterBirthday: birthday,
        dueDate,
      });

      console.log(calc.currentDOB);
      const specialDay = calc.getTime();

    // If the litter is unborn, it should display the due date.
    // The litter is unborn.
    if (now < specialDay)
      return (
        <>
          <div className={css.goingHome}>Due on</div>
          {calc.prettified.currentDOB}
        </>
      );
    // If the litter is born and the pick date is in the future, it should
    // display the pick date which is 7 weeks after the birthdate.
    else if (now <= new Date(calc.nextEvent).getTime())
      return (
        <>
          <div className={css.goingHome}>Pick Day is</div>
          {calc.prettified.pickDay}
        </>
      );
    // If the litter is born, and the pick date has passed, it should display
    // the going home date which is 8 weeks after the birthdate.
    else if (now <= new Date(calc.nextEvent).getTime())
      return (
        <>
          <div className={css.goingHome}>Going Home</div>
          {calc.prettified.goHome}
        </>
      );
    // if the litter is born, and the going home date has passed, and there are
    // still puppies available, it should display "Available Now".
    else if (litterData[G.availablePuppies])
      return (
        <>
          <div className={css.goingHome}>Available</div>
          Now
        </>
      );
    // if the litter is born, and the going home date has passed, and there are
    // no puppies available it should display "All Puppies are in their furever
    // homes. Sign up for the next litter from this mother!"
    else
      return (
        <>
          <div className={css.goingHome}>
            All puppies are in their furever homes
          </div>
          Sign up for the next litter from this mother
        </>
      );
  };

  return (
    <>
      <div className={css.top}>
        <Link href={"dams/" + ids[G.litterId]}>
          <MomHeadshot
            variant={D1T[G.Headshots_Sm]}
            className={css.momHeadshot}
            src={mother[G.Headshots_Sm]}
            alt="Mother Dog"
            gender="F"
          />
        </Link>
        <h1 className={`${Theme.desktopOnly} ${css.heading}`}>
          {saveTheDate()}
        </h1>
        <Link href={"sires/" + ids[G.litterId]}>
          <DadHeadshot
            variant={D1T[G.Headshots_Sm]}
            className={css.dadHeadshot}
            src={father[G.Headshots_Sm]}
            alt="Father Dog"
            gender="M"
          />
        </Link>
      </div>
      <h1 className={`${Theme.mobileOnly} ${css.heading}`}>{saveTheDate()}</h1>
      <div className={css.bottom}>
        <GroupPhoto
          className={css.puppyGroup}
          src={ids[G.Group_Photos]}
          alt="Puppies"
          litterId={ids[G.litterId]}
        />
      </div>
    </>
  );
}
