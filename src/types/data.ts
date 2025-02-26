import {
  GlobalNameSpaces as G,
  D1TablesType as D1TT,
  D1Tables as D1T,
  type PuppyAvailabilityType,
} from "@/constants/data";

/**
 * Provides an Object as a type for D1Table but sets all values to strings as they are
 * when extracted from D1 initially.
 **/
export type D1Stringify<T extends D1TT> = { [K in keyof D1Schema[T]]: string };

/**
 * Provides an Object as a type for a D1 Table based on a provided string
 * extending the table names: T
 *
 * Primarily used to provide a type for the results of a query after some logic
 * has been applied to convert data to their correct types.
 **/
export type D1Parse<T extends D1TT> = D1Schema[T];

export type D1Keys<T extends D1TT> = keyof D1Schema[T];

/**
 * @deprecated duplicate of D1Parse
 * Provides types for all values in a provided D1Table: T
 **/
export type D1Vals<T extends D1TT, V extends D1Keys<T> = D1Keys<T>> = {
  [Key in V]: D1Schema[T][V];
};

export type D1Schema = {
  readonly [D1T.Group_Photos]: D1GroupPhotos;
  readonly [D1T.Headshots_Sm]: D1HeadshotsSm;
  readonly [D1T.Headshots_Lg]: D1HeadshotsLg;
  readonly [D1T.Litters]: D1Litters;
  readonly [D1T.Dogs]: D1Dogs;
  readonly [D1T.Adults]: D1Adults;
  readonly [D1T.Puppies]: D1Puppies;
  readonly [D1T.Families]: D1Families;
  readonly [D1T.Dog_To_Group_Photos]: D1DogToGroupPhotos;
};

/**
 * Any value possible in a Photo Table.
 **/
export type PossibleD1PhotoVals = D1GroupPhotos[keyof D1GroupPhotos];
/**
 * Any value possible in the Litter Table.
 **/
export type PossibleD1LitterVals = D1Litters[keyof D1Litters];
/**
 * Any value possible in the Dogs Table.
 **/
export type PossibleD1DogVals = D1Dogs[keyof D1Dogs];
/**
 * Any value possible in the Adults Table.
 **/
export type PossibleD1AdultVals = D1Adults[keyof D1Adults];
/**
 * Any value possible in the Puppy Table.
 **/
export type PossibleD1PuppyVals = D1Puppies[keyof D1Puppies];
/**
 * Any value possible in the Family Table.
 **/
export type PossibleD1FamilyVals = D1Families[keyof D1Families];
/**
 * Any value possible in the D1DogToGroupPhotos Table.
 **/
export type PossibleD1DogToGroupPhotosVals =
  D1DogToGroupPhotos[keyof D1DogToGroupPhotos];
/**
 * Any value possible in the D1DogToGroupPhotos Table.
 **/
export type PossibleD1Vals =
  | PossibleD1PhotoVals
  | PossibleD1LitterVals
  | PossibleD1DogVals
  | PossibleD1AdultVals
  | PossibleD1PuppyVals
  | PossibleD1FamilyVals
  | PossibleD1DogToGroupPhotosVals;

export interface D1SchemaValTypes {
  readonly [D1T.Group_Photos]: PossibleD1PhotoVals;
  readonly [D1T.Headshots_Sm]: PossibleD1PhotoVals;
  readonly [D1T.Headshots_Lg]: PossibleD1PhotoVals;
  readonly [D1T.Litters]: PossibleD1LitterVals;
  readonly [D1T.Dogs]: PossibleD1DogVals;
  readonly [D1T.Adults]: PossibleD1AdultVals;
  readonly [D1T.Puppies]: PossibleD1PuppyVals;
  readonly [D1T.Families]: PossibleD1FamilyVals;
  readonly [D1T.Dog_To_Group_Photos]: PossibleD1DogToGroupPhotosVals;
}

// EXPLICIT SCHEMAS FOR D1 TABLES
export interface D1GroupPhotos {
  readonly [G.id]: string;
  readonly [G.alt]: string | null;
}
/**
 * An Array of strings that should match the keys of D1GroupPhotos.
 **/
