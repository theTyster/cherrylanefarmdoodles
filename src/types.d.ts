type sections = readonly ["white", "wood", "tan"];

type WhiteWoodTanLayout = [
  WhiteLayoutType: () => React.JSX.Element | null,
  WoodLayoutType: () => React.JSX.Element | null,
  TanLayoutType: () => React.JSX.Element | null
];

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
