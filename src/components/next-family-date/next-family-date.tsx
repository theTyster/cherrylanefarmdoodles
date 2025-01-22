"use client";

// Constants
import DateCalculator from "@/constants/dates";

/**
 * @deprecated This component should be replaced with the date calculator's
 * nextEvent property.
 **/
function NextFamilyDate({
  leade,
  calcInit,
  availablePuppies,
  className,
  style,
}: {
  leade?: string;
  calcInit: ConstructorParameters<typeof DateCalculator>[0];
  availablePuppies: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!leade) leade = "";

  const calc = new DateCalculator(calcInit);
  const now = new Date().getTime();

  const specialDay = calc.getTime();

  // If the litter is unborn, it should display the due date.
  // The litter is unborn.
  if (now < specialDay)
    return (
      <>
        <div style={style} className={className}>
          {`${leade} `}Due on
        </div>
        {calc.prettified.currentDOB}
      </>
    );
  // If the litter is born and the pick date is in the future, it should
  // display the pick date which is 7 weeks after the birthdate.
  else if (now <= new Date(calc.nextEvent.date).getTime())
    return (
      <>
        <div style={style} className={className}>
          {`${leade} `}Pick Day is
        </div>
        {calc.prettified.pickDay}
      </>
    );
  // If the litter is born, and the pick date has passed, it should display
  // the going home date which is 8 weeks after the birthdate.
  else if (now <= new Date(calc.nextEvent.date).getTime())
    return (
      <>
        <div style={style} className={className}>
          {`${leade} `}Going Home
        </div>
        {calc.prettified.goHome}
      </>
    );
  // if the litter is born, and the going home date has passed, and there are
  // still puppies available, it should display "Available Now".
  else if (availablePuppies > 0)
    return (
      <>
        <div style={style} className={className}>
          {`${leade} `}Available
        </div>
        Now
      </>
    );
  // if the litter is born, and the going home date has passed, and there are
  // no puppies available it should display "All Puppies are in their furever
  // homes. Sign up for the next litter from this mother!"
  else if (availablePuppies === 0)
    return (
      <>
        <div style={style} className={className}>
          All puppies are
        </div>
        in their furever homes
      </>
    );
  else {
    return (
      <>
        <div style={style} className={className}>
        &lt;!-- There was an error --&gt;
        </div>
      </>
    );
  }
}

export default NextFamilyDate;
