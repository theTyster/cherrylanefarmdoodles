"use client";
export const runtime = "edge";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Styles
import css from "@styles/modal.module.scss";

export default function Modal({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTl = useRef<gsap.core.Timeline>();
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      modalTl.current = gsap.timeline();
      modalTl.current.to(modalRef.current, {
        duration: 1,
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
      });
    },
    { scope: modalRef, dependencies: [modalRef] }
  );

  const back = () => modalTl.current!.reverse().then(() => router.back());
  const handleClick = (
    event: React.MouseEvent<HTMLDivElement & SVGSVGElement, MouseEvent>
  ) => {
    const eventClass = (
      event.nativeEvent.target as HTMLElement & SVGSVGElement
    ).attributes.getNamedItem("class");
    if (eventClass) {
      if (
        eventClass.value === css["container"] &&
        !(eventClass.value === css["exit"])
      ) {
        back();
      }
    }
  };
  return (
    <>
      <div className={css["container"]} ref={modalRef} onClick={handleClick}>
        <button className={css["exit"]} onClick={back}>
          <svg
            className={css['x']}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            ref={svgRef}
          >
            <rect
              className={css["forward"]}
              transform="rotate(45)"
              x="2.0775"
              y="-5"
              width="75"
              height="10"
              rx="5"
            />
            <rect
              className={css["backward"]}
              transform="rotate(-45)"
              x="-37.5"
              y="34.578"
              width="75"
              height="10"
              rx="5"
            />
          </svg>
        </button>
        <div className={css['child']}>{children}</div>
      </div>
    </>
  );
}
