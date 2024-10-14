import { getRequestContext } from "@cloudflare/next-on-pages";

// Components
import DogTree from "@/components/dog-tree/dog-tree";
import AdoptionBanner from "@/components/adoption-banner/adoption-banner";
import TabMenu, {
  type MenuDataArr,
  type MenuNamesObj,
} from "@/components/tab-menu/tab-menu";

// Styles
import css from "./page.module.scss";

// Constants
import DogTreeDataClass from "@/components/dog-tree/constants/dog-tree-class";

export const runtime = "edge";

export default async function WhiteSection() {
  const D1 = getRequestContext().env.dogsDB;
  const DogTreeData = new DogTreeDataClass(D1);
  const families = await DogTreeData.getCachedFamily();
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
          component: <DogTree familyData={family} />
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
      <AdoptionBanner />
    </>
  );
}
