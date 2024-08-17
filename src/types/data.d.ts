interface D1GroupPhotos {
  readonly transformUrl: string;
  readonly hash: string;
  readonly alt: string | null;
}
interface D1HeadshotsSm extends D1GroupPhotos{}
interface D1HeadshotsLg extends D1GroupPhotos{}

interface D1Litters {
  readonly id: number;
  readonly dueDate: Date;
  readonly litterBirthday: Date | null;
  readonly applicantsInQueue: number;
}

interface D1LittersWithQueue extends D1Litters {
  readonly availablePuppies: number;
  readonly litterBirthday: string | Date;
}

interface D1Dogs  {
  readonly id: number;
  readonly gender: "M" | "F";
  readonly noseColor: string;
  readonly coatColor: string;
  readonly personality: string;
  readonly Headshots_Sm: string | null;
  readonly Headshots_Lg: string | null;
}

interface D1Adults {
  readonly id: number;
  readonly adultName: string;
  readonly breeder: string;
  readonly adultBirthday: Date;
  readonly eyeColor: string;
  readonly isRetired: 0 | 1;
  readonly favActivities: string;
  readonly weight: number;
  readonly energyLevel: string;
  readonly dogId: number;
}

interface D1Puppies {
  readonly id: number;
  readonly puppyName: string | null;
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
    Date,   //litterBirthday
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
    Date,    //adultBirthday
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
