import CLFImage from "../CLFImage/CLFImage";
//CSS
import "./attention-getter-image.scss";

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
  imgSrc: string;
  imgAlt: string;
  imgLink?: string;
  sideText_classPrefix: string;
  sideText: React.ReactNode;
}) {

  return (
    <div className="attention-getter">
      {imgLink ? (
        <a href={imgLink} target="_blank" rel="noreferrer noopener">
          <CLFImage className={imgClass} src={imgSrc} alt={imgAlt} width={400} height={400}/>
        </a>
      ) : (
          <CLFImage className={imgClass} src={imgSrc} alt={imgAlt} width={400} height={400}/>
      )}
      <div className="sideText-container">
        <div className={`${sideText_classPrefix}-centering-box`}></div>
        <div className={`${sideText_classPrefix}-item`}>{sideText}</div>
        <div className={`${sideText_classPrefix}-centering-box`}></div>
      </div>
    </div>
  );
}

export default AttentionGetterImage;
