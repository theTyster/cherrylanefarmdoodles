//"use client";
//import { getRequestContext } from "@cloudflare/next-on-pages";
//import TabMenu, { type PseudoSQLDataMap }from "@/components/tab-menu/tab-menu";
//
export function dogTreeDeconstructor(data: DogTreeData[]) {
  return data.reduce(
    (acc, cv, index) => {
      acc.keys().next().value[cv.mother] = index;
      acc.keys().next().value[index] = cv.mother;
      acc
        .values()
        .next()
        .value.push({
          groupPhoto: new URL(cv.groupPhoto),
          mother: cv.mother,
          father: cv.father,
          dueDate: new Date(cv.dueDate),
        });
      return acc;
    },
    new Map([
      [
        {
          /* Object: Mother Names to index of the family in values */
        },
        [
          /* Array: Objects containing DogTreeData */
        ],
      ],
    ])
  ) as unknown as DogTreeDataMap;
}
//
//async function DogTree() {
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
//
//      `
//    )
//    .bind()
//    .all<DogTreeData>();
//
//  const dogTreeData = dogTreeDeconstructor(results);
//
//  const menuItems: PseudoSQLDataMap = new Map([
//    dogTreeData.keys().next().value,
//    {
//      id: "Bella",
//      component: <p>test</p>,
//      title: "Job History",
//    }
//
//  ])
//
//  //return <p>hi</p>
//  return <TabMenu menuItems={menuItems} initial="Bella" />;
//}
//
//export default DogTree;
