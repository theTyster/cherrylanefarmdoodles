import { GlobalNameSpaces as G, D1Tables as D1T } from "@/constants/data";
import { DogsDBTableValTypes } from "@/constants/statements";
import { D1SchemaKeys, type PossibleD1Vals, type D1Schema } from "@/types/data";
import { type AdminState } from "@/components/new-dog-form/constants/server-data-handler";

export type OptionalFormValues = "";

export type FormattedFormDataType<format = AdminState> = format extends "Adults"
  ? [DogsDBTableValTypes<"Adults", "id">, DogsDBTableValTypes<"Dogs", "id">]
  : format extends "Puppies"
  ? [DogsDBTableValTypes<"Puppies", "id">, DogsDBTableValTypes<"Dogs", "id">]
  : format extends "Families"
  ? [DogsDBTableValTypes<"Families", "id">]
  : format extends "Litters"
  ? [DogsDBTableValTypes<"Litters", "id">]
  : never;

export class FormTransformer {
  /**
   * This function takes data passed into the Form and transforms it into an
   * object that can be used to update or create data in the database.
   **/
  transform(
    format: AdminState,
    formData: FormData
  ): FormattedFormDataType<typeof format> {
    if (format === "Litters") {
      const litterData = this.litterFormData(formData);

      if (Object.keys(litterData).every((key) => key in D1SchemaKeys[format]))
        throw new Error(`Form data does not match schema`);

      return [litterData];
    }

    if (format === "Adults") {
      const adultData = this.adultFormData(formData);

      if (Object.keys(adultData[0]).every((key) => key in D1SchemaKeys[format]))
        throw new Error(`Form data does not match schema`);
      if (Object.keys(adultData[1]).every((key) => key in D1SchemaKeys["Dogs"]))
        throw new Error(`Form data does not match schema`);

      return adultData;
    }
    if (format === "Puppies") {
      const puppyData = this.puppyFormData(formData);

      if (Object.keys(puppyData[0]).every((key) => key in D1SchemaKeys[format]))
        throw new Error(`Form data does not match schema`);
      if (Object.keys(puppyData[1]).every((key) => key in D1SchemaKeys["Dogs"]))
        throw new Error(`Form data does not match schema`);

      return puppyData;
    }

    if (format === "Families") {
      const familyData = this.familyFormData(formData);

      if (Object.keys(familyData).every((key) => key in D1SchemaKeys[format]))
        throw new Error(`Form data does not match schema`);

      return [familyData];
    }

    throw new Error(
      `Invalid format provided to transform function: "${format}"`
    );
  }

  /**
   * This function takes a key and a value and transforms it into an object
   * that can be used to update or create data in the database.
   * @param key - The key of the data to be transformed.
   * @param value - The value of the data to be transformed.
   * @returns - An object that can be used to update or create data in the database.
   **/
  formdataTypeConverter<
    K extends keyof typeof G,
    V extends PossibleD1Vals,
    T = K extends OptionalFormValues ? Record<string, unknown> : Record<K, V>
  >(key: K, value: FormDataEntryValue | null): T {
    if (key === G.id || key === null) return {} as T;
    return { [key]: value } as T;
  }

  /**
   * This function takes data passed into any form that uses the DogInputs component
   * and transforms it into an object that can be used to update or create a new row
   * in the dogs table of the database.
   **/
  dogFormData(formData: FormData): DogsDBTableValTypes<"Dogs", "id"> {
    const table = D1T.Dogs;
    const dogKeys = D1SchemaKeys[table];
    const [
      dogId,
      gender,
      noseColor,
      coat,
      personality,
      Headshots_Sm,
      Headshots_Lg,
    ] = dogKeys;
    type D = D1Schema["Dogs"];

    const dogIdObj = this.formdataTypeConverter<typeof dogId, D[typeof dogId]>(
      dogId,
      formData.get(dogId)
    );
    const genderObj = this.formdataTypeConverter<
      typeof gender,
      D[typeof gender]
    >(gender, formData.get(gender));
    const noseColorObj = this.formdataTypeConverter<
      typeof noseColor,
      D[typeof noseColor]
    >(noseColor, formData.get(noseColor));
    const coatObj = this.formdataTypeConverter<typeof coat, D[typeof coat]>(
      coat,
      formData.get(coat)
    );
    const personalityObj = this.formdataTypeConverter<
      typeof personality,
      D[typeof personality]
    >(personality, formData.get(personality));
    const Headshots_SmObj = this.formdataTypeConverter<
      typeof Headshots_Sm,
      D[typeof Headshots_Sm]
    >(Headshots_Sm, formData.get(Headshots_Sm));
    const Headshots_LgObj = this.formdataTypeConverter<
      typeof Headshots_Lg,
      D[typeof Headshots_Lg]
    >(Headshots_Lg, formData.get(Headshots_Lg));

    const dogData: DogsDBTableValTypes<"Dogs", "id"> = {
      ...dogIdObj,
      ...genderObj,
      ...noseColorObj,
      ...coatObj,
      ...personalityObj,
      ...Headshots_SmObj,
      ...Headshots_LgObj,
    };

    return dogData;
  }

