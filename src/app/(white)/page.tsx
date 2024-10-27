export const runtime = "edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { GlobalNameSpaces as G } from "@/constants/data";

// Components
import DogTree from "@/components/dog-tree/dog-tree";
import TabMenu, {
  type MenuDataArr,
  type MenuNamesObj,
} from "@/components/tab-menu/tab-menu";

// Styles
import css from "./page.module.scss";

// Constants
import DogTreeDataClass from "@/components/dog-tree/constants/dog-tree-class";

export default async function WhiteSection() {
  const D1 = getRequestContext().env.dogsDB;
  const DogTreeData = new DogTreeDataClass(D1);
  const families = await DogTreeData.getCachedFamily();
  const tabbedFamilies = families.reduce(
    (
      acc: {
        menuDataArr: MenuDataArr;
        menuNamesObj: MenuNamesObj;
      },
      family
    ): {
      menuDataArr: MenuDataArr;
      menuNamesObj: MenuNamesObj;
    } => {
      const index = acc.menuDataArr.length;
      const menuDataArr: MenuDataArr = [
        {
          id: family.mother.adultName + index,
          title: family.mother.adultName,
          component: <DogTree familyData={family} />,
        },
      ];

      const menuNamesObj: MenuNamesObj = {
        [family.mother.adultName + index]: index,
      };
      if (
        family.mother[G.activityStatus] === "Retired" ||
        family.mother[G.activityStatus] === "Break"
      )
        return { ...acc };
      else if (acc.menuDataArr.length === 0) {
        acc.menuDataArr = menuDataArr;
        acc.menuNamesObj = menuNamesObj;
        return acc;
      } else {
        acc.menuDataArr = [...acc.menuDataArr, ...menuDataArr];
        acc.menuNamesObj = { ...acc.menuNamesObj, ...menuNamesObj };
        return acc;
      }
    },
    { menuDataArr: [], menuNamesObj: {} }
  );
  // }

  return (
    <>
      <svg
        className={css.fullText}
        role="heading"
        aria-level={1}
        viewBox={`0 0 249 24`}
      >
        <text x="1" y="15" fontWeight={700} fill={css.darkPrimary}>
          Select a mother to see her litter
        </text>
      </svg>
      <svg
        className={css.phoneOnly}
        role="heading"
        aria-level={1}
        viewBox={`0 0 124 24`}
      >
        <text x="1" y="15" fontWeight={700} fill={css.darkPrimary}>
          Select a mother
        </text>
      </svg>
      <TabMenu
        menuDataArr={tabbedFamilies.menuDataArr}
        menuNamesObj={tabbedFamilies.menuNamesObj}
        initial={tabbedFamilies.menuDataArr[0].id}
      />
    </>
  );
}
