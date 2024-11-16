import Link from "next/link";
import css from "@/styles/form-link.module.scss";

export default function FormLink({
  children,
  classnames = [],
}: {
  children: React.ReactNode;
  classnames?: string[];
}) {
  return (
    <Link
      className={`${css["form-link"]} ${classnames.map((c) => c).join(" ")}`}
      href="https://apply.cherrylanefarmdoodles.com"
      rel="noreferrer noopener"
    >
      {children}
    </Link>
  );
}
