"use client";
import FormLink from "@/components/form-link/form-link";
import "@/styles/construction-placeholder.scss";
import SvgConstructionDoodle from "@/components/svg/construction-doodle.svg";

export default function ConstructionPlaceholder({
  dogFill,
}: {
  dogFill?: string;
}): React.JSX.Element {
  return (
    <>
      <h1 className="title">Coming Soon!</h1>
      <p className="construction-doodle">
        We are hard at work building a beautiful site for your new goldendoodle
        puppies. We are still gradually rolling out new features. Check back
        soon for updates!
      </p>
      {dogFill ? (
        <SvgConstructionDoodle dogFill={dogFill} />
      ) : (
        <SvgConstructionDoodle />
      )}
      <p className="construction-doodle">Interested in applying for a puppy?</p>
      <FormLink classnames={["construction-doodle"]}>
        Fill Out the Application Today
      </FormLink>
    </>
  );
}
