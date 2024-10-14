"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PuppyData } from "@/types/dog-about";

import css from "@styles/puppies-left.module.scss";

function PuppiesLeft({ puppies }: { puppies: PuppyData[] }) {
  const puppyStatsRef = useRef(null);

  const totalAvailPups = puppies.filter(
    (pup) =>
      pup.dogData.availability === "Available" ||
      pup.dogData.availability === "Available Guardian"
  ).length;
  const totalPickedPups = puppies.filter(
    (pup) => pup.dogData.availability === "Picked"
  ).length;
  const totalUnavailPups = puppies.filter(
    (pup) => pup.dogData.availability === "Adopted"
  ).length;

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
      dependencies: [totalAvailPups, totalPickedPups, totalUnavailPups],
      scope: puppyStatsRef,
    }
  );

  return (
    <div className={css["puppy-stats"]} ref={puppyStatsRef}>
      <p className={css["available"]}>
        Available: <span>{totalAvailPups}</span>
      </p>
      <p className={css["picked"]}>
        Picked: <span>{totalPickedPups}</span>
      </p>
      <p className={css["unavailable"]}>
        Unavailable: <span>{totalUnavailPups}</span>
      </p>
    </div>
  );
}

export default PuppiesLeft;
