export const themeColors = {
  errormessage: "#9f0000",
  errorbackground: "#ffeeee",
};

export const calcAge = (anniversary: string): number =>
  Math.round(
    Math.abs(new Date(anniversary).getTime() - new Date().getTime()) /
      8.64e7 /
      365
  );

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
export type D1Tables = keyof typeof D1Tables;

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
export type D1Coumns = keyof typeof D1Columns;

export const ranNumG = (max: number): number => Math.floor(Math.random() * max);

export const makeArray = (
  maxIndex: number,
  useKeysBool?: boolean
): number[] => {
  if (useKeysBool) {
    return [...Array(maxIndex).keys()].map((x) => ++x);
  } else {
    return [...Array(maxIndex).keys()];
  }
};

export const shuffle = (inputArr: number[]): number[] => {
  const applyShuffler = () => {
    let len = inputArr.length;
    while (len) {
      const ran = ranNumG(len--);
      [inputArr[ran], inputArr[len]] = [inputArr[len], inputArr[ran]];
    }
    return inputArr;
  };
  return applyShuffler();
};

export const getLanguage = (): string => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.language || "en";
  }
};

export const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time * 1000));

export const normalizeEpochDate = (
  dateString: ConstructorParameters<typeof Date>[0]
): string => {
  const date = new Date(dateString);
  const format: Parameters<Date["toLocaleTimeString"]>[1] = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return `${date.toLocaleTimeString("en-US", format)}`;
};

const Utils = {
  themeColors,
  calcAge,
  ranNumG,
  makeArray,
  shuffle,
  getLanguage,
  sleep,
  normalizeEpochDate,
};
export default Utils;
