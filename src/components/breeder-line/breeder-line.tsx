import Image from "next/image";
// Static Images
import cherry from "@pub/images/cherry.svg";
import css from "@styles/breeder-line.module.scss";

function BreederLine({
  breeder,
}: {
  breeder: string;
}) {
  return breeder.match(/Cherry Lane|breeder a/gi) ? (
    <>
      <span className={css.text}>
        {breeder + " "}
        <Image
          style={{backgroundColor: css.lightPrimary}}
          className={css.cherry}
          src={cherry}
          alt=""
        />
      </span>
    </>
  ) : (
    <span className={css.text}>{breeder}</span>
  );
}

export default BreederLine;
