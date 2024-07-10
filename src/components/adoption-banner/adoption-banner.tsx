"use client";
import FormLink from "@/components/formlink/formlink";
import SvgDoodlePuppy from "../svg/doodle-puppy.svg";

// Styling and animation
import css from "@/styles/adoption-banner.module.scss";
import Theme from "@/styles/theme.module.scss";
import gsap from "gsap";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";

function AdoptionBanner() {
  // Animations {
  const bannerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const snapsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const shineRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  let hoverTL: gsap.core.Timeline | null = gsap.timeline();
  let clickTL: gsap.core.Timeline | null = gsap.timeline();

  useGSAP(() => {
    gsap.to(bannerRef.current, {
      boxShadow: `9px 12px 15px 5px ${Theme.darkSecondaryGreen}`,
    });
  });

  useGSAP(() => {
    (clickTL as gsap.core.Timeline)
      .to(shineRef.current, {opacity: 0, duration: 0})
      .to(bannerRef.current, {
        scale: 0.8,
        duration: 0.4,
        ease: "back.out(3)",
        boxShadow: "0px 0px 0px 0px transparent",
      })
      .to(snapsRef.current, { opacity: 1, duration: 0.1 }, "-=0.225")
      .to(snapsRef.current, { opacity: 0, duration: 0.1 })
      .pause();
  });
  // }

  // Event handlers {
  function handleMouseEnter() {
    if (hoverTL instanceof gsap.core.Timeline) {
      hoverTL.clear();
      hoverTL
      .to(shineRef.current, { opacity: 1, visibility: "visible", duration: 0, delay: 0 })
        .to(
          shineRef.current,
          { left: "100%", duration: 2, ease: "power4.out(3)" },
          "<"
        )
        .to(
          bannerRef.current,
          {
            scale: 0.9,
            duration: 0.7,
            ease: "back.out(3)",
          },
          "0"
        )
        .to(shineRef.current, { opacity: 0, duration: 0.7 }, "<")
        .play();
    }
  }
  function handleMouseLeave() {
    if (hoverTL instanceof gsap.core.Timeline) {
      hoverTL.clear();
      hoverTL
        .to(bannerRef.current, {
          scale: 1,
          duration: 0.5,
          ease: "power4.out(3)",
        })
        .to(shineRef.current, { opacity: 0, visibility: "hidden", left: "-15px", duration: 0 }, "<")
        .play();
    }
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (
      hoverTL instanceof gsap.core.Timeline &&
      clickTL instanceof gsap.core.Timeline
    ) {
      hoverTL.clear();
      clickTL.play();
      hoverTL = null;
      clickTL = null;
    }
  }
  // }

  return (
    <>
      <div className={css.adoptionBanner} ref={bannerRef}>
        <FormLink>
          <div
            className={css.eventHandlerDiv}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <div className={`${css.snaps} ${css.shine}`} ref={shineRef}></div>
            <div className={css.snaps} ref={snapsRef}>
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
                    stroke="#2e4922"
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
                    stroke="#2e4922"
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
            <span>
              Apply for a <b>New Puppy</b> from this litter
            </span>
          </div>
        </FormLink>
      </div>
    </>
  );
}

export default AdoptionBanner;
