import Link from "next/link";
import Image, { StaticImageData } from "next/image";

//CSS
import css from "@styles/attention-getter-image.module.scss";

// NOTE: Using this component encourages the use of the center-children-by-flex
// mixin in order to style the sideText containers to a desirable width of the
// image. This should be done in the parent components stylesheet.
//
// To select it, nest this selector in AttentionGetterImage's parent.
// Example:
// div.attention-getter {
//   @include center-children-by-flex(
//     $childClassPrefix: <SET THIS>
//		 $itemWidth: <SET THIS>
//   )
// }

function AttentionGetterImage({
  imgClass,
  imgSrc,
  imgAlt,
  imgLink,
  sideText_classPrefix,
  sideText,
}: {
  imgClass?: string;
  imgSrc: string | StaticImageData;
  imgAlt: string;
  imgLink?: string;
  sideText_classPrefix: string;
  sideText: React.ReactNode;
}) {

  return (
    <div className={css['container']}>
      {imgLink ? (
        <Link className={css['link']} href={imgLink}>
          <Image className={`${imgClass} ${css['image']}`} src={imgSrc} alt={imgAlt} placeholder="blur" />
        </Link>
      ) : (
          <Image className={`${imgClass} ${css['image']}`} src={imgSrc} alt={imgAlt} placeholder="blur" />
      )}
      <div className={css["sideText-container"]}>
        <div className={`${sideText_classPrefix}-centering-box`}></div>
        <div className={`${sideText_classPrefix}-item`}>{sideText}</div>
        <div className={`${sideText_classPrefix}-centering-box`}></div>
      </div>
    </div>
  );
}

export default AttentionGetterImage;