export const D1GroupPhotosKeys = [G.id, G.alt] as const;
/**
 * Keys typed for D1GroupPhotos as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1GroupPhotosKeysType =
  (typeof D1GroupPhotosKeys)[number] extends keyof D1GroupPhotos
    ? typeof D1GroupPhotosKeys
    : never;

export type D1HeadshotsSm = D1GroupPhotos;
/**
 * An Array of strings that should match the keys of D1HeadshotsSm.
 **/
export const D1HeadshotsSmKeys = [G.id] as const;
/**
 * Keys typed for D1HeadshotsSm as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1HeadshotsSmKeysType =
  (typeof D1HeadshotsSmKeys)[number] extends keyof D1HeadshotsSm
    ? typeof D1HeadshotsSmKeys
    : never;

export type D1HeadshotsLg = D1GroupPhotos;
/**
 * An Array of strings that should match the keys of D1HeadshotsLg.
 **/
export const D1HeadshotsLgKeys = [G.id] as const;
/**
 * Keys typed for D1HeadshotsLg as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1HeadshotsLgKeysType =
  (typeof D1HeadshotsLgKeys)[number] extends keyof D1HeadshotsLg
    ? typeof D1HeadshotsLgKeys
    : never;

export interface D1Litters {
  readonly [G.id]: number;
  /**If dueDate is not provided, Birthday should be.*/
  readonly [G.dueDate]: string | null;
  /**If Birthday is not provided, dueDate should be.*/
  readonly [G.litterBirthday]: string | null;
  readonly [G.applicantsInQueue]: number;
  /**always returns either dueDate or litterBirthday*/
  readonly [G.mostRecentDate]: string;
}
/**
 * An Array of strings that should match the keys of D1Litters.
 **/
export const D1LittersKeys = [
  G.id,
  G.dueDate,
  G.litterBirthday,
  G.applicantsInQueue,
  G.mostRecentDate,
] as const;
/**
 * Keys typed for D1Litters as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1LittersKeysType =
  (typeof D1LittersKeys)[number] extends keyof D1Litters
    ? typeof D1LittersKeys
    : never;

export interface D1Dogs {
  readonly [G.id]: number;
  readonly [G.gender]: "M" | "F";
  readonly [G.noseColor]: string | null;
  readonly [G.coat]: string | null;
  readonly [G.personality]: string | null;
  readonly [G.Headshots_Sm]: string | null;
  readonly [G.Headshots_Lg]: string | null;
}
/**
 * An Array of strings that should match the keys of D1Dogs.
 **/
export const D1DogsKeys = [
  G.id,
  G.gender,
  G.noseColor,
  G.coat,
  G.personality,
  G.Headshots_Sm,
  G.Headshots_Lg,
] as const;
/**
 * Keys typed for D1Dogs as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1DogsKeysType = (typeof D1DogsKeys)[number] extends keyof D1Dogs
  ? typeof D1DogsKeys
  : never;

export interface D1Adults {
  readonly [G.id]: number;
  readonly [G.adultName]: string | "Adult Doodle";
  readonly [G.breeder]: string;
  readonly [G.adultBirthday]: string | null;
  readonly [G.eyeColor]: string | null;
  readonly [G.activityStatus]: "Active" | "Retired" | "Break";
  readonly [G.favActivities]: string | null;
  readonly [G.weight]: number | null;
  readonly [G.energyLevel]:
    | "Low"
    | "Medium-low"
    | "Medium"
    | "Medium-high"
    | "High"
    | null;
  readonly [G.certifications]: "Embark" | "Embark-equivalent" | null;
  readonly [G.dogId]: number;
}
/**
 * An Array of strings that should match the keys of D1Adults.
 **/
export const D1AdultsKeys = [
  G.id,
  G.adultName,
  G.breeder,
  G.adultBirthday,
  G.eyeColor,
  G.activityStatus,
  G.favActivities,
  G.weight,
  G.energyLevel,
  G.certifications,
  G.dogId,
] as const;
/**
 * Keys typed for D1Adults as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1AdultsKeysType =
  (typeof D1AdultsKeys)[number] extends keyof D1Adults
    ? typeof D1AdultsKeys
    : never;

export interface D1Puppies {
  readonly [G.id]: number;
  readonly [G.puppyName]: string | null;
  readonly [G.collarColor]: string | null;
  readonly [G.availability]: PuppyAvailabilityType;
  readonly [G.dogId]: number;
  readonly [G.litterId]: number;
}
/**
 * An Array of strings that should match the keys of D1Puppies.
 **/
