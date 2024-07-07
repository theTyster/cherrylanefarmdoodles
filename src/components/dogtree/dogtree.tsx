import FormLink from "@/components/formlink";
import "@/styles/dogtree.scss";
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
      <div className="dogtree-top">
        <img className="dogtree-mom headshot" src="./images/Piper.jpeg" alt="Hailee" />
        <h1>
          <div className="dogtree-going-home">Going Home</div>
          August 16th
        </h1>
        <img className="dogtree-dad headshot" src="./images/Knox.jpeg" alt="Dune" />
      </div>
      <div className="dogtree-bottom">
        <img className="dogtree-puppy-group" src="https://placehold.co/615x433" alt="Puppies" />
        <FormLink>
          <img src="./images/adoption-banner.svg" alt="" />
        </FormLink>
      </div>
    </>
  );
}
