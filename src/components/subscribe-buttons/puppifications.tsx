"use client";
export const runtime = "edge";
import React, { useState, useRef } from "react";
import css from "@styles/puppifications.module.scss";
import Image from "next/image";
import { sleep } from "thetyster-utils";

function Puppifications() {
  const [formVisible, setFormVisible] = useState(false);
  const [subscription, setSubscription] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) throw new Error("Puppfication input element not found.");
    const email = inputRef.current.value;

    if (!email) {
      inputRef.current.focus();
      return false;
    }

    if (process?.env?.NODE_ENV === "development") {
      console.log("Subscribed with email:", email);
      setSubscription(email + " is pending confirmation");
      await animateSub();
      await sleep(1);
      console.log("Enter another?");
      setSubscription("");
      await animateSub();
      return false;
    }

    fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setSubscription(email + " is pending confirmation");
    animateSub();
  };

  const animateSub = async () => {
    const input = inputRef.current;
    const form = formRef.current;
    const button = buttonRef.current;
    setFormVisible(!formVisible);
    await sleep(0.2);
    if (!formVisible && form && button && input) {
      form.inert = false;
      input.focus();
      button.inert = true;
    }
    if (formVisible && button && form) {
      button.inert = false;
      button.focus();
      form.inert = true;
    }
  };

  return (
    <>
      <div className={css["container"]}>
        <div
          style={{ height: formVisible ? "100%" : 0 }}
          className={css["iris"]}
        >
          <span className={css["top-line"]}>Enter your email</span>
          <Image
            className={css["envelope-doodle"]}
            src={"/images/envelope-doodle.png"}
            width={130}
            height={130}
            alt={"Puppy holding an envelope."}
          />
          <form
            ref={formRef}
            inert={
              formVisible
                ? (undefined as unknown as boolean)
                : ("true" as unknown as boolean)
            }
            className={css["form"]}
            onSubmit={handleSubmit}
          >
            <>
              {formVisible ? (
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="Email Address"
                  onBlur={(e) => {
                    const noBlur =
                      e.relatedTarget === submitRef.current ||
                      !!inputRef.current?.value;
                    console.log(noBlur);
                    if (noBlur) return false;
                    else animateSub();
                  }}
                />
              ) : (
                <input
                  /*inert <-- Handled by animateSub()*/
                  ref={inputRef}
                  type="email"
                  placeholder="Email Address"
                />
              )}
              <button ref={submitRef} className={css["button"]} type="submit">
                Subscribe
              </button>
            </>
          </form>
        </div>
        <div
          style={{ height: formVisible ? 0 : "100%" }}
          className={css["iris"]}
        >
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
            inert={
              subscription
                ? ("true" as unknown as boolean)
                : (undefined as unknown as boolean)
            }
            style={subscription ? { boxShadow: "none" } : undefined}
            className={`${css["button"]} ${css["puppifications"]} ${css["woodgrain-light"]}`}
            onClick={subscription ? () => undefined : animateSub}
            ref={buttonRef}
          >
            {`${
              subscription ? subscription : "Enable Puppifications"
            }`}
          </button>
        </div>
      </div>
    </>
  );
}

export default Puppifications;
