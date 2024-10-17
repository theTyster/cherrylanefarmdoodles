"use client";
export const runtime = "edge";
import React, { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import css from "@styles/puppifications.module.scss";
import Image from "next/image";

function Puppifications() {
  // State to track if the form is visible
  const [formVisible, setFormVisible] = useState(false);
  const [subscription, setSubscription] = useState("");

  // Function to handle the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form[0] as HTMLInputElement;
    const email = input.value;
    if (!email) return; // No action if no email.
    fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setSubscription("Subscribed");
    animateSub();
  };

  const { contextSafe } = useGSAP({ dependencies: [formVisible] });

  // Function to handle the button click
  const animateSub = contextSafe(async () => {
    const tl = gsap.timeline();
    await tl
      .to(`.${css["iris"]}`, {
        duration: 0.5,
        height: 0,
        ease: "back.in",
        onComplete: () => setFormVisible(!formVisible),
      })
      .to(`.${css["iris"]}`, {
        duration: 0.5,
        height: 350,
        ease: "back.out",
      });
  });

  const handleKeyup = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      animateSub();
    }
    if (e.key === "Enter") {
      animateSub();
    }
  };

  // Return the button and form
  return (
    <>
      <div className={css["container"]}>
        <div className={css["iris"]}>
          {formVisible ? (
            <>
              <span className={css["top-line"]}>Enter your email</span>
              <Image
                className={css["envelope-doodle"]}
                src={"/images/envelope-doodle.png"}
                width={130}
                height={130}
                alt={"Puppy holding an envelope."}
              />
              <form className={css["form"]} onSubmit={handleSubmit}>
                <input
                  onKeyUp={handleKeyup}
                  type="email"
                  placeholder="Email Address"
                />
                <button className={css["button"]} type="submit">
                  Subscribe
                </button>
              </form>
            </>
          ) : (
            <>
              <span className={css["top-line"]}>
                {subscription
                  ? "Check your inbox for a confirmation email"
                  : "Be the first to know when more puppies arrive"}
              </span>
              <style jsx>{`
                .${css["button"]}:hover {
                  ${subscription ? "transform: scale(1);" : ""}
                  ${subscription ? "cursor: auto;" : ""}
                }
              `}</style>
              <button
                style={subscription ? { boxShadow: "none" } : undefined}
                className={`${css["button"]} ${css["puppifications"]} ${css["woodgrain-light"]}`}
                onClick={subscription ? () => undefined : animateSub}
              >
                {`${
                  subscription
                    ? "Pending confirmation"
                    : "Enable Puppifications"
                }`}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Puppifications;
