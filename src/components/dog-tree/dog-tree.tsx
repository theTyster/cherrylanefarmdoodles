// Styling
import Theme from "@/styles/theme.module.scss";
import css from "@/styles/dog-tree.module.scss";

// Components
import CLFImage from "../CLFImage/CLFImage";
import Link from "next/link";
import MomHeadshot from "@/components/Headshots/Headshots";
import DadHeadshot from "@/components/Headshots/Headshots";

// Constants
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { normalizeEpochDate } from "thetyster-utils";

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

  const saveTheDate = () => {
    /**The next relevant day. Either due Date or Birthday.*/
    const specialDay = () =>
      litterData.litterBirthday
        ? litterData.litterBirthday
        : litterData.dueDate;
    const now = new Date();
    /**The date of the next event being reported by this function.*/
    const nextEvent = (ffw: 49 | 56) =>
      new Date().setDate((specialDay().getDate() + ffw));

    // Formats the date based on the current date.
    const dateFormat = (date: Date | number) => {
      // If the date is using a different year, it should display the full date.
      if (now.getFullYear() !== new Date(date).getFullYear())
        return normalizeEpochDate(specialDay(), "date-only");
      // If the date is the same as the current day, it should display "Today! 🎉"
      else if (
        new Date(date).toISOString().split("T")[0] ===
        now.toISOString().split("T")[0]
      )
        return "Today! 🎉";
      else return normalizeEpochDate(date, "date-only").split(",")[0];
    };

    // If the litter is unborn, it should display the due date.
    // The litter is unborn.
    if (now < specialDay())
      return (
        <>
          <div className={css.goingHome}>Due on</div>
          {dateFormat(specialDay())}
        </>
      );
    // If the litter is born and the pick date is in the future, it should
    // display the pick date which is 7 weeks after the birthdate.
    else if (now.getDate() <= nextEvent(49))
      return (
        <>
          <div className={css.goingHome}>Pick Day is</div>
          {dateFormat(nextEvent(49))}
        </>
      );
    // If the litter is born, and the pick date has passed, it should display
    // the going home date which is 8 weeks after the birthdate.
    else if (now.getDate() <= nextEvent(56))
      return (
        <>
          <div className={css.goingHome}>Going Home</div>
          {dateFormat(nextEvent(56))}
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
        <Link href={"dams/" + ids[G.mother]}>
          <MomHeadshot
            largeOrSmall={D1T[G.Headshots_Sm]}
            src={mother[G.Headshots_Sm]}
            alt="Mother Dog"
            gender="F"
          />
        </Link>
        <h1 className={`${Theme.desktopOnly} ${css.heading}`}>
          {saveTheDate()}
        </h1>
        <Link href={"sires/" + ids[G.father]}>
          <DadHeadshot
            largeOrSmall={D1T[G.Headshots_Sm]}
            src={father[G.Headshots_Sm]}
            alt="Father Dog"
            gender="M"
          />
        </Link>
      </div>
      <h1 className={`${Theme.mobileOnly} ${css.heading}`}>
        {saveTheDate()}
      </h1>
      <div className={css.bottom}>
        <CLFImage
          className={css.puppyGroup}
          src={ids[G.Group_Photos]}
          alt="Puppies"
          width={600}
          height={400}
        />
      </div>
    </>
  );
}
