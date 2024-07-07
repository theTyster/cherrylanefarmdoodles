//import { getRequestContext } from "@cloudflare/next-on-pages";
//import TabMenu, {
//  type MenuDataArr,
//  MenuNamesObj,
//  createMenuNamesObj
//} from "@/components/tab-menu/tab-menu";

export const runtime = "edge";

//export function dogTreeDeconstructor(data: DogTreeData[]) {
//  return data.reduce(
//    (acc, cv, index) => {
//      acc.keys().next().value[cv.mother] = index;
//      acc.keys().next().value[index] = cv.mother;
//      acc
//        .values()
//        .next()
//        .value.push({
//          groupPhoto: new URL(cv.groupPhoto),
//          mother: cv.mother,
//          father: cv.father,
//          dueDate: new Date(cv.dueDate),
//        });
//      return acc;
//    },
//    new Map([
//      [
//        {
//          /* Object: Mother Names to index of the family in values */
//        },
//        [
//          /* Array: Objects containing DogTreeData */
//        ],
//      ],
//    ])
//  ) as unknown as DogTreeDataMap;
//}

export default async function WhiteLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element | null> {
//  const db = getRequestContext().env.dogsDB;
//  const { results } = await db
//    .prepare(
//      `
//      SELECT
//       I.groupPhoto,
//       AM.dogName as mother,
//       AF.dogName as father,
//       L.dueDate,
//       L.birthday
//      FROM
//      Families AS F
//      LEFT JOIN Group_Photos AS I ON F.groupPhoto = I.ID
//      LEFT JOIN Adults AS AM ON F.mother = AM.ID
//      LEFT JOIN Adults AS AF ON F.father = AF.ID
//      LEFT JOIN Litters AS L ON F.litterId = L.ID
//      `
//    )
//    .bind()
//    .all<DogTreeData>();

//  const dogTreeData = dogTreeDeconstructor(results);
//  const menuNamesObj: MenuNamesObj = dogTreeData.keys().next().value;
//  const menuDataArr: MenuDataArr = dogTreeData.values().next().value;

//  const menuNamesObj: MenuNamesObj = {
//    bella: 0,
//    lucy: 1,
//  };
//  const menuDataArr: MenuDataArr = [
//    {
//      id: "bella",
//      component: <p>Bella</p>,
//      title: "Bella Button",
//    },
//    {
//      id: "lucy",
//      component: <p>Lucy</p>,
//      title: "Lucy Button",
//    },
//  ];
  return (
    <>
      {/*      <h1>Select a mother to see her litter</h1>*/}
      {/*      <TabMenu menuNamesObj={menuNamesObj} menuDataArr={menuDataArr} initial="bella"/>*/}
      { children }
    </>
  )
}
