// Data Types {
interface DogTreeData {
  readonly groupPhoto: string;
  readonly mother: string;
  readonly father: string;
  readonly dueDate: string;
}

type DogTreeDataMapObj = Record<string, number> | Record<number, string>;

type DogTreeDataMap = Map<DogTreeDataMapObj, DogTreeDataDeconstructed>;
type D1_TABLES<T> =
  T extends "Group_Photos" ? D1GroupPhotos :
  T extends "Headshots_Sm" ? D1HeadshotsSm :
  T extends "Headshots_Lg" ? D1HeadshotsLg :
  T extends "Litters" ? D1Litters :
  T extends "Dogs" ? D1Dogs :
  T extends "Adults" ? D1Adults :
  T extends "Puppies" ? D1Puppies :
  T extends "Families" ? D1Families :
  T extends "Dog_To_Group_Photos" ? D1DogToGroupPhotos : never;

type D1Table<T = [number, string]> = T extends ArrayOf<
  number | string | boolean
>
  ? T[]
  : [T][];

type D1GroupPhotos = [string, string];
type D1HeadshotsSm = [string, string];
type D1HeadshotsLg = [string, string];
type D1Litters =
  /**prettier-ignore*/
  [
    number, //id
    string, //dueDate
    string, //birthday
    number  //applicantsInQueue
  ]
;
type D1Dogs =
  /**prettier-ignore*/
  [
    number, //id
    string, //gender
    string, //noseColor
    string, //coatColor
    string, //personality
    string, //Headshots_Sm
    string  //Headshots_Lg
  ]
;
type D1Adults =
  /**prettier-ignore*/
  [
    number,  //id
    string,  //adultName
    string,  //breeder
    string,  //birthday
    string,  //eyeColor
    boolean, //isRetired
    string,  //favActivities
    number,  //weight
    string,  //energyLevel
    number   //dogId
  ]
;
type D1Puppies =
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
type D1Families =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number, //mother
    number, //father
    number  //litterId
  ]
;
type D1DogToGroupPhotos =
  /**prettier-ignore*/
  [
    number, //id
    string, //Group_Photos
    number  //dogId
  ]
;
// }
