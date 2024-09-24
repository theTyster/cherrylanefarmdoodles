export const runtime = "edge";
import Image from "next/image";
import Link from "next/link";
import PuppyCulture from "@pub/images/puppy-culture-cert.svg";
import JennyImage from "@pub/images/Jenny.jpg";

// Components
import AttentionGetterImage from "@/components/attention-getter-image/attention-getter-image";

// Styles
import css from "./page.module.scss";

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
      <AttentionGetterImage
        imgSrc={JennyImage}
        imgAlt="Jenny"
        imgLink="/about"
        className={css["attention-getter-image"]}
        sideText_classPrefix="sideText"
        sideText={
          <>
            <h1>Hi, I&apos;m Jenny!</h1>
            <p>
              At Cherry Lane Farms, we focus our breeding on temperament. To
              help our puppies get the best start they can, we use the Puppy
              Culture Curriculum with each litter.
            </p>
            <br />
            <p>
              It&apos;s my hope that each of our golden puppies end up in loving
              homes. That&apos;s why we offer ourselves to be a resource
              throughout your little Goldendoodles life.
            </p>
          </>
        }
      />
    </>
  );
}
