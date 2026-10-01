"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `is-in` to every element matching `selector` inside the returned ref once it scrolls into
 * view. Hidden states are written as `.js …:not(.is-in)` in CSS, so content stays visible without
 * JavaScript.
 */
export function useReveal<T extends HTMLElement>(selector: string, threshold = 0.2) {
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
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    root.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, threshold]);

  return ref;
}
