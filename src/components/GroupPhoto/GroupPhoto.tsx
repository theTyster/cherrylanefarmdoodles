import Link from "next/link";
import { StaticImageData } from "next/image";
import CLFImage from "@/components/CLFImage/CLFImage";
import css from "@styles/GroupPhoto.module.scss";

function GroupPhoto({
  src,
  alt,
  litterId,
  className,
  ...props
}: {
  src: string | null | StaticImageData ;
  alt: string;
  litterId: number | string;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Link className={css.link} href={`/litter/${litterId}`}>
      <CLFImage
        style={src ? undefined : { aspectRatio: 1 / 1 }}
        src={src}
        alt={alt}
        width={615}
        height={433}
        className={`${css.groupPhoto} ${className}`}
        {...props}
      />
      {src ? undefined : (
      <svg className={css['no-photo']} role="heading" aria-level={1} viewBox={`0 0 249 24`}>
        <text x="22" y="22" fontWeight={700} fill={css.lightPrimary}>
          No Group Photo
        </text>
      </svg>
      )}
    </Link>
  );
}

export default GroupPhoto;
