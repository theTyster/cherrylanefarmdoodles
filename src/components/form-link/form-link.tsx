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
      href="https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk"
      rel="noreferrer noopener"
    >
      {children}
    </Link>
  );
}
