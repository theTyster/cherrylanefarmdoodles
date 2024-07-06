
// White Layout
import { getRequestContext } from "@cloudflare/next-on-pages";
import TabMenu, { type MenuDataArr, MenuNamesObj } from "@/components/tab-menu/tab-menu";
import { dogTreeDeconstructor } from "@/components/dogtree";

export const runtime = "edge";

export default async function WhiteLayout(): Promise<JSX.Element | null> {
  const db = getRequestContext().env.dogsDB;
  const { results } = await db
    .prepare(
      `
      SELECT
       I.groupPhoto,
       AM.dogName as mother,
       AF.dogName as father,
       L.dueDate,
       L.birthday
      FROM
      Families AS F
      LEFT JOIN Group_Photos AS I ON F.groupPhoto = I.ID
      LEFT JOIN Adults AS AM ON F.mother = AM.ID
      LEFT JOIN Adults AS AF ON F.father = AF.ID
      LEFT JOIN Litters AS L ON F.litterId = L.ID

      `
    )
    .bind()
    .all<DogTreeData>();

  //const dogTreeData = dogTreeDeconstructor(results);

  const menuNamesObj: MenuNamesObj =
    
      {
        bella: 0,
        [0]: "bella",
        lucy: 1,
        [1]: "lucy",
      };
  const menuDataArr: MenuDataArr =
      [
        {
          id: "bella",
          component: <p>Bella</p>,
          title: "Bella Button",
        },
        {
        id: "lucy",
        component: <p>Lucy</p>,
        title: "Lucy Button",
        },
      ];

  //return <p>hi</p>
  return <TabMenu menuDataArr={menuDataArr} menuNamesObj={menuNamesObj} initial="Bella" />;
}
