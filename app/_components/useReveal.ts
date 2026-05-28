"use client";
import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useReveal(): React.RefObject<any> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            e.target.classList.remove("out-above");
          } else {
            e.target.classList.remove("in");
            if (e.boundingClientRect.top < 0) {
              // Element scrolled above viewport — exit upward
              e.target.classList.add("out-above");
            } else {
              // Element below viewport — reset to slide-in-from-below state
              e.target.classList.remove("out-above");
            }
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    el.querySelectorAll<HTMLElement>(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return ref as React.RefObject<any>;
}
