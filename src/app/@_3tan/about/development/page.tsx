export const runtime = "edge";
import Link from "next/link";
import css from "./page.module.scss";

export default function WhiteSectionAbout(): React.JSX.Element | null {
  return (
    <>
      <h1>Want to connect?</h1>
      <Link
        className={css["contact-link"]}
        href="mailto:admin@mail.cherrylanefarmdoodles.com?subject=Hi%2C%20Ty!%20%F0%9F%91%8B%F0%9F%90%B6&body=Could%20you%20help%20me%20get%20my%20website%20off%20the%20ground%3F%0A%0AHere's%20a%20little%20bit%20about%20what%20I%20am%20looking%20for%3A%0A%0A1."
      >
        Send Ty a message
      </Link>
    </>
  );
}
