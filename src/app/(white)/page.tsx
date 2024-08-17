import { getRequestContext } from "@cloudflare/next-on-pages";
// Components
import DogTree from "@/components/dog-tree/dog-tree";
import AdoptionBanner from "@/components/adoption-banner/adoption-banner";
import DogTreeError from "./error";

// Constants
import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import PQ from "@/constants/queries";

export const runtime = "edge";

export default async function WhiteSection() {
  const D1 = getRequestContext().env.dogsDB;

  const entryPointQuery = `SELECT 
  Group_Photos,
  mother,
  father,
  litterId
    FROM Families;`;
  const entryPoint = await D1.prepare(entryPointQuery)
    .bind()
    .all<D1Families>()
    .then((res) => res.results);

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
          D1.prepare(PQ.adultDogsQuery)
            .bind(familyTableData[G.mother])
            .first<D1Adults>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Mother's data in Adult Table for ID: " + familyTableData.mother
                );
              const dogData = await D1.prepare(PQ.dogsQuery)
                .bind(res[G.dogId])
                .first<D1Dogs>();
              if (!dogData)
                throw new Error(
                  "Missing Mother's data in Dogs Table for ID: " + familyTableData.mother
                );
              return { ...dogData, ...res };
            }),
          D1.prepare(PQ.adultDogsQuery)
            .bind(familyTableData[G.father])
            .first<D1Adults>()
            .then(async (res) => {
              if (!res)
                throw new Error(
                  "Missing Father's data in Adult Table for ID: " + familyTableData.father
                );
              const dogData = await D1.prepare(PQ.dogsQuery)
                .bind(res[G.dogId])
                .first<D1Dogs>();
              if (!dogData)
                throw new Error(
                  "Missing Father's data in Dogs Table for ID: " + familyTableData.father
                );
              return { ...dogData, ...res };
            }),
          D1.prepare(PQ.litterQuery)
            .bind(familyTableData[G.litterId])
            .first<Omit<D1LittersWithQueue, typeof G.id>>()
            .then((res) => {
              if (!res)
                throw new Error(
                  "Missing Litter's data in Litters Table for ID: " +
                    familyTableData.litterId
                );
              return {
                [G.dueDate]: new Date(res[G.dueDate]),
                [G.litterBirthday]: res[G.litterBirthday] ? new Date(res[G.litterBirthday]) : null,
                [G.applicantsInQueue]: Number.parseFloat(
                  res[G.applicantsInQueue] as unknown as string
                ),
                [G.availablePuppies]: res[G.availablePuppies],
              };
            }),
        ])),
      };
    })
  );

  /**
   * All data in D1 regarding families for the Dogtree
   **/
  const families = D1Queries.map((result) => {
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

    return {
      [G.mother]: { ...result[1] },
      [G.father]: { ...result[0] },
      [D1T.Litters]: { ...result[2] },
      [G.Group_Photos]: result[G.Group_Photos],
    };
  });

  return (
    <>
      {(() => {
        try {
          return (
            <>
              {families.map((family) => {
                return (
                  <DogTree key={JSON.stringify(family)} familyData={family} />
                );
              })}
            </>
          );
        } catch {
          return <DogTreeError />;
        }
      })()}
      <AdoptionBanner />
    </>
  );
}
