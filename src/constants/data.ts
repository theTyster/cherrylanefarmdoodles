export const D1Tables = {
  Group_Photos: "Group_Photos",
  Headshots_Sm: "Headshots_Sm",
  Headshots_Lg: "Headshots_Lg",
  Litters: "Litters",
  Dogs: "Dogs",
  Adults: "Adults",
  Puppies: "Puppies",
  Families: "Families",
  Dog_To_Group_Photos: "Dog_To_Group_Photos",
} as const;

/**
 * All Tables in the D1 Database.
 * @see D1Tables;
 **/
export type D1TablesType = keyof typeof D1Tables;

export const GlobalNameSpaces = {
  id: "id",
  /**@deprecated use litterBirthday or adultBirthday*/
  birthday: "litterBirthday",
  /**@deprecated use 'coat'*/
  coatColor: "coat",
  /**@deprecated use 'availability'*/
  isAvailable: "availability",
  /**@deprecated use 'activityStatus'*/
  isRetired: "activityStatus",

  /**Primarily used in D1 Image Tables*/
  transformUrl: "transformUrl",
  /**@deprecated use transformUrl*/
  hash: "transformUrl",
  /**Only available in D1 Group_Photos*/
  alt: "alt",

  /**Primarily used in D1 Litters*/
  dueDate: "dueDate",
  /**Primarily used in D1 Litters*/
  litterBirthday: "litterBirthday",
  /**Primarily used in D1 Litters*/
  applicantsInQueue: "applicantsInQueue",
  /**Primarily used in D1 Litters*/
  mostRecentDate: "mostRecentDate",

  /**Primarily used in D1 Dogs*/
  gender: "gender",
  /**Primarily used in D1Dogs*/
  coat: "coat",
  /**Primarily used in D1Dogs*/
  noseColor: "noseColor",
  /**Primarily used in D1Dogs*/
  personality: "personality",
  /**Alias for D1T.Headshots_Lg*/
  [D1Tables.Headshots_Lg]: D1Tables.Headshots_Lg,
  /**Alias for D1T.Headshots_Sm*/
  [D1Tables.Headshots_Sm]: D1Tables.Headshots_Sm,

  /**Primarily used in D1 Adults*/
  adultName: "adultName",
  /**Primarily used in D1 Adults*/
  adultBirthday: "adultBirthday",
  /**Primarily used in D1 Adults*/
  breeder: "breeder",
  /**Primarily used in D1 Adults*/
  eyeColor: "eyeColor",
  /**Primarily used in D1 Adults*/
  activityStatus: "activityStatus",
  /**Primarily used in D1 Adults*/
  favActivities: "favActivities",
  /**Primarily used in D1 Adults*/
  weight: "weight",
  /**Primarily used in D1 Adults*/
  energyLevel: "energyLevel",
  /**Primarily used in D1 Adults*/
  dogId: "dogId",
  /**Primarily used in D1 Adults*/
  certifications: "certifications",

  /**Primarily used in D1 Puppies*/
  puppyId: "puppyId",
  /**Primarily used in D1 Puppies*/
  puppyName: "puppyName",
  /**Primarily used in D1 Puppies*/
  collarColor: "collarColor",
  availability: "availability",
  /**Primarily used in D1 Puppies*/
  litterId: "litterId",

  /**Primarily used in D1 Families*/
  mother: "mother",
  /**Primarily used in D1 Families*/
  father: "father",

  /**Calculated value from D1 Puppies and Litters*/
  availablePuppies: "availablePuppies",
  /**Calculated value from D1 Puppies and Litters*/
  totalPuppies: "totalPuppies",

  /**Used by anything referencing a generic picture of a Dog that is not a
   * headshot. Alias for D1T.Group_Photos*/
  [D1Tables.Group_Photos]: D1Tables.Group_Photos,
} as const;
/**
 * Namespaces that are used in multiple places across the website.
 **/
export type GlobalNameSpacesType = keyof typeof GlobalNameSpaces;

/**Possible values for Puppy Availability*/
export const PuppyAvailability = {
  Available: "Available",
  Picked: "Picked",
  Adopted: "Adopted",
  ["Available Guardian"]: "Available Guardian",
} as const;
export type PuppyAvailabilityType = typeof PuppyAvailability[keyof typeof PuppyAvailability];

