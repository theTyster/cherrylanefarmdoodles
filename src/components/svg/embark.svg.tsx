import Link from "next/link";
import type { SVGProps } from "react";
import { D1Adults } from "@/types/data";
import { GlobalNameSpaces as G } from "@/constants/data";
import css from "@styles/_theme.module.scss";

function SvgEmbark({
  variant,
  props
}: {
  variant: D1Adults[(typeof G)["certifications"]];
  props?:  SVGProps<SVGSVGElement>;}) {
  return (
    <>
      <Link href="https://embarkvet.com/resources/dog/dog-breeders/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          viewBox="0 0 63.749 46.408"
          width="3em"
          height="3em"
          aria-labelledby="embark-title"
          aria-describedby="embark-desc"
          {...props}
        >
          {(() => {
            if (variant === "Embark")
              return (
                <>
                  <desc id="embark-desc">
                    This dog has undergone DNA testing with Embark
                  </desc>
                  <title id="embark-title">
                    This dog has undergone DNA testing with Embark
                  </title>
                </>
              );
            else if (variant === "Embark-equivalent")
              return (
                <>
                  <desc id="embark-desc">
                    This dog has undergone DNA testing and received a
                    certification similar to Embark
                  </desc>
                  <title id="embark-title">
                    This dog has undergone DNA testing and received a
                    certification similar to Embark
                  </title>
                </>
              );
          })()}
          <path
            d="m98.76 133.159 3.467-2.373 4.954 7.1 8.441-.594.402 4.33-8.123.513-3.425 6.803 4.746 7.255-3.427 2.406-5.087-6.904-7.52.364-3.556 7.752-3.869-1.73 3.58-7.543-4.801-7.382 3.326-2.297 4.69 6.726 7.666-.332 3.442-6.416z"
            style={{
              fill: "#FFCE34",
              stroke: "#333",
              strokeWidth: 2.00192,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            transform="translate(-55.52 -115.586)"
          />
          {(() => {
            if (variant === "Embark")
              return (
                <path
                  fill={css["secondaryGreen"]}
                  stroke={css["lightSecondaryGreen"]}
                  strokeWidth={1.323}
                  d="M56.033.664c-5.387.077-10.477 1.9-15.061 4.69-6.114 3.72-11.43 9.139-15.856 14.694-5.226 6.562-9.018 13.057-11.412 17.523-.122-.396-.2-.773-.352-1.176-.71-1.871-1.798-3.83-3.549-5.369S5.61 28.45 2.646 28.45a1.985 1.985 0 0 0 0 3.969c2.093 0 3.444.628 4.537 1.589 1.094.96 1.903 2.334 2.458 3.795 1.108 2.922 1.135 5.96 1.135 5.96a1.984 1.984 0 0 0 3.792.818s5.173-11.414 13.652-22.06c4.24-5.323 9.298-10.42 14.814-13.776 5.517-3.357 11.39-4.987 17.659-3.664a1.987 1.987 0 0 0 2.352-1.531 1.98 1.98 0 0 0-.28-1.493 1.98 1.98 0 0 0-1.252-.859 24.7 24.7 0 0 0-5.48-.534z"
                />
              );
            else if (variant === "Embark-equivalent")
              return (
                <path
                  d="m82.526 85.894c0-0.32439-0.24182-0.58979-0.53738-0.58979h-16.82c-0.29556 0-0.53738 0.26541-0.53738 0.58979s0.24182 0.5898 0.53738 0.5898h16.82c0.29556 0 0.53738-0.26541 0.53738-0.5898zm-0.05373-9.2598c0-0.23592-0.16122-0.38337-0.32243-0.38337-0.18809 0-0.32243 0.14744-0.32243 0.32439-0.24182 2.5656-1.3434 3.7747-3.1705 4.3645-0.26869 0.08846-0.53738 0.11795-0.7792 0.11795-1.3972 0-2.6869-1.1501-3.8423-2.2412-1.4509-1.327-3.0899-2.5951-4.8364-2.5951-0.3493 0-0.72546 0.05897-1.1016 0.17694-2.257 0.73724-3.1168 2.5951-3.4124 5.78 0 0.23592 0.16122 0.38336 0.32243 0.38336 0.18809 0 0.32243-0.14744 0.32243-0.32439 0.24182-2.5656 1.3434-3.7747 3.1705-4.3645 0.26869-0.08846 0.53738-0.11795 0.7792-0.11795 1.3972 0 2.6869 1.1501 3.8423 2.2412 1.4509 1.327 3.0899 2.5951 4.8364 2.5951 0.3493 0 0.72546-0.05897 1.1016-0.17694 2.257-0.73724 3.1168-2.5951 3.4124-5.78z"
                  fill="#FFCE34"
                  stroke-width=".68613"
                  transform="translate(-95 -110) scale(1.5)"
                />
              );
          })()}
        </svg>
      </Link>
    </>
  );
}
export default SvgEmbark;
