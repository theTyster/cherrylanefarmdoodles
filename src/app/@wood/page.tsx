import Image from "next/image";
import Link from "next/link";
import PuppyCulture from "@pub/images/puppy-culture-cert.svg";
import css from "./page.module.scss";
export const runtime = "edge";

export default function WoodLayout(): React.JSX.Element | null {
  return (
    <>
      <Link href="https://shoppuppyculture.com/pages/about-puppy-culture">
        <Image
          className={css["puppy-culture"]}
          src={PuppyCulture}
          alt="Raised with Jane Killion's Puppy Culture"
        />
      </Link>
    </>
  );
}
