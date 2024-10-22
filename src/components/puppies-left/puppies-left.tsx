"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { type PuppiesLeftData } from "@/types/puppies-left";

import css from "@styles/puppies-left.module.scss";

function PuppiesLeft({ puppies: {availablePuppies, applicantsInQueue, totalPuppies} }: {puppies: PuppiesLeftData}) {
  const puppyStatsRef = useRef(null);

  useGSAP(
    async () => {
      const x = -100;
      const opacity = 0;
      gsap.registerPlugin(ScrollTrigger);
      const scrollTl = gsap.timeline();
      scrollTl.from(puppyStatsRef.current, {
        scrollTrigger: {
          trigger: "p",
          start: "top bottom-=200px",
          end: "bottom 65%",
          scrub: 1,
        },
        duration: css.transitionFancy,
        x,
        opacity,
      });
    },
    {
      scope: puppyStatsRef,
    }
  );

  return (
    <>
      <div className={css["puppy-stats"]} ref={puppyStatsRef}>
        <p className={css["available"]}>{availablePuppies}</p>
        <p className={css["unavailable"]}>{totalPuppies - availablePuppies}</p>
      </div>
      {applicantsInQueue ? (
        <p className={css["watching"]}>{applicantsInQueue}</p>
      ) : undefined}
    </>
  );
}

export default PuppiesLeft;
