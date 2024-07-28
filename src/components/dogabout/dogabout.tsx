import Image from "next/image";
import { D1Tables } from "@/utils";
function DogAbout({

  dogData,

}: {

  dogData: Record<string, string>;

}) {
  const headshot = `${D1Tables.Headshots_Lg}?r=${dogData[D1Tables.Headshots_Lg]}`;

  return (
    <>
      <h1>{dogData.adultName}</h1>
      <p>{dogData.about}</p>
      <Image src={headshot} alt={headshot} width={300} height={400} />
      <p>{JSON.stringify(dogData)}</p>
    </>
  );
}

export default DogAbout;
