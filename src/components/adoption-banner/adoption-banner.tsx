"use client";
import FormLink from "@/components/form-link/form-link";
import SvgDoodlePuppy from "../svg/doodle-puppy.svg";

// Styling and animation
import css from "@/styles/adoption-banner.module.scss";
import Theme from "@/styles/theme.module.scss";
import gsap from "gsap";
import { useRef } from "react";

import { useGSAP, type ContextSafeFunc } from "@gsap/react";

function AdoptionBanner() {
  const bannerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useGSAP(
    (context, contextSafe) => {
      //prettier-ignore
      const cSafe = contextSafe as ContextSafeFunc,
      initialTL:    gsap.core.Timeline | null = gsap.timeline(),
      shineTL:      gsap.core.Timeline | null = gsap.timeline({ defaults: { duration: 0.7 }});

      const gsapScopedSelect = gsap.utils.selector(bannerRef.current);

      initialTL.to(gsapScopedSelect(`.${css.eventHandlerDiv}`), {
        boxShadow: `9px 12px 15px 5px ${Theme.darkSecondaryGreen}`,
        scale: 1,
        ease: "power4.out(3)",
      });

      shineTL
        .to(gsapScopedSelect(`.${css.shine}`), {
          opacity: 1,
          duration: 0,
          delay: 0,
          position: "absolute",
          height: "102%", // accounts for shadow
          width: "10%",
          transform: "skewX(-15deg)",
          top: "-2%", // accounts for shadow
          left: 40,
          background: `linear-gradient(
            to right,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 1)
          )`,
        })
        .to(gsapScopedSelect(`.${css.shine}`), {
          left: "80%",
          ease: "power.out(3)",
          opacity: 0,
        });

      const handleMouseEnter = cSafe(function () {
        bannerRef.current.addEventListener("click", handleClick, {
          once: true,
        });
        bannerRef.current.addEventListener("mouseleave", handleMouseLeave, {
          once: true,
        });
        gsap
          .timeline()
          .to(
            gsapScopedSelect(`.${css.eventHandlerDiv}`),
            {
              scale: 0.9,
              duration: 0.4,
              ease: "back.out(3)",
            },
            "0"
          )
          .call(
            function () {
              shineTL.isActive() ? undefined : shineTL.play(0);
            },
            undefined,
            0
          );
        bannerRef.current.addEventListener("mouseenter", handleMouseEnter, {
          once: true,
        });
      });

      const handleClick = cSafe(async function (e: MouseEvent) {
        e.preventDefault();
        bannerRef.current.removeEventListener("mouseleave", handleMouseLeave);
        bannerRef.current.removeEventListener("mouseenter", handleMouseEnter);

        await gsap
          .timeline()
          .to(
            gsapScopedSelect(`.${css.eventHandlerDiv}`),
            {
              scale: 0.8,
              boxShadow: `0px 0px 0px 0px transparent`,
              ease: "back.out(4)",
            },
            "<"
          )
          .to(
            gsapScopedSelect(`.${css.snaps}`),
            { opacity: 1, duration: 0 },
            "-=0.265"
          )
          .to(gsapScopedSelect(`.${css.snaps}`), {
            opacity: 0,
            duration: 0,
          })
          .call(function openLinkInAnimation() {
            window.location.href = "https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk?selected_litter=Piper's%20Litter%20born%2007-21-2024";
          })
          .call(
            function () {
              shineTL.isActive() ? undefined : shineTL.play(0);
            },
            undefined,
            0
          )
          .add(initialTL.invalidate());

        bannerRef.current.addEventListener("mouseenter", handleMouseEnter, {
          once: true,
        });
      });

      const handleMouseLeave = cSafe(function () {
        bannerRef.current.removeEventListener("click", handleClick);
        gsap.timeline().add(initialTL.invalidate());
      });

      bannerRef.current.addEventListener("mouseenter", handleMouseEnter, {
        once: true,
      });

      return function cleanUp() {
        bannerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        bannerRef.current.removeEventListener("click", handleClick);
        bannerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: bannerRef.current }
  );

  return (
    <>
      <div className={css.adoptionBanner} ref={bannerRef}>
        <FormLink>
          <div className={css.eventHandlerDiv}>
            <div className={`${css.snaps} ${css.shine}`}></div>
            <div className={css.snaps}>
              <svg
                className={css.snapRight}
                width="70.648mm"
                height="71.766mm"
                version="1.1"
                viewBox="0 0 70.648 71.766"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(-19.087,-7.9667)">
                  <g
                    transform="matrix(-1,0,0,1,173.99,-65.38)"
                    fill="none"
                    stroke={Theme.darkSecondaryGreen}
                    strokeWidth="7.9375"
                  >
                    <path d="m87.941 120.2 18.202-45.38" />
                    <path d="m108.67 141.49 44.617-19.999" />
                    <path d="m100.56 127.97 33.876-35.257" />
                  </g>
                </g>
              </svg>
              <svg
                className={css.snapLeft}
                width="70.648mm"
                height="71.766mm"
                version="1.1"
                viewBox="0 0 70.648 71.766"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(-1 0 0 1 89.725 -7.9667)">
                  <g
                    transform="matrix(-1,0,0,1,173.99,-65.38)"
                    fill="none"
                    stroke={Theme.darkSecondaryGreen}
                    strokeWidth="7.9375"
                  >
                    <path d="m87.941 120.2 18.202-45.38" />
                    <path d="m108.67 141.49 44.617-19.999" />
                    <path d="m100.56 127.97 33.876-35.257" />
                  </g>
                </g>
              </svg>
            </div>
            <SvgDoodlePuppy className={css.doodlePuppy} />
            <div className={css.buttonText}>
              <div>Apply for a </div>
              <b>New Puppy</b>
              <div> from this litter</div>
            </div>
          </div>
        </FormLink>
      </div>
    </>
  );
}

export default AdoptionBanner;
