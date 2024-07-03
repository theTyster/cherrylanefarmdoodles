"use client";
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
        We are hard at work building a beautiful site for our new litter of
        puppies. Over the next few weeks we will gradually be rolling out new
        features.
      </p>
      {dogFill ? (
        <SvgConstructionDoodle dogFill={dogFill} />
      ) : (
        <SvgConstructionDoodle />
      )}
      <p className="construction-doodle">Interested in applying for a puppy?</p>
      <a
        className="construction-doodle"
        href="https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk"
      >
        Fill out the Application
      </a>
    </>
  );
}
