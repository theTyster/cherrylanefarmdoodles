import { GlobalNameSpaces as G } from "./data";
import { normalizeEpochDate } from "thetyster-utils";

/**Should only be used by {@see DOG}*/
const DOG_NAMESPACES = {
  [G.adultBirthday]: G.adultBirthday,
  [G.litterBirthday]: G.litterBirthday,
  [G.dueDate]: G.dueDate,
  [G.mostRecentDate]: G.mostRecentDate,
} as const;

/**
 * Provides a local namespace for type literals borrowed from the GlobalNameSpaces.
 * A necessary step since Typescript doesn't seem to support deep nesting of computed object keys.
 *
 * @example
 * This would yield a type error on declaration:
 * type DOG = {
 * [DOG[G.adultBirthday]]: Date | null;
 * [DOG[G.litterBirthday]]?: Date | null;
 * [DOG[G.dueDate]]?: Date | null;
 * };
 **/
const DOG = {
  [G.adultBirthday]: DOG_NAMESPACES[G.adultBirthday],
  [G.litterBirthday]: DOG_NAMESPACES[G.litterBirthday],
  [G.dueDate]: DOG_NAMESPACES[G.dueDate],
  [G.mostRecentDate]: G.mostRecentDate,
} as const;

type DogDates = {
  readonly [DOG.adultBirthday]?: Date | null;
  readonly [DOG.litterBirthday]?: Date | null;
  readonly [DOG.dueDate]?: Date | null;
  readonly [DOG.mostRecentDate]?: Date | null;
};

/**
 * Calculates all dates relevant to information about the sale of puppies.
 *
 * @param dog - Dates related to the dog in question. Must atleast contain a birthday or dueDate, a Date object, or be a parameter that can be used to create a Date object.
 *
 * pickDay: The day the puppies chosen by approved buyers. 7 weeks after the litter's birthday.
 * goHome: The day the puppies go home with their new owners. 8 weeks after the litter's birthday.
 *
 * dueDate: The day the puppies are due to be born. This can be null if the litter is already born.
 * birthday: The day the puppies were born. This can be null if the litter is not yet born.
 *
 * currentDOB: Contains currently known information about the dog's birthday. It's value is the same as either birthday or dueDate depending on which is provided.
 * nextEvent: The next event in the puppy's life. If the puppies are not yet born, this is the due date. If the puppies are born, this is the pick day. If the pick day has passed, this is the go home day.
 **/
class DateCalculator extends Date {
  /**Should only be used by this class*/
  date!: Date;

  constructor(dog: DogDates | ConstructorParameters<typeof Date>[number]) {
    let dateInit: Date;
    let superInit: ConstructorParameters<typeof Date>[number];
    if (typeof dog === "string") {
      superInit = dog;
      dateInit = new Date(dog);
    } else if (typeof dog === "number") {
      superInit = dog;
      dateInit = new Date(dog);
    } else if (dog instanceof Date) {
      superInit = dog;
      dateInit = new Date(dog);
    } else {
      const adult = dog[DOG.adultBirthday];
      const litter = dog[DOG.litterBirthday];
      const due = dog[DOG.dueDate];
      const mostRecent = dog[DOG.mostRecentDate];

      // If the litter is born, the birthday is the most relevant date.
      if (litter && due) {
        superInit = litter;
        dateInit = new Date(litter);
      } else if (due) {
        superInit = due;
        dateInit = new Date(due);
      } else if (adult) {
        superInit = adult;
        dateInit = new Date(adult);
      } else if (litter) {
        superInit = litter;
        dateInit = new Date(litter);
      } else {
        if (!(adult || litter || due || mostRecent)) {
          throw new Error("No values were provided" + JSON.stringify(dog));
        }

        // If an adult dog parametr is combined with any of the puppy
        // parameters, throw.  ┻━┻ ヽ(°□°ヽ)
        if ((adult && litter) || (adult && due) || (adult && mostRecent))
          throw new Error(
            "Will not calculate dates for both an adult and puppies simultaneously. Provided: " +
              JSON.stringify(dog)
          );

        dateInit = new Date((mostRecent ?? litter ?? due ?? adult)!);
        superInit = dateInit;
      }
      dateInit = new Date((mostRecent ?? litter ?? due ?? adult)!);
      superInit = dateInit;
      super(superInit);
      this.date = dateInit;
    }
  }

  private _prettify(date: Date | "Available Now") {
    let prettified: string;
    if (date === "Available Now") return date;
    const now = new Date(Date.now());
    // If the date is using a different year, it should display the full date.
    if (now.getFullYear() !== new Date(date).getFullYear())
      prettified = normalizeEpochDate(date, "date-only");
    // If the date is the same as the current day, it should display "Today! 🎉"
    else if (
      new Date(date).toISOString().split("T")[0] ===
      now.toISOString().split("T")[0]
    )
      return "Today! 🎉";
    else {
      prettified = normalizeEpochDate(date, "date-only").split(",")[0];
    }
    if (prettified.includes(",")) return prettified;
    else if (prettified.endsWith("1") && !prettified.endsWith("11"))
      prettified += "st";
    else if (prettified.endsWith("2") && !prettified.endsWith("12"))
      prettified += "nd";
    else if (prettified.endsWith("3") && !prettified.endsWith("13"))
      prettified += "rd";
    // Case where the string ends in a year.
    else prettified += "th";
    return prettified;
  }

  prettified: {
    pickDay: string;
    goHome: string;
    currentDOB: string;
    nextEvent: string;
  } = {
    pickDay: this._prettify(this.pickDay),
    goHome: this._prettify(this.goHome),
    currentDOB: this._prettify(this.currentDOB),
    nextEvent: this._prettify(this.nextEvent as Date),
  };

  /**The Date 7 weeks after the litter's birthday.*/
  get pickDay(): Date {
    const curDOB = new Date(this.currentDOB);
    return new Date(curDOB.setDate(this.currentDOB.getDate() + 49));
  }

  /**The Date 8 weeks after the litter's birthday.*/
  get goHome(): Date {
    const curDOB = new Date(this.currentDOB);
    return new Date(curDOB.setDate(this.currentDOB.getDate() + 56));
  }

  /**
   * The current date of birth according to the most recently provide information.
   * If the dog is not yet born, this is the due date.
   **/
  get currentDOB(): Date {
    return this;
  }

  /**
   * The date of the next event that buyers should be aware of.
   * If all events are in the past, this will return "Available Now".
   **/
  get nextEvent(): Date | "Available Now" {
    if (!!this.goHome) {
      if (this.goHome.getTime() < Date.now()) return "Available Now";
    }

    if (!!this.pickDay)
      if (this.pickDay.getTime() < Date.now()) return this.goHome;

    // Default outcome
    return this.pickDay;
  }
}

export default DateCalculator;
