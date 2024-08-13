
// Data Types {
interface DogTreeData {
  readonly groupPhoto: string;
  readonly mother: string;
  readonly father: string;
  readonly dueDate: Date;
}

type DogTreeDataMapObj = Record<string, number> | Record<number, string>;

type DogTreeDataMap = Map<DogTreeDataMapObj, DogTreeDataDeconstructed>;
type D1_TABLES<T> =
  T extends "Group_Photos" ? D1GroupPhotosRaw :
  T extends "Headshots_Sm" ? D1HeadshotsSmRaw :
  T extends "Headshots_Lg" ? D1HeadshotsLgRaw :
  T extends "Litters" ? D1LittersRaw :
  T extends "Dogs" ? D1DogsRaw :
  T extends "Adults" ? D1AdultsRaw :
  T extends "Puppies" ? D1PuppiesRaw :
  T extends "Families" ? D1FamiliesRaw :
  T extends "Dog_To_Group_Photos" ? D1DogToGroupPhotosRaw : never;

type D1Table<T = [number, string]> = T extends ArrayOf<
  number | string | boolean
>
  ? T[]
  : [T][];

type D1GroupPhotosRaw = [string, string];
type D1HeadshotsSmRaw = [string, string];
type D1HeadshotsLgRaw = [string, string];
type D1LittersRaw =
  /**prettier-ignore*/
  [
    number, //id
    Date,   //dueDate
    Date,   //birthday
    number  //applicantsInQueue
  ]
;
type D1DogsRaw =
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
type D1AdultsRaw =
  /**prettier-ignore*/
  [
    number,  //id
    string,  //adultName
    string,  //breeder
    Date,    //birthday
    string,  //eyeColor
    0 | 1,   //isRetired
    string,  //favActivities
    number,  //weight
    string,  //energyLevel
    number   //dogId
  ]
;
type D1PuppiesRaw =
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
type D1FamiliesRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number, //mother
    number, //father
    number  //litterId
  ]
;
type D1DogToGroupPhotosRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number  //dogId
  ]
;
// }
interface D1GroupPhotos {
  readonly transformUrl: string;
  readonly hash: string;
  readonly alt: string;
}
interface D1HeadshotsSm extends D1GroupPhotos{}
interface D1HeadshotsLg extends D1GroupPhotos{}

interface D1Litters {
  readonly id: number;
  readonly dueDate: Date;
  readonly birthday: Date;
  readonly applicantsInQueue: number;
}

interface D1Dogs {
  readonly id: number;
  readonly gender: "M" | "F";
  readonly noseColor: string;
  readonly coatColor: string;
  readonly personality: string;
  readonly Headshots_Sm: string;
  readonly Headshots_Lg: string;
}

interface D1Adults {
  readonly id: number;
  readonly adultName: string;
  readonly breeder: string;
  readonly birthday: Date;
  readonly eyeColor: string;
  readonly isRetired: 0 | 1;
  readonly favActivities: string;
  readonly weight: number;
  readonly energyLevel: string;
  readonly dogId: number;
}

interface D1Puppies {
  readonly id: number;
  readonly puppyName: string;
  readonly collarColor: string;
  readonly isAvailable: boolean;
  readonly dogId: number;
  readonly litterId: number;
}

interface D1Families {
  readonly id: number;
  readonly Group_Photos: string;
  readonly mother: number;
  readonly father: number;
  readonly litterId: number;
}

interface D1DogToGroupPhotos {
  readonly id: number;
  readonly Group_Photos: string;
  readonly dogId: number;
}

type D1HeadshotsSmRaw = [string, string];
type D1HeadshotsLgRaw = [string, string];
type D1LittersRaw =
  /**prettier-ignore*/
  [
    number, //id
    Date,   //dueDate
    Date,   //birthday
    number  //applicantsInQueue
  ]
;
type D1DogsRaw =
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
type D1AdultsRaw =
  /**prettier-ignore*/
  [
    number,  //id
    string,  //adultName
    string,  //breeder
    Date,    //birthday
    string,  //eyeColor
    0 | 1,   //isRetired
    string,  //favActivities
    number,  //weight
    string,  //energyLevel
    number   //dogId
  ]
;
type D1PuppiesRaw =
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
type D1FamiliesRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number, //mother
    number, //father
    number  //litterId
  ]
;
type D1DogToGroupPhotosRaw =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number  //dogId
  ]
;
// }
