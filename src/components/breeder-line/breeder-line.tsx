import Image from "next/image";
// Static Images
import cherry from "@pub/images/cherry.svg";
import css from "@styles/breeder-line.module.scss";

const variants = {
  light: "light",
  dark: "dark",
} as const;

function BreederLine({
  breeder,
  variant,
}: {
  breeder: string;
  variant?: (typeof variants)[keyof typeof variants];
}) {
  if (!variant) variant = variants.light;
  return breeder.match(/Cherry Lane|breeder a/gi) ? (
    <>
        <span className={css.text}>
          {breeder + " "}
          <Image
            style={
              variant
                ? /**Intentionally true. I ended up liking this as the default.*/ {
                    backgroundColor: css.lightPrimary,
                  }
                : undefined
            }
            className={css.cherry}
            src={cherry}
            alt=""
          />
        </span>
    </>
  ) : (
    <span className={css.text}>{breeder}</span>
  );
}

export default BreederLine;
