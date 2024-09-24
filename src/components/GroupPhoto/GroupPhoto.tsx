import Link from "next/link";
import CLFImage from "@/components/CLFImage/CLFImage";
import css from "@styles/GroupPhoto.module.scss";

function GroupPhoto({
  src,
  alt,
  litterId,
  className,
  ...props
}: {
  src: string | null;
  alt: string;
  litterId: number | string;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Link
      className={css.link}
      href={`/litter/${litterId}`}
    >
    <CLFImage
      src={src}
      alt={alt}
      width={615}
      height={433}
      className={`${css.groupPhoto} ${className}`}
      {...props}
    />
    </Link>
  );
}

export default GroupPhoto;
