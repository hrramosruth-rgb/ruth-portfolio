"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `is-in` to every element matching `selector` inside the returned ref once its top edge
 * passes 85% of the viewport — which works however tall the element is. Hidden states are written
 * as `.js …:not(.is-in)` in CSS, so content stays visible without JavaScript.
 *
 * `is-in` is added imperatively, so the targets' `className` must not be driven by React state
 * (a re-render would rewrite it and drop the class); use data attributes for state instead.
 */
export function useReveal<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }),
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    const targets = [...root.querySelectorAll(selector)];
    targets.forEach((el) => observer.observe(el));
    // Anything already scrolled past (e.g. arriving on a #hash link) is shown straight away.
    targets.forEach((el) => {
      if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in");
    });
    return () => observer.disconnect();
  }, [selector]);

  return ref;
}
