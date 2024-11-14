"use client";
import SvgDoodlePuppy from "@/components/svg/doodle-puppy.svg";

// Styling and animation
import css from "@styles/adoption-banner.module.scss";
import gsap from "gsap";
import { useRef, useState } from "react";

import { useGSAP, type ContextSafeFunc } from "@gsap/react";

function AdoptionBanner() {
  const bannerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(
    (context, contextSafe) => {
      //prettier-ignore
      const cSafe = contextSafe as ContextSafeFunc,
      initialTL:    gsap.core.Timeline | null = gsap.timeline(),
      shineTL:      gsap.core.Timeline | null = gsap.timeline({ defaults: { duration: 1 }});

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
          height: "100%",
          width: "10%",
          transform: "skewX(-15deg)",
          top: "0",
          left: 40,
          background: `linear-gradient(
               rgba(255,255,255,0) 0%,
               rgba(255,255,255,0.85) 15%,
               rgba(255,255,255,1) 50%,
               rgba(255,255,255,0.85) 85%,
               rgba(255,255,255,0) 100%)`,
        })
        .to(gsapScopedSelect(`.${css.shine}`), {
          left: "100%",
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
              if (!shineTL.isActive()) shineTL.play(0);
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

      function cleanUp() {
        bannerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        bannerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      return cleanUp;
    },
    { scope: bannerRef.current, dependencies: [isOpen] }
  );

  const { contextSafe: clickAnim } = useGSAP();

  const handleClick = clickAnim(() => {
    gsap
      .timeline()
      .to(
        `.${css["doodlePuppy"]}, .${css["buttonText"]}`,
        {
          opacity: 0,
          duration: 1,
        },
        "<"
      )
      .to(
        `.${css["eventHandlerDiv"]}`,
        {
          scale: 1,
          width: "100%",
          height: "660px",
          boxShadow: "none",
          duration: 1,
        },
        "<"
      )
      .call(() => {
        setIsOpen(true);
      }, undefined);
  });

  return (
    <>
      <div className={css.adoptionBanner} ref={bannerRef}>
        {isOpen ? (
          <div className={css["closed-content"]}>
            <iframe
              aria-label="Cherry Lane Farm's Puppy Application"
              style={{ height: "600px", width: "99%", border: "none" }}
              src="https://forms.zohopublic.com/cherrylanefarmsdoodles/form/Application/formperma/c1uNLpvyuDl0TdUvp1InSoINH1G-84Ugqyq-vBjiItk"
            ></iframe>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleClick()}
              className={css.eventHandlerDiv}
            >
              <div className={`${css.shine}`}></div>
              <SvgDoodlePuppy className={css.doodlePuppy} />
              <span className={css.buttonText}>
                <b>Apply</b>
                <div>for a</div>
                <b>New Puppy</b>
              </span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default AdoptionBanner;
