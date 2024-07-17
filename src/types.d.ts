// Utility Types {
type ArrayOf<T> = T[];
// }

// Layout Types {
type sections = readonly ["white", "wood", "tan"];

type WhiteWoodTanLayout = [
  WhiteLayoutType: () => React.JSX.Element | null,
  WoodLayoutType: () => React.JSX.Element | null,
  TanLayoutType: () => React.JSX.Element | null
];
// }

// Data Types {
interface DogTreeData {
  readonly groupPhoto: string;
  readonly mother: string;
  readonly father: string;
  readonly dueDate: string;
  //readonly birthday: string | null;
}

interface DogTreeDataDeconstructed extends DogTreeData {
  readonly groupPhoto: URL;
  readonly mother: string;
  readonly father: string;
  readonly dueDate: Date;
  readonly birthday: Date | null;
}

type DogTreeDataMapObj = Record<string, number> | Record<number, string>;

type DogTreeDataMap = Map<DogTreeDataMapObj, DogTreeDataDeconstructed>;

// D1 {
type D1RawTable<T = [number, string]> = T extends ArrayOf<
  number | string | boolean
>
  ? T[]
  : never;
type D1GroupPhotosRaw = D1RawTable;
type D1HeadshotsSmRaw = D1RawTable;
type D1HeadshotsLgRaw = D1RawTable;
type D1LittersRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number, //id
    string, //dueDate
    string, //birthday
    number  //applicantsInQueue
  ]
>;
type D1DogsRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number, //id
    string, //gender
    string, //noseColor
    string, //coatColor
    string, //personality
    number, //headshotSmall
    number  //headshotLarge
  ]
>;
type D1AdultsRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number,  //id
    string,  //adultName
    string,  //breeder
    string,  //birthday
    string,  //eyeColor
    boolean, //isRetired
    string,  //about
    number,  //weight
    string,  //energyLevel
    number   //dogId
  ]
>;
type D1PuppiesRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number,  //id
    string,  //puppyName
    string,  //collarColor
    boolean, //isAvailable
    number,  //dogId
    number   //litterId
  ]
>;
type D1FamiliesRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number, //id
    number, //groupPhoto
    number, //mother
    number, //father
    number  //litterId
  ]
>;
type D1DogToGroupPhotosRaw = D1RawTable<
  /*prettier-ignore*/
  [
    number, //id
    string, //groupPhotoId
    number  //dogId
  ]
>;
// }
// }
