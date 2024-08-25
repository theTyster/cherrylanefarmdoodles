import { GlobalNameSpaces as G } from "@/constants/data"; 

export interface D1GroupPhotos {
  readonly [G.transformUrl]: string;
  readonly [G.hash]: string;
  readonly [G.alt]: string | null;
}
export interface D1HeadshotsSm extends D1GroupPhotos{}
export interface D1HeadshotsLg extends D1GroupPhotos{}

export interface D1Litters {
  readonly [G.id]: number;
  readonly [G.dueDate]: Date;
  readonly [G.litterBirthday]: Date | null;
  readonly [G.applicantsInQueue]: number;
}

export interface D1Dogs  {
  readonly [G.id]: number;
  readonly [G.gender]: "M" | "F";
  readonly [G.noseColor]: string;
  readonly [G.coatColor]: string;
  readonly [G.personality]: string;
  readonly [G.Headshots_Sm]: string | null;
  readonly [G.Headshots_Lg]: string | null;
}

export interface D1Adults {
  readonly [G.id]: number;
  readonly [G.adultName]: string;
  readonly [G.breeder]: string;
  readonly [G.adultBirthday]: Date;
  readonly [G.eyeColor]: string;
  readonly [G.isRetired]: 0 | 1;
  readonly [G.favActivities]: string;
  readonly [G.weight]: number;
  readonly [G.energyLevel]: string;
  readonly [G.dogId]: number;
}

export interface D1Puppies {
  readonly [G.id]: number;
  readonly [G.puppyName]: string | null;
  readonly [G.collarColor]: string;
  readonly [G.isAvailable]: boolean;
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
    Date,   //dueDate
    Date,   //litterBirthday
    number  //applicantsInQueue
  ]
;
export type D1DogsRaw =
  /**prettier-ignore*/
  [
    number,    //id
    "M" | "F", //gender
    string, //noseColor
    string, //coatColor
    string, //personality
    string, //Headshots_Sm
    string  //Headshots_Lg
  ]
;
export type D1AdultsRaw =
  /**prettier-ignore*/
  [
    number,  //id
    string,  //adultName
    string,  //breeder
    Date,    //adultBirthday
    string,  //eyeColor
    0 | 1,   //isRetired
    string,  //favActivities
    number,  //weight
    string,  //energyLevel
    number   //dogId
  ]
;
export type D1PuppiesRaw =
  /**prettier-ignore*/
  [
    number,  //id
    string,  //puppyName
    string,  //collarColor
    boolean, //isAvailable
    number,  //dogId
    number   //litterId
  ]
;
export type D1FamiliesRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number, //mother
    number, //father
    number  //litterId
  ]
;
export type D1DogToGroupPhotosRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number  //dogId
  ]
;
