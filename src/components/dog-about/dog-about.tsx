/**
 * This Component uses variants because all variants share portions of the the
 * same CSS and Data.
 **/
// Variants
import Adult from "@/components/dog-about/variants/adult";
import Puppy from "@/components/dog-about/variants/puppy";
import CurrentLitter from "@/components/dog-about/variants/currentLitter";

// Types
import type * as DogAboutTypes from "@/types/dog-about";

/**All possible variants for this component.*/
export const V = {
  Parent: "Parent",
  Puppy: "Puppy",
  CurrentLitter: "CurrentLitter",
} as const;

export type V = typeof V;

export type Variant = (typeof V)[keyof typeof V];

export type VariantTypes = {
  [V.Parent]: DogAboutTypes.ParentData;
  [V.Puppy]: DogAboutTypes.PuppyData;
  [V.CurrentLitter]: DogAboutTypes.PuppyData;
};

export default async function DogAbout({
  variant,
  variantData,
}: {
  variant: Variant;
  variantData: DogAboutTypes.ParentData | DogAboutTypes.PuppyData;
}) {
  /**
   * Ultimately determines which variant's data will be used for this
   * component.
   **/
  async function possibleVariants<PV extends Variant>(
    variantPossibility: PV
  ): Promise<VariantTypes[PV]> {
    switch (variantPossibility) {
      case V.Parent:
        return variantData as VariantTypes[typeof V.Parent] as PV extends typeof V.Parent
          ? VariantTypes[PV]
          : never;
      case V.Puppy:
        return variantData as VariantTypes[typeof V.Puppy] as PV extends typeof V.Puppy
          ? VariantTypes[PV]
          : never;
      case V.CurrentLitter:
        return variantData as VariantTypes[typeof V.CurrentLitter] as PV extends typeof V.CurrentLitter
          ? VariantTypes[PV]
          : never;
      default:
        throw new Error("Invalid variant provided: " + variantPossibility);
    }
  }

  // Seperating out the call from the generics function so I don't have to
  // write 'await' everywhere.
  // This also makes it a bit easier to ensure that data isn't fetched multiple times.
  const componentData = await possibleVariants(variant);
  const data = function <PV extends Variant>(): VariantTypes[PV] {
    return componentData as VariantTypes[PV];
  };

  const VariantComponents = {
    [V.Parent]: <Adult D={data<V["Parent"]>()} />,
    [V.Puppy]: <Puppy D={data<V["Puppy"]>()} />,
    [V.CurrentLitter]: <CurrentLitter D={data<V["CurrentLitter"]>()} />,
  };

  return VariantComponents[variant];
}
