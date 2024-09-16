import { getRequestContext } from "@cloudflare/next-on-pages";

// Components
import DogTree from "@/components/dog-tree/dog-tree";
import AdoptionBanner from "@/components/adoption-banner/adoption-banner";
import TabMenu, {
  type MenuDataArr,
  type MenuNamesObj,
} from "@/components/tab-menu/tab-menu";

// Styles
import Theme from "@styles/theme.module.scss";
import css from "./page.module.scss";

// Constants
import { GlobalNameSpaces as G } from "@/constants/data";
import {
  familyQuery,
  type D1FamilyQueryData as D1FQ,
  adultDogsQuery,
  type D1AdultDogsQueryData as D1AQ,
  dogsQuery,
  type D1DogsQueryData as D1DQ,
} from "@/constants/queries";

// Types
import type { DogData, DogTreeData } from "@/types/dog-tree";

export const runtime = "edge";

function DogTreeAndAdoptionBanner({ familyData }: { familyData: DogTreeData }) {
  return (
    <>
      <DogTree familyData={familyData} />
    </>
  );
}

export default async function WhiteSection() {
  // Data Collection for the Dogtree component {
  const D1 = getRequestContext().env.dogsDB;

  const entryPoint = await D1.prepare(familyQuery())
    .bind()
    .all<D1FQ>()
    .then((res) => res.results);

  // Reversed so that the most recent litters are displayed first.
  entryPoint.reverse();

  // Asynchronous loading of all the dogs is probably faster than one big query.
  // https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
  /**
   * All data related to the Dogtree component.
   **/
  const D1Queries = await Promise.all(
    entryPoint.map(async (familyTableData) => {
      return {
        [G.Group_Photos]: familyTableData[G.Group_Photos],
        [G.litterId]: familyTableData[G.litterId],
        ...(await Promise.all([
          D1.prepare(adultDogsQuery)
            .bind(familyTableData[G.mother])
            .first<D1AQ>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Mother's data in Adult Table for ID: " +
                    familyTableData.mother
                );
              const dogData = await D1.prepare(dogsQuery)
                .bind(res[G.dogId])
                .first<D1DQ>();
              if (!dogData)
                throw new Error(
                  "Missing Mother's data in Dogs Table for ID: " +
                    familyTableData.mother
                );
              return { ...dogData, ...res };
            }),
          D1.prepare(adultDogsQuery)
            .bind(familyTableData[G.father])
            .first<D1AQ>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Father's data in Adult Table for ID: " +
                    familyTableData.father
                );
              const dogData = await D1.prepare(dogsQuery)
                .bind(res[G.dogId])
                .first<D1DQ>();
              if (!dogData)
                throw new Error(
                  "Missing Father's data in Dogs Table for ID: " +
                    familyTableData.father
                );
              return { ...dogData, ...res };
            }),
        ])),
      };
    })
  );

  /**
   * All data in D1 regarding families for the Dogtree
   **/
  const families = D1Queries.map((result, D1QueriesIndex) => {
    if (!result[0])
      throw new Error(
        "Missing Mother's Data from the Adults table. result[0] === " +
          result[0]
      );
    else if (!result[1])
      throw new Error(
        "Missing Father's Data from the Adults table. result[1] === " +
          result[1]
      );
    else if (!result[G.Group_Photos])
      throw new Error(
        "Missing Group Photos from the Families table. Group_Photos === " +
          result[G.Group_Photos]
      );
    else if (!result[G.litterId])
      throw new Error(
        "Missing Litter ID from the Families table. litterId === " +
          result[G.litterId]
      );

    const familyTableData = entryPoint[D1QueriesIndex];

    // Clone items so there is no type conflicts and no exception to using the enum.
    return {
      [G.mother]: { ...result[0] } satisfies DogData,
      [G.father]: { ...result[1] } satisfies DogData,
      litterData: {
        [G.dueDate]: new Date(familyTableData[G.dueDate]),
        [G.litterBirthday]: familyTableData[G.litterBirthday]
          ? new Date(familyTableData[G.litterBirthday])
          : null,
        [G.applicantsInQueue]: familyTableData[G.applicantsInQueue],
        [G.availablePuppies]: familyTableData[G.availablePuppies],
        [G.totalPuppies]: familyTableData[G.totalPuppies],
      } satisfies DogTreeData["litterData"],
      ids: {
        [G.litterId]: familyTableData[G.litterId],
        [G.Group_Photos]: familyTableData[G.Group_Photos],
        [G.mother]: familyTableData[G.mother],
        [G.father]: familyTableData[G.father],
      } satisfies DogTreeData["ids"],
    } satisfies DogTreeData;
  });
  // }

  const tabbedFamilies = families.reduce(
    (
      acc: { menuDataArr: MenuDataArr; menuNamesObj: MenuNamesObj },
      family,
      index
    ): { menuDataArr: MenuDataArr; menuNamesObj: MenuNamesObj } => {
      const menuDataArr: MenuDataArr = [
        {
          id: family.mother.adultName + index,
          title: family.mother.adultName,
          component: <DogTreeAndAdoptionBanner familyData={family} />,
        },
      ];

      const menuNamesObj: MenuNamesObj = {
        [family.mother.adultName + index]: index,
      };

      if (acc.menuDataArr.length === 0) {
        acc.menuDataArr = menuDataArr;
        acc.menuNamesObj = menuNamesObj;
      } else {
        acc.menuDataArr = [...acc.menuDataArr, ...menuDataArr];
        acc.menuNamesObj = { ...acc.menuNamesObj, ...menuNamesObj };
      }
      return acc;
    },
    { menuDataArr: [], menuNamesObj: {} } as {
      menuDataArr: MenuDataArr;
      menuNamesObj: MenuNamesObj;
    }
  );
  // }

  return (
    <>
      <svg className={css.fullText} role="heading" aria-level={1} viewBox={`0 0 249 24`}>
        <text x="1" y="15" fontWeight={700} fill={Theme.darkPrimary}>
          Select a mother to see her litter
        </text>
      </svg>
      <svg
        className={Theme.phoneOnly}
        role="heading"
        aria-level={1}
        viewBox={`0 0 124 24`}
      >
        <text x="1" y="15" fontWeight={700} fill={Theme.darkPrimary}>
          Select a mother
        </text>
      </svg>
      <TabMenu
        menuDataArr={tabbedFamilies.menuDataArr}
        menuNamesObj={tabbedFamilies.menuNamesObj}
        initial={tabbedFamilies.menuDataArr[0].id}
      />
      <AdoptionBanner />
    </>
  );
}
