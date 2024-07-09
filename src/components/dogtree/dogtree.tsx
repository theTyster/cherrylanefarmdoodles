import FormLink from "@/components/formlink";
import Theme from "@/styles/theme.module.scss";
import dt from "@/styles/dogtree.module.scss";
export default function DogTree() {
  /* Props:
   *
   * - images (x3)
   * - dueDate
   * - mother name
   *
   */

  return (
    <>
      <div className={dt.top}>
        <img
          className={`${dt.mom} ${Theme.headshot}`}
          src="./images/Piper.jpeg"
          alt="Hailee"
        />
        <h1 className={Theme.desktopOnly}>
          <div className={dt.goingHome}>Going Home</div>
          August 16th
        </h1>
        <img
          className={`${dt.dad} ${Theme.headshot}`}
          src="./images/Knox.jpeg"
          alt="Dune"
        />
      </div>
      <h1 className={Theme.mobileOnly}>
        <div className={dt.goingHome}>Going Home</div>
        August 16th
      </h1>
      <div className={dt.bottom}>
        <img
          className={dt.puppyGroup}
          src="./images/PipersLitter_07_2024.jpeg"
          alt="Puppies"
        />
        <FormLink>
          <img src="./images/adoption-banner.svg" alt="" />
        </FormLink>
      </div>
    </>
  );
}
