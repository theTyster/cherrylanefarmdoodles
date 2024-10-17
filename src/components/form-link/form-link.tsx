import Link from "next/link";

export default function FormLink({
  children,
  classnames = [],
}: {
  children: React.ReactNode;
  classnames?: string[];
}) {
  return (
    <Link
      className={`form-link ${classnames.map((c) => c).join(" ")}`}
      href="https://apply.cherrylanefarmdoodles.com"
      rel="noreferrer noopener"
    >
      {children}
    </Link>
  );
}
