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

export const ranNumG = (max: number): number => Math.floor(Math.random() * max);

export const makeArray = (maxIndex: number, useKeysBool?: boolean): number[] => {
  if (useKeysBool) {
    return [...Array(maxIndex).keys()].map((x) => ++x);
  } else {
    return [...Array(maxIndex).keys()];
  }
};

export const shuffle = (inputArr: number[]): number[] => {
  let applyShuffler = () => {
    let len = inputArr.length;
    while (len) {
      let ran = ranNumG(len--);
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
  let date = new Date(dateString);
  let format: Parameters<Date["toLocaleTimeString"]>[1] = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return `${date.toLocaleTimeString("en-US", format)}`;
};

const Utils ={
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
