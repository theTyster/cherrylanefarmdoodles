/**
 * Takes a variable containing gender data about the current Dog and returns a
 * value typed as a union literal of two DIFFERENT values when compared with
 * the gender of the Dog.
 *
 * We typically use Booleans to help us set values based on a condition.
 * The condition, in this case is simply the dogs gender. "M" or "F".
 *
 * @param The variable containing either "M" or "F".
 *
 **/
export function MorF(gender: "M" | "F"){
  /**
   * Function for quickly setting values based on a given Dog's Gender
   * The Gender of a dog is instatiated with {@see MorF}.
   * @param isM The value to return if the gender is Male.
   * @param isF The value to return if the gender is Female.
   **/
  return function MorFDeterminator<M, F>(isM: M, isF: F) {
    if (gender === "M") 
      return isM;
    else 
      return isF;
  }
}