  /**
   * This function takes data passed into the Litter Form and transforms it
   * into an object that can be used to update or create a litter in the
   * database.
   **/
  litterFormData(formData: FormData): DogsDBTableValTypes<"Litters", "id"> {
    const table = D1T.Litters;
    const litterKeys = D1SchemaKeys[table];
    const [litterId, dueDate, litterBirthday, applicantsInQueue] = litterKeys;
    type L = D1Schema["Litters"];
    const litterIdObj = this.formdataTypeConverter<
      typeof litterId,
      L[typeof litterId]
    >(litterId, formData.get(litterId));
    const dueDateObj = this.formdataTypeConverter<
      typeof dueDate,
      L[typeof dueDate]
    >(dueDate, formData.get(dueDate));
    const litterBirthdayObj = this.formdataTypeConverter<
      typeof litterBirthday,
      L[typeof litterBirthday]
    >(litterBirthday, formData.get(litterBirthday));
    const applicantsInQueueObj = this.formdataTypeConverter<
      typeof applicantsInQueue,
      L[typeof applicantsInQueue]
    >(applicantsInQueue, formData.get(applicantsInQueue));

    const litterData: DogsDBTableValTypes<"Litters", "id"> = {
      ...litterIdObj,
      ...dueDateObj,
      ...litterBirthdayObj,
      ...applicantsInQueueObj,
    };

    return litterData;
  }

  /**
   * This function takes data passed into the Adult Form and transforms it
   * into an object that can be used to update or create an adult in the
   * database.
   **/
  adultFormData(
    formData: FormData
  ): [DogsDBTableValTypes<"Adults", "id">, DogsDBTableValTypes<"Dogs", "id">] {
    const table = D1T.Adults;
    const adultKeys = D1SchemaKeys[table];
    const [
      adultId,
      adultName,
      breeder,
      adultBirthday,
      eyeColor,
      activityStatus,
      favActivities,
      weight,
      energyLevel,
      certifications,
      dogId,
    ] = adultKeys;
    type A = D1Schema["Adults"];
    const adultIdObj = this.formdataTypeConverter<
        typeof adultId,
        A[typeof adultId],
        Record<string, unknown>
      >(adultId, formData.get(adultId)),
      adultNameObj = this.formdataTypeConverter<
        typeof adultName,
        A[typeof adultName]
      >(adultName, formData.get(adultName)),
      breederObj = this.formdataTypeConverter<
        typeof breeder,
        A[typeof breeder]
      >(breeder, formData.get(breeder)),
      adultBirthdayObj = this.formdataTypeConverter<
        typeof adultBirthday,
        A[typeof adultBirthday]
      >(adultBirthday, formData.get(adultBirthday)),
      eyeColorObj = this.formdataTypeConverter<
        typeof eyeColor,
        A[typeof eyeColor]
      >(eyeColor, formData.get(eyeColor)),
      activityStatusObj = this.formdataTypeConverter<
        typeof activityStatus,
        A[typeof activityStatus]
      >(activityStatus, formData.get(activityStatus)),
      favActivitiesObj = this.formdataTypeConverter<
        typeof favActivities,
        A[typeof favActivities]
      >(favActivities, formData.get(favActivities)),
      weightObj = this.formdataTypeConverter<typeof weight, A[typeof weight]>(
        weight,
        formData.get(weight)
      ),
      energyLevelObj = this.formdataTypeConverter<
        typeof energyLevel,
        A[typeof energyLevel]
      >(energyLevel, formData.get(energyLevel)),
      certificationsObj = this.formdataTypeConverter<
        typeof certifications,
        A[typeof certifications]
      >(certifications, formData.get(certifications)),
      dogIdObj = this.formdataTypeConverter<typeof dogId, A[typeof dogId]>(
        dogId,
        formData.get(dogId)
      );

    const dogObj: DogsDBTableValTypes<"Dogs", "id"> =
      this.dogFormData(formData);

    const adultData: DogsDBTableValTypes<"Adults", "id"> = {
      ...adultIdObj,
      ...adultNameObj,
      ...breederObj,
      ...adultBirthdayObj,
      ...eyeColorObj,
      ...activityStatusObj,
      ...favActivitiesObj,
      ...weightObj,
      ...energyLevelObj,
      ...certificationsObj,
      ...dogIdObj,
    };

    return [adultData, dogObj];
  }

