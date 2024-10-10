import Link from "next/link";
import Image, { StaticImageData } from "next/image";

//CSS
import css from "@styles/attention-getter-image.module.scss";

function AttentionGetterImage({
  className,
  imgSrc,
  node,
  imgAlt,
  imgLink,
  sideText,
}: {
  className?: string;
  imgAlt: string;
  imgSrc?: string | StaticImageData;
  node?: React.ReactNode;
  imgLink?: string;
  sideText: React.ReactNode;
}) {
  const setImage = () => {
    if (imgLink && imgSrc) {
      return (
        <Link className={css["link"]} href={imgLink}>
          <Image
            className={`${css["image"]}`}
            src={imgSrc}
            alt={imgAlt}
            placeholder="blur"
            width={450}
            height={450}
          />
        </Link>
      );
    } else if (imgSrc && !imgLink) {
      return (
        <Image
          className={`${css["image"]}`}
          src={imgSrc}
          alt={imgAlt}
          placeholder="blur"
          width={450}
          height={450}
        />
      );
    } else if (node && imgLink) {
      return (
        <Link className={css["link"]} href={imgLink}>
          {node}
        </Link>
      );
    } else if (node && !imgLink) {
      return node;
    } else throw new Error("You must provide either an imgSrc or a node prop.");
  };

  if (!className) className = "";
  return (
    <div className={`${className} ${css["container"]}`}>
      {setImage()}
      <div className={css["side-text"]}>{sideText}</div>
    </div>
  );
}

export default AttentionGetterImage;
