"use client";
import SvgDoodlePuppy from "../svg/doodle-puppy.svg";

// Styling and animation
import css from "@styles/adoption-banner.module.scss";
import gsap from "gsap";
import { useRef } from "react";

import { useGSAP, type ContextSafeFunc } from "@gsap/react";

function AdoptionBanner() {
  const bannerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useGSAP(
    (context, contextSafe) => {
      context;
      //prettier-ignore
      const cSafe = contextSafe as ContextSafeFunc,
      initialTL:    gsap.core.Timeline | null = gsap.timeline(),
      shineTL:      gsap.core.Timeline | null = gsap.timeline({ defaults: { duration: 0.7 }});

      const gsapScopedSelect = gsap.utils.selector(bannerRef.current);

      initialTL.to(gsapScopedSelect(`.${css.eventHandlerDiv}`), {
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

      const handleMouseLeave = cSafe(function () {
        gsap.timeline().add(initialTL.invalidate());
      });

      bannerRef.current.addEventListener("mouseenter", handleMouseEnter, {
        once: true,
      });

      return function cleanUp() {
        bannerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        bannerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: bannerRef.current }
  );

  return (
    <>
      <div className={css.adoptionBanner} ref={bannerRef}>
        <button className={css.eventHandlerDiv}>
          <div className={`${css.shine}`}></div>
          {/*children*/}
          <SvgDoodlePuppy className={css.doodlePuppy} />
          <span className={css.buttonText}>
            <b>Apply</b>
            <div>for a</div>
            <b>New Puppy</b>
          </span>
          {/*          <iframe
            aria-label="Cherry Lane Farm's Puppy Application"
            style={{ height: "500px", width: "99%", border: "none" }}
            src="https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk"
          ></iframe>*/}
        </button>
      </div>
    </>
  );
}

export default AdoptionBanner;
