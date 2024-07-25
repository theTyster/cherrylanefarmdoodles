import Image from "next/image";
function DogAbout({

  dogData,

}: {

  dogData: Record<string, string>;

}) {
  const headshot = `Headshots_Lg/${dogData.headshotLarge}`;

  return (
    <>
      <h1>{dogData.adultName}</h1>
      <p>{dogData.about}</p>
      <Image src={headshot} alt={headshot} width={30} height={60}/>
      <p>{JSON.stringify(dogData)}</p>
    </>
  );
}

export default DogAbout;
