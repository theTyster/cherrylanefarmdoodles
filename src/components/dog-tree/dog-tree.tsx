import Theme from "@/styles/theme.module.scss";
import css from "@/styles/dog-tree.module.scss";
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
      <div className={css.top}>
        <img
          className={`${Theme.mom} ${Theme.headshot}`}
          src="./images/Piper.jpeg"
          alt="Mother Dog"
        />
        <h1 className={`${Theme.desktopOnly} ${css.heading}`}>
          <div className={css.goingHome}>Going Home</div>
          August 16th
        </h1>
        <img
          className={`${Theme.dad} ${Theme.headshot}`}
          src="./images/Knox.jpeg"
          alt="Father Dog"
        />
      </div>
      <h1 className={`${Theme.mobileOnly} ${css.heading}`}>
        <div className={css.goingHome}>Going Home</div>
        August 16th
      </h1>
      <div className={css.bottom}>
        <img
          className={css.puppyGroup}
          src="./images/PipersLitter_07_2024.jpeg"
          alt="Puppies"
        />
      </div>
    </>
  );
}
