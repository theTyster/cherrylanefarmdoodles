import { calcAge, normalizeEpochDate } from "thetyster-utils";
import { MorF } from "cherrylanefarms-utils";

// Components
import LargeHeadshot from "@/components/Headshots_Lg/Headshots_Lg";
import SmallHeadshot from "@/components/Headshots_Sm/Headshots_Sm";
import Image from "next/image";

// Styling
import sass from "@/styles/dog-about.module.scss";
import Theme from "@/styles/theme.module.scss";

// Static Images
import cherry from "@pub/images/cherry.svg";

export const runtime = "edge";

export const dogAboutQuery = (partneredWith: string, parentage: string) => {
  return `
  SELECT
  THIS.adultName,
  THIS.breeder,
  THIS.birthday,
  THIS.eyeColor,
  THIS.isRetired,
  THIS.favActivities,
  THIS.weight,
  THIS.energyLevel,
  THEIR.gender,
  THEIR.noseColor,
  THEIR.coatColor,
  THEIR.personality,
  THEIR.Headshots_Lg,
  PARTNER.adultName AS partnerName,
  PARTNER.breeder AS partnerBreeder,
  PARTNER.birthday AS partnerBirthday,
  PARTNER_PHOTO.Headshots_Sm AS partnerPhoto,
  FAM.${partneredWith} AS partnerId,
  FAM.Group_Photos,
  Litter.dueDate,
  Litter.birthday as litterBirthday,
  Litter.applicantsInQueue
   FROM
   Families AS FAM
   LEFT JOIN Adults AS THIS ON FAM.${parentage} = THIS.ID
   LEFT JOIN Adults AS PARTNER ON FAM.${partneredWith} = PARTNER.ID
   LEFT JOIN Dogs   AS THEIR On THIS.dogId = THEIR.ID
   LEFT JOIN Dogs   AS PARTNER_PHOTO ON PARTNER.dogId = PARTNER_PHOTO.ID
   LEFT JOIN LITTERS AS Litter on FAM.litterId = Litter.ID
   WHERE THIS.adultName = ?
   LIMIT 1`;
};

const css: DogAbout_CSS = {
  Group_Photos: sass.Group_Photos,
  Headshots_Lg: sass.Headshots_Lg,
  Headshots_Sm: sass.Headshots_Sm,
  adultName: sass.adultName,
  applicantsInQueue: sass.applicantsInQueue,
  attentionGetter: sass.attentionGetter,
  birthday: sass.birthday,
  breeder: sass.breeder,
  coatColor: sass.coatColor,
  dogAbout: sass.dogAbout,
  dogInfoList: sass.dogInfoList,
  dogTitle: sass.dogTitle,
  dueDate: sass.dueDate,
  energyLevel: sass.energyLevel,
  eyeColor: sass.eyeColor,
  favActivities: sass.favActivities,
  gender: sass.gender,
  isRetired: sass.isRetired,
  litterBirthday: sass.litterBirthday,
  mainDog: sass.mainDog,
  noseColor: sass.noseColor,
  partnerBirthday: sass.partnerBirthday,
  partnerBreeder: sass.partnerBreeder,
  partnerBreederPhoto: sass.partnerBreederPhoto,
  partnerData: sass.partnerData,
  partnerLastLitter: sass.partnerLastLitter,
  partnerName: sass.partnerName,
  partnerPhoto: sass.partnerPhoto,
  partnerVisuals: sass.partnerVisuals,
  personality: sass.personality,
  weight: sass.weight,
} as const;

export const usedColumns: UsedColumns = {
  Group_Photos: "Group_Photos",
  Headshots_Lg: "Headshots_Lg",
  favActivities: "favActivities",
  adultName: "adultName",
  birthday: "birthday",
  breeder: "breeder",
  coatColor: "coatColor",
  energyLevel: "energyLevel",
  eyeColor: "eyeColor",
  gender: "gender",
  isRetired: "isRetired",
  noseColor: "noseColor",
  partnerBirthday: "partnerBirthday",
  partnerBreeder: "partnerBreeder",
  partnerName: "partnerName",
  partnerPhoto: "partnerPhoto",
  weight: "weight",
} as const;

