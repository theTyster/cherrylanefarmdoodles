import Image from "next/image";
// Static Images
import cherry from "@pub/images/cherry.svg";

function BreederLine({ breeder }: { breeder: string }) {
  return breeder.match(/cherrylane|breeder a/gi) ? (
    <span>
      <Image
        style={{ display: "inline" }}
        src={cherry}
        alt=""
        width={20}
        height={20}
      />
      {" " + breeder}
    </span>
  ) : (
    breeder
  );
}

export default BreederLine;
