import Image, { type ImageProps } from "next/image";
import css from "@styles/dog-name.module.scss";

/**
 * Displays dog names with an image next to them.
 **/
export default function DogNames(
  props: Omit<ImageProps, "alt"> & { src: string; name: string; css?: string }
): React.ReactNode {
  const { src, name } = props;
  const iconifiedSrc = src && src.replace(".com/", ".com/icon/");
  return (
    <span className={`${css["icon-text"]} ${props.css ? props.css : ''}`}>
      {iconifiedSrc && (
        <Image
          {...props}
          src={iconifiedSrc}
          alt={""}
          width={50}
          height={50}
          aria-label={name}
        />
      )}
      {name}
    </span>
  );
}
