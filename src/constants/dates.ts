import { GlobalNameSpaces as G } from "./data";
import { normalizeEpochDate } from "thetyster-utils";

/**Should only be used by {@see DOG}*/
const DOG_NAMESPACES = {
  [G.adultBirthday]: G.adultBirthday,
  [G.litterBirthday]: G.litterBirthday,
  [G.dueDate]: G.dueDate,
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
} as const;

type DogDates = {
  readonly [DOG.adultBirthday]?: Date | null;
  readonly [DOG.litterBirthday]?: Date | null;
  readonly [DOG.dueDate]?: Date | null;
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
 *
 * NOTE:
 * Both DueDate and Birthday cannot be null. If DueDate is not provided, Birthday should be.
 **/
class DateCalculator extends Date {
  //pickDay: Date;
  //goHome: Date;

  //dueDate: Date;
  //birthday: Date;

  //currentDOB: Date;
  //nextEvent: Date;

  /**Should only be used by this class*/
  // The ! operator is used to tell the compiler that the variable is not null
  // or undefined. It is used to suppress the strict null check in TypeScript.
  //
  // In this case, I am using it to bypass build errors. This won't be an
  // issue since this class is not in use currently. I am actually not sure if
  // the _dog property is ever null since it appears to be the source of a few
  // errors.
  private _dog!: DogDates;
  date: Date;

  constructor(dog: DogDates | ConstructorParameters<typeof Date>[number]) {
    super();
    if (typeof dog === "string") {
      this.date = new Date(dog);
    } else if (typeof dog === "number") {
      this.date = new Date(dog);
    } else if (dog instanceof Date) {
      this.date = new Date(dog);
    } else {
      const adult = dog[DOG.adultBirthday];
      const litter = dog[DOG.litterBirthday];
      const due = dog[DOG.dueDate];

      // If the litter is born, the birthday is the most relevant date.
        if (litter && due) {
        this._dog = dog;
        this.date = new Date(litter);
        return;
      } else if (due) {
        this._dog = dog;
        this.date = new Date(due);
        return;
      } else if (adult) {
        this._dog = dog;
        this.date = new Date(adult);
        return;
      } else if (litter) {
        this._dog = dog;
        this.date = new Date(litter);
        return;
      } else {

      if (!adult && !litter && !due) 
        throw new Error(
          "Must have a birthday or due date to calculate dates. Provided: " +
            JSON.stringify(dog)
        );

      if (!adult && !due)
        throw new Error(
          "Must have a birthday or due date to calculate dates. Provided: " +
            JSON.stringify(dog)
        );

      if (adult && litter)
        throw new Error(
          "Will not calculate dates for both an adult and puppies simultaneously. Provided: " +
            JSON.stringify(dog)
        );

      if (adult && due)
        throw new Error(
          "Will not calculate dates for both an adult and puppies simultaneously. Provided: " +
            JSON.stringify(dog)
        );
      }
        this._dog = dog;
    }
        this.date = new Date(0);
        this._handleError();

  }

  /**
   * Returns a callback or a message.
   * The message provides the data the class was instantiated with and it's current values as well as which method through the error.
   * */
  private _handleError<T>(callback?: () => T) {
    const msg =
      "\nDateCalculator was instantiated incorrectly. \n Provided: \n" +
      JSON.stringify(this._dog) +
      "\n\nWhich returned: \n" +
      this +
      "\n\n" +
      new Error().stack;
    console.error(msg);
    if (callback) return callback() as T;
    else return msg as unknown as T;
  }

  private prettify(date: Date) {
    const now = new Date(Date.now());
    // If the date is using a different year, it should display the full date.
    if (now.getFullYear() !== new Date(date).getFullYear())
      return normalizeEpochDate(date, "date-only");
    // If the date is the same as the current day, it should display "Today! 🎉"
    else if (
      new Date(date).toISOString().split("T")[0] ===
      now.toISOString().split("T")[0]
    )
      return "Today! 🎉";
    else return normalizeEpochDate(date, "date-only").split(",")[0];
  }

  prettified: {
    pickDay: string;
    //goHome: string;
    //dueDate: string;
    //birthday: string;
    //currentDOB: string;
    //nextEvent: string;
  } = {
    pickDay: this.prettify(this.pickDay),
    //goHome: this.prettify(this.goHome),
    //dueDate: this.prettify(this.dueDate!),
    //birthday: this.prettify(this.birthday),
    //currentDOB: this.prettify(this.currentDOB),
    //nextEvent: this.prettify(this.nextEvent as Date),
  };

  /**The Date 7 weeks after the litter's birthday.*/
  get pickDay(): Date {
    return new Date(this.currentDOB.setDate(this.currentDOB.getDate() + 49));
  }

  /**The Date 8 weeks after the litter's birthday.*/
  get goHome(): Date {
    return new Date(this.currentDOB.setDate(this.currentDOB.getDate() + 56));
  }

  /**
   * The current date of birth according to the most recently provide information.
   * If the dog is not yet born, this is the due date.
   **/
  get currentDOB(): Date {
    return this.birthday ?? this.dueDate;
  }

  /**The Date the puppies were expected to be born.*/
  get dueDate(): Date | null {
    return this._dog?.[DOG.dueDate] ?? null;
  }

  /**The Date the puppies were born. If an adult was provided, then the date of the adults birthday.*/
  get birthday(): Date {
    // FIXME:
    // SOMETHING IN THIS GETTER IS BREAKING.
    // IT HAS TO DO WITH THE WAY THE CLASS IS INSTANTIATED. THE TYPE GUARDS ARE NOT INCLUSIVE ENOUGH.
    console.log('dog', this._dog);
    return (
      this._dog[DOG.litterBirthday] ??
      this._dog[DOG.adultBirthday] ??
      this._handleError<Date>(() => new Date(0))
    );
  }

  /**
   * The date of the next event that buyers should be aware of.
   * If all events are in the past, this will return "Available Now!".
   **/
  get nextEvent(): Date | "Available Now!" {
    if (!!this.goHome) {
      if (this.goHome.getTime() < Date.now()) return "Available Now!";
    }

    if (!!this.pickDay)
      if (this.pickDay.getTime() < Date.now()) return this.goHome;

    if (this.birthday) return this.pickDay;
    else if (this.dueDate) return this.dueDate;
    else {
      this._handleError();
      return this.pickDay;
    }
  }
}

//// Test data I should probably just write actual tests. But whenever I do that it takes all day long.
//// We'll see if this is faster.
//const datestring = "2012-01-01";
//const dummydogAdult = {
//  [DOG.adultBirthday]: new Date(datestring),
//};
//dummydogAdult;
//
//const dummydogLitter = {
//  [DOG.litterBirthday]: new Date(datestring),
//  [DOG.dueDate]: new Date(datestring),
//};
//dummydogLitter;
//
//const dateobj = new Date(datestring);
//dateobj;
//
//const param = dummydogAdult;
//
export default DateCalculator;
//const test = new DateCalculator(param);
//export const D = test.nextEvent;