function DogAbout({
  dogData,
  partnerData,
  Group_Photos,
}: {
  dogData: DogAbout_DogData;
  partnerData: DogAbout_PartnerData;
  Group_Photos: string;
}) {
  const DA = {
    css,
    dogData,
    partnerData,
    Group_Photos,
  } as const;

  const morf = MorF(DA.dogData.gender);

  return (
    <div className={DA.css.dogAbout}>
      <div className={DA.css.dogTitle}>
        <h1 className={DA.css.adultName + " title"}>
          Meet {DA.dogData.adultName}
        </h1>
        <hr />
        <h2 className={DA.css.breeder}>
          {DA.dogData.breeder.match(/cherrylane|breeder a/ig)?<Image src={cherry} alt="" width="20" height="20" /> : undefined}
          {DA.dogData.breeder}
        </h2>
      </div>
      <article className={DA.css.mainDog}>
        <div className={DA.css.attentionGetter}>
        <LargeHeadshot
          id={DA.css.Headshots_Lg}
          src={DA.dogData.Headshots_Lg}
          alt={DA.dogData.adultName}
          gender={DA.dogData.gender}
        />
          <ul className={DA.css.dogInfoList}>
            <li className={DA.css.birthday}>                     <b>Age:</b> {calcAge(DA.dogData.birthday.toString())} years old</li>
            <li className={DA.css.applicantsInQueue}> <b>REFACTOR!! Puppies Picked:</b> {DA.dogData.applicantsInQueue}                     </li>
            <li className={DA.css.favActivities}><b>Favorite Activities:</b> {DA.dogData.favActivities}                         </li>
            <li className={DA.css.weight}>                    <b>Weight:</b> {DA.dogData.weight}                                </li>
            <li className={DA.css.energyLevel}>         <b>Energy Level:</b> {DA.dogData.energyLevel}                           </li>
            <li className={DA.css.noseColor}>             <b>Nose Color:</b> {DA.dogData.noseColor}                             </li>
            <li className={DA.css.eyeColor}>               <b>Eye Color:</b> {DA.dogData.eyeColor}                              </li>
            <li className={DA.css.coatColor}>             <b>Coat Color:</b> {DA.dogData.coatColor}                             </li>
            <li className={DA.css.personality}>          <b>Personality:</b> {DA.dogData.personality}                           </li>
          </ul>
        </div>
        <div className={DA.css.partnerData} style={{backgroundColor: morf(Theme.lightDad, Theme.lightMom)}}>
          <div className={DA.css.partnerVisuals}>
            <div>
              <h3 className={DA.css.partnerName}>
                {DA.dogData.litterBirthday ? `Previously matched with ${DA.partnerData.partnerName}.` : `Currently matched with ${DA.partnerData.partnerName}.\nNext litter due on ${normalizeEpochDate(DA.dogData.dueDate.toLocaleDateString()).replace(/.at.*/, '')}`}
              </h3>
              <h4 className={DA.css.partnerLastLitter}>
                {DA.dogData.litterBirthday ? `Last litter born on ${normalizeEpochDate(DA.dogData.birthday.toLocaleDateString()).replace(/.at.*/, '')}` : undefined}
              </h4>
              <Image
                id={DA.css.Group_Photos}
                src={Group_Photos}
                alt={`${DA.dogData.adultName} and ${DA.partnerData.partnerName}'s last litter.'`}
                width={600}
                height={400}
              />
            </div>
          </div>
            <div className={DA.css.partnerPhoto}>
              <SmallHeadshot
                /**intentionally reversed*/
                gender={morf("M", "F")}
                src={DA.partnerData.partnerPhoto}
                alt={DA.partnerData.partnerName}
                id={DA.css.Headshots_Sm}
              />
              <h4 className={DA.css.partnerBreeder}>
                {DA.partnerData.partnerBreeder}
              </h4>
            </div>
        </div>
      </article>
    </div>
  );
}

export default DogAbout;
