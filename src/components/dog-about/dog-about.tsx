/**
 * This Component uses variants because all variants share portions of the the
 * same CSS and Data.
 **/
// Variants
import Adult from "@/components/dog-about/variants/adult";
import Puppy from "@/components/dog-about/variants/puppy";
import CurrentLitter from "@/components/dog-about/variants/currentLitter";

// Types
import * as DogAboutTypes from "@/types/dog-about";

export default async function DogAbout({
  variant,
  variantData,
  /**CSS imported through CSS modules.*/
  variantCSS,
}: {
  variant: DogAboutTypes.Variant;
  variantData: DogAboutTypes.VariantDataTypes;
  variantCSS?: { [key: string]: string };
}) {
  /**
   * Ultimately determines which variant's data will be used for this
   * component.
   **/
  async function possibleVariants<PV extends DogAboutTypes.Variant>(
    variantPossibility: PV
  ): Promise<DogAboutTypes.VariantTypes[PV]> {
    switch (variantPossibility) {
      case DogAboutTypes.V.Parent:
        return variantData as DogAboutTypes.VariantTypes[typeof DogAboutTypes.V.Parent] as PV extends typeof DogAboutTypes.V.Parent
          ? DogAboutTypes.VariantTypes[PV]
          : never;
      case DogAboutTypes.V.Puppy:
        return variantData as DogAboutTypes.VariantTypes[typeof DogAboutTypes.V.Puppy] as PV extends typeof DogAboutTypes.V.Puppy
          ? DogAboutTypes.VariantTypes[PV]
          : never;
      case DogAboutTypes.V.CurrentLitter:
        return variantData as DogAboutTypes.VariantTypes[typeof DogAboutTypes.V.CurrentLitter] as PV extends typeof DogAboutTypes.V.CurrentLitter
          ? DogAboutTypes.VariantTypes[PV]
          : never;
      default:
        throw new Error("Invalid variant provided: " + variantPossibility);
    }
  }

  // Seperating out the call from the generics function so I don't have to
  // write 'await' everywhere.
  // This also makes it a bit easier to ensure that data isn't fetched multiple times.
  const componentData = await possibleVariants(variant);
  const data = function <
    PV extends DogAboutTypes.Variant
  >(): DogAboutTypes.VariantTypes[PV] {
    return componentData as DogAboutTypes.VariantTypes[PV];
  };

  const VariantComponents = {
    [DogAboutTypes.V.Parent]: (
      <Adult D={data<DogAboutTypes.V["Parent"]>()} css={variantCSS} />
    ),
    [DogAboutTypes.V.Puppy]: (
      <Puppy D={data<DogAboutTypes.V["Puppy"]>()} css={variantCSS} />
    ),
    [DogAboutTypes.V.CurrentLitter]: (
      <CurrentLitter
        D={data<DogAboutTypes.V["CurrentLitter"]>()}
        css={variantCSS}
      />
    ),
  };

  return VariantComponents[variant];
}
