import Image from "next/image";
// Static Images
import cherry from "@pub/images/cherry.svg";
import css from "@/styles/breeder-line.module.scss";

function BreederLine({ breeder }: { breeder: string }) {
  return breeder.match(/cherrylane|breeder a/gi) ? (
    <span className={css.breederLine}>
      <Image
        className={css.cherry}
        src={cherry}
        alt=""
      />
      {" " + breeder}
    </span>
  ) : (
    breeder
  );
}

export default BreederLine;
