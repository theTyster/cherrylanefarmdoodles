"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PuppyData } from "@/types/dog-about";

import css from "@styles/puppies-left.module.scss";

function PuppiesLeft({ puppies }: { puppies: PuppyData[] }) {
  const puppyStatsRef = useRef(null);

  const availPups = puppies.filter(
    (pup) =>
      pup.dogData.availability === "Available" ||
      pup.dogData.availability === "Available Guardian"
  );
  const unavailPups = puppies.filter(
    (pup) =>
      pup.dogData.availability === "Adopted" ||
      pup.dogData.availability === "Picked"
  );

  const totalAvailPups = availPups.length;
  const totalUnavailPups = unavailPups.length;

  const totalWatching = availPups[0] ? availPups[0].litterData.applicantsInQueue : 0;

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
        <p className={css["available"]}>{totalAvailPups}</p>
        <p className={css["unavailable"]}>{totalUnavailPups}</p>
      </div>
      {totalWatching ? (
        <p className={css["watching"]}>{totalWatching}</p>
      ) : undefined}
    </>
  );
}

export default PuppiesLeft;
