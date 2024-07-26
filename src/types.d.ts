
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

export const D1Columns = {
  Group_Photos: {
    id: "id",
    groupPhotos: "groupPhotos",
  },

  Headshots_Sm: {
    id: "id",
    headshotSmall: "headshotSmall",
  },

  Headshots_Lg: {
    id: "id",
    headshotLarge: "headshotLarge",
  },

  Litters: {
    id: "id",
    dueDate: "dueDate",
    birthday: "birthday",
    applicantsInQueue: "applicantsInQueue",
  },

  Dogs: {
    id: "id",
    gender: "gender",
    noseColor: "noseColor",
    coatColor: "coatColor",
    personality: "personality",
    headshotSmall: "headshotSmall",
    headshotLarge: "headshotLarge",
  },

  Adults: {
    id: "id",
    adultName: "adultName",
    breeder: "breeder",
    birthday: "birthday",
    eyeColor: "eyeColor",
    isRetired: "isRetired",
    about: "about",
    weight: "weight",
    energyLevel: "energyLevel",
    dogId: "dogId",
  },

  Puppies: {
    id: "id",
    puppyName: "puppyName",
    collarColor: "collarColor",
    isAvailable: "isAvailable",
    dogId: "dogId",
    litterId: "litterId",
  },

  Families: {
    id: "id",
    groupPhoto: "groupPhoto",
    mother: "mother",
    father: "father",
    litterId: "litterId",
  },

  Dog_To_Group_Photos: {
    id: "id",
    groupPhotoId: "groupPhotoId",
    dogId: "dogId",
  },
} as const;

export interface D1_TABLES {
  Group_Photos: D1GroupPhotosRaw;
  Headshots_Sm: D1HeadshotsSmRaw;
  Headshots_Lg: D1HeadshotsLgRaw;
  Litters: D1LittersRaw;
  Dogs: D1DogsRaw;
  Adults: D1AdultsRaw;
  Puppies: D1PuppiesRaw;
  Families: D1FamiliesRaw;
  Dog_To_Group_Photos: D1DogToGroupPhotosRaw;
}

type D1Tables = keyof typeof D1Tables;

type D1TableNames = keyof typeof D1TableNames;
type D1TablesOnly = keyof typeof D1TablesOnly;
type D1TablesOnlyNames = keyof typeof D1TablesNamesOnly;
type D1RawTable<T = [number, string]> = T extends ArrayOf<
  number | string | boolean
>
  ? T[]
  : [T][];
// }


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
