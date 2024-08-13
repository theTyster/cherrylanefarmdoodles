interface DogAbout_DogData
  extends Omit<D1Adults, "dogId" | "id">,
    Pick<
      D1Dogs,
      | "gender"
      | "noseColor"
      | "coatColor"
      | "personality"
      | "Headshots_Lg"
      | "Headshots_Sm",
      Pick<D1Litters, "applicantsInQueue" | "birthday" | "dueDate">
    > {
  readonly adultName: D1Adults["adultName"];
  readonly breeder: D1Adults["breeder"];
  readonly birthday: D1Adults["birthday"];
  readonly eyeColor: D1Adults["eyeColor"];
  readonly isRetired: D1Adults["isRetired"];
  readonly favActivities: D1Adults["favActivities"];
  readonly weight: D1Adults["weight"];
  readonly energyLevel: D1Adults["energyLevel"];
  readonly gender: D1Dogs["gender"];
  readonly noseColor: D1Dogs["noseColor"];
  readonly coatColor: D1Dogs["coatColor"];
  readonly personality: D1Dogs["personality"];
  readonly Headshots_Lg: D1Dogs["Headshots_Lg"];
  readonly Headshots_Sm: D1Dogs["Headshots_Sm"];
  readonly dueDate: D1Litters["dueDate"];
  readonly applicantsInQueue: D1Litters["applicantsInQueue"];
  readonly litterBirthday: D1Litters["birthday"];
}

interface DogAbout_PartnerData
  extends Pick<D1Adults, "adultName" | "breeder" | "birthday">,
    Pick<D1Dogs, "Headshots_Sm"> {
  readonly partnerName: D1Adults["adultName"];
  readonly partnerBreeder: D1Adults["breeder"];
  readonly partnerBirthday: D1Adults["birthday"];
  readonly partnerPhoto: D1Dogs["Headshots_Sm"];
}

interface DogAboutData
  extends DogAbout_DogData,
    DogAbout_PartnerData,
    Pick<
      D1Families,
      "Group_Photos",
      Pick<D1Litters, "applicantsInQueue" | "birthday" | "dueDate">
    > {
  readonly Group_Photos: D1Families["Group_Photos"];
  readonly dueDate: D1Litters["dueDate"];
}
