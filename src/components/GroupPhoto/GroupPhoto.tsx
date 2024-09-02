import Link from "next/link";
import CLFImage from "@/components/CLFImage/CLFImage";

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
      href={`/litter/${litterId}`}
    >
    <CLFImage
      src={src}
      alt={alt}
      width={615}
      height={433}
      className={className}
      {...props}
    />
    </Link>
  );
}

export default GroupPhoto;
