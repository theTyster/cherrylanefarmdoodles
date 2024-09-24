import GroupPhoto from "@/components/GroupPhoto/GroupPhoto";
import CLFImage from "@/components/CLFImage/CLFImage";
import dogIMG from "@pub/images/dog.webp";
import css from "@styles/check-back-soon.module.scss";

const NeedsContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={`${className ?? ""}`}>
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width={615}
          height={433}
          className={css.svg}
        >
          <text
            xmlSpace="preserve"
            x={136.812}
            style={{
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1.25,
              whiteSpace: "pre",
              fill: "#5e3918",
              fillOpacity: 1,
              stroke: "none",
            }}
            transform="translate(-55.183 0)"
          >
            <tspan x={510.233} y={128.278}>
              <tspan
                style={{
                  textAlign: "center",
                  textAnchor: "middle",
                }}
              >
                {"Check Back "}
              </tspan>
            </tspan>
            <tspan x={438.575} y={187.278}>
              <tspan
                style={{
                  textAlign: "center",
                  textAnchor: "middle",
                }}
              >
                {"Soon!"}
              </tspan>
            </tspan>
          </text>
        </svg>
      </div>
    </>
  );
};

const SvgDog = ({
  litterId,
  className,
}: {
  className?: string;
  litterId?: number | string;
}) => (
  <>
    {litterId ? (
      <NeedsContainer className={className}>
        <GroupPhoto
          className={css.dog}
          src={dogIMG}
          alt={"Check Back Soon!"}
          litterId={litterId}
          width={615}
          height={433}
        />
      </NeedsContainer>
    ) : (
      <CLFImage
        className={css.dog}
        src={dogIMG}
        alt={"Check Back Soon!"}
        width={615}
        height={433}
      />
    )}
  </>
);
export default SvgDog;