  /**
   * This function takes data passed into the Puppy Form and transforms it
   * into an object that can be used to update or create a puppy in the
   * database.
   **/
  puppyFormData(
    formData: FormData
  ): [DogsDBTableValTypes<"Puppies", "id">, DogsDBTableValTypes<"Dogs", "id">] {
    const table = D1T.Puppies;
    const puppyKeys = D1SchemaKeys[table];
    const [puppyId, puppyName, collarColor, availability, dogId, litterId] =
      puppyKeys;

    type P = D1Schema["Puppies"];
    const puppyIdObj = this.formdataTypeConverter<
        typeof puppyId,
        P[typeof puppyId]
      >(puppyId, formData.get(puppyId)),
      puppyNameObj = this.formdataTypeConverter<
        typeof puppyName,
        P[typeof puppyName]
      >(puppyName, formData.get(puppyName)),
      collarColorObj = this.formdataTypeConverter<
        typeof collarColor,
        P[typeof collarColor]
      >(collarColor, formData.get(collarColor)),
      availabilityObj = this.formdataTypeConverter<
        typeof availability,
        P[typeof availability]
      >(availability, formData.get(availability)),
      dogIdObj = this.formdataTypeConverter<typeof dogId, P[typeof dogId]>(
        dogId,
        formData.get(dogId)
      ),
      litterIdObj = this.formdataTypeConverter<
        typeof litterId,
        P[typeof litterId]
      >(litterId, formData.get(litterId));

    const dogObj: DogsDBTableValTypes<"Dogs", "id"> =
      this.dogFormData(formData);

    const puppyData: DogsDBTableValTypes<"Puppies", "id"> = {
      ...puppyIdObj,
      ...puppyNameObj,
      ...collarColorObj,
      ...availabilityObj,
      ...dogIdObj,
      ...litterIdObj,
    };

    return [puppyData, dogObj];
  }

  /**
   * This function takes data passed into the Family Form and transforms it
   * into an object that can be used to update or create a family in the
   * database.
   **/
  familyFormData(formData: FormData): DogsDBTableValTypes<"Families", "id"> {
    const table = D1T.Families;
    const familyKeys = D1SchemaKeys[table];
    const [familyId, Group_Photos, motherId, fatherId, litterId] = familyKeys;

    console.log("formData:\n", formData);

    type F = D1Schema["Families"];
    const familyIdObj = this.formdataTypeConverter<
        typeof familyId,
        F[typeof familyId]
      >(familyId, formData.get(familyId)),
      Group_PhotosObj = this.formdataTypeConverter<
        typeof Group_Photos,
        F[typeof Group_Photos]
      >(Group_Photos, formData.get(Group_Photos)),
      motherIdObj = this.formdataTypeConverter<
        typeof motherId,
        F[typeof motherId]
      >(motherId, formData.get(motherId)),
      fatherIdObj = this.formdataTypeConverter<
        typeof fatherId,
        F[typeof fatherId]
      >(fatherId, formData.get(fatherId)),
      litterIdObj = this.formdataTypeConverter<
        typeof litterId,
        F[typeof litterId]
      >(litterId, formData.get(litterId));

    console.log("familyIdObj:\n", familyIdObj);
    console.log("Group_PhotosObj:\n", Group_PhotosObj);
    console.log("motherIdObj:\n", motherIdObj);
    console.log("fatherIdObj:\n", fatherIdObj);
    console.log("litterIdObj:\n", litterIdObj);

    const familyData: DogsDBTableValTypes<"Families", "id"> = {
      ...familyIdObj,
      ...Group_PhotosObj,
      ...motherIdObj,
      ...fatherIdObj,
      ...litterIdObj,
    };

    return familyData;
  }
}