export const D1PuppiesKeys = [
  G.id,
  G.puppyName,
  G.collarColor,
  G.availability,
  G.dogId,
  G.litterId,
] as const;
/**
 * Keys typed for D1Puppies as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1PuppiesKeysType =
  (typeof D1PuppiesKeys)[number] extends keyof D1Puppies
    ? typeof D1PuppiesKeys
    : never;

export interface D1Families {
  readonly [G.id]: number;
  readonly [G.Group_Photos]: string | null;
  readonly [G.mother]: number;
  readonly [G.father]: number;
  readonly [G.litterId]: number;
}
export const D1FamiliesKeys = [
  G.id,
  G.Group_Photos,
  G.mother,
  G.father,
  G.litterId,
] as const;
/**
 * Keys typed for D1Families as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1FamiliesKeysType =
  (typeof D1FamiliesKeys)[number] extends keyof D1Families
    ? typeof D1FamiliesKeys
    : never;

export interface D1DogToGroupPhotos {
  readonly [G.id]: number;
  readonly [G.Group_Photos]: string | null;
  readonly [G.dogId]: number;
}
/**
 * An Array of strings that should match the keys of D1DogToGroupPhotos.
 **/
export const D1DogToGroupPhotosKeys = [G.id, G.Group_Photos, G.dogId] as const;
/**
 * Keys typed for D1DogToGroupPhotos as though they were accessed with Object.keys()
 * after retrieving them from the database.
 **/
export type D1DogToGroupPhotosKeysType =
  (typeof D1DogToGroupPhotosKeys)[number] extends keyof D1DogToGroupPhotos
    ? typeof D1DogToGroupPhotosKeys
    : never;

/**
 * An Object that maps D1Table names to an array of strings that should match the keys
 * of that table.
 **/
export const D1SchemaKeys = {
  [D1T.Group_Photos]: D1GroupPhotosKeys,
  [D1T.Headshots_Sm]: D1HeadshotsSmKeys,
  [D1T.Headshots_Lg]: D1HeadshotsLgKeys,
  [D1T.Litters]: D1LittersKeys,
  [D1T.Dogs]: D1DogsKeys,
  [D1T.Adults]: D1AdultsKeys,
  [D1T.Puppies]: D1PuppiesKeys,
  [D1T.Families]: D1FamiliesKeys,
  [D1T.Dog_To_Group_Photos]: D1DogToGroupPhotosKeys,
} as const;
export type D1SchemaKeyTypes = typeof D1SchemaKeys[D1TT][number];

// TYPES FOR RAW DATA
export type D1HeadshotsSmRaw = [string, string];
export type D1HeadshotsLgRaw = [string, string];
export type D1LittersRaw =
  /**prettier-ignore*/
  [
    number, //id
    string | null, //dueDate
    string | null, //litterBirthday
    number, //applicantsInQueue
    string //mostRecentDate
  ];
export type D1DogsRaw = [
  number, //id
  "M" | "F", //gender
  string | null, //noseColor
  string | null, //coatColor
  string, //personality
  string | null, //Headshots_Sm
  string | null //Headshots_Lg
];
export type D1AdultsRaw = [
  number, //id
  string | "Adult Doodle", //adultName
  string, //breeder
  string, //adultBirthday
  string, //eyeColor
  "Active" | "Retired" | "Break", //activityStatus
  string, //favActivities
  number, //weight
  string, //energyLevel
  number //dogId
];
export type D1PuppiesRaw = [
  number, //id
  string, //puppyName
  string | null, //collarColor
  PuppyAvailabilityType, //availability
  number, //dogId
  number //litterId
];
export type D1FamiliesRaw = [
  number, //id
  string | null, //Group_Photos
  number, //mother
  number, //father
  number //litterId
];
export type D1DogToGroupPhotosRaw = [
  number, //id
  string | null, //Group_Photos
  number //dogId
];
