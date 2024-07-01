import Theme from "@/styles/theme.module.scss";
import SvgConstructionDoodle from "@/components/svg/construction-doodle.svg";

export default function ConstructionPlaceholder({dogFill}: {dogFill?: string} ): React.JSX.Element {
  return (
    <>
      <style jsx>{`
        p{
          margin: 2rem 0;
        }
        a {
          text-align:center;
          box-sizing: content-box;
          background-color: ${Theme.tertiaryCherry};
          border: 5px solid ${Theme.tertiaryCherry};
          border-radius: ${Theme.buttonRadius};
          text-decoration: none;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          margin: 1rem;
          padding: 1.5rem 2rem;
        }
        a:hover {
          background-color: ${Theme.lightTertiaryCherry};
          border: 5px solid ${Theme.tertiaryCherry};
          color: ${Theme.darkTertiaryCherry};
        }
        a:active {
          background-color: ${Theme.darkTertiaryCherry};
          border: 5px solid ${Theme.tertiaryCherry};
          color: ${Theme.lightTertiaryCherry};
        }
      `}</style>
      <h1 className="title">Coming Soon!</h1>
      <p>
        We are hard at work building a beautiful site for our new litter of
        puppies. Over the next few weeks we will gradually be rolling out new
        features.
      </p>
      {dogFill ? (
        <SvgConstructionDoodle dogFill={dogFill} />
      ) : (
        <SvgConstructionDoodle />
      ) }
      <p>Interested in applying for a puppy?</p>
      <a href="https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk">
        Fill out the Application
      </a>
    </>
  );
}
