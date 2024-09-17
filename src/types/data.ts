import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";

/**
 * Provides an Object as a type for D1Table but sets all values to strings as they are
 * when extracted from D1 initially.
 **/
export type D1Stringify<T extends D1T> = { [K in keyof D1Schema[T]]: string };

/**
 * Provides an Object as a type for a D1 Table based on a provided string
 * extending the table names: T
 *
 * Primarily used to provide a type for the results of a query after some logic
 * has been applied to convert data to their correct types.
 **/
export type D1Parse<T extends D1T> = D1Schema[T];

export type D1Keys<T extends D1T> = keyof D1Schema[T];

/**Provides types for all values in a provided D1Table: T*/
export type D1Vals<T extends D1T, V extends D1Keys<T> = D1Keys<T>> = {
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

export interface D1GroupPhotos {
  readonly [G.transformUrl]: string;
  readonly [G.hash]: string;
  readonly [G.alt]: string | null;
}
export interface D1HeadshotsSm extends D1GroupPhotos {}
export interface D1HeadshotsLg extends D1GroupPhotos {}

export interface D1Litters {
  readonly [G.id]: number;
  /**If dueDate is not provided, Birthday should be.*/
  readonly [G.dueDate]: Date | null;
  /**If Birthday is not provided, dueDate should be.*/
  readonly [G.litterBirthday]: Date | null;
  readonly [G.applicantsInQueue]: number;
}

export interface D1Dogs {
  readonly [G.id]: number;
  readonly [G.gender]: "M" | "F";
  readonly [G.noseColor]: string | null;
  readonly [G.coat]: string | null;
  readonly [G.personality]: string | null;
  readonly [G.Headshots_Sm]: string | null;
  readonly [G.Headshots_Lg]: string | null;
}

export interface D1Adults {
  readonly [G.id]: number;
  readonly [G.adultName]: string | 'Adult Doodle';
  readonly [G.breeder]: string;
  readonly [G.adultBirthday]: Date | null;
  readonly [G.eyeColor]: string | null;
  readonly [G.activityStatus]: "Active" | "Retired" | "Break";
  readonly [G.favActivities]: string | null;
  readonly [G.weight]: number | null;
  readonly [G.energyLevel]:
    | "Low"
    | "Medium-low"
    | "Medium"
    | "Medium-high"
    | "High";
  readonly [G.certifications]: "Embark" | "Embark-equivalent" | null;
  readonly [G.dogId]: number;
}

export interface D1Puppies {
  readonly [G.id]: number;
  readonly [G.puppyName]: string | null;
  readonly [G.collarColor]: string | null;
  readonly [G.availability]: "Available" | "Picked" | "Adopted" | "Held Back";
  readonly [G.dogId]: number;
  readonly [G.litterId]: number;
}

export interface D1Families {
  readonly [G.id]: number;
  readonly [G.Group_Photos]: string;
  readonly [G.mother]: number;
  readonly [G.father]: number;
  readonly [G.litterId]: number;
}

export interface D1DogToGroupPhotos {
  readonly [G.id]: number;
  readonly [G.Group_Photos]: string;
  readonly [G.dogId]: number;
}

export type D1HeadshotsSmRaw = [string, string];
export type D1HeadshotsLgRaw = [string, string];
export type D1LittersRaw =
  /**prettier-ignore*/
  [
    number, //id
    Date | null, //dueDate
    Date | null, //litterBirthday
    number //applicantsInQueue
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
  string, //adultName
  string, //breeder
  Date, //adultBirthday
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
  "Available" | "Picked" | "Adopted" | "Held Back", //availability
  number, //dogId
  number //litterId
];
export type D1FamiliesRaw = [
  number, //id
  string, //Group_Photos
  number, //mother
  number, //father
  number //litterId
];
export type D1DogToGroupPhotosRaw = [
  number, //id
  string, //Group_Photos
  number //dogId
];
