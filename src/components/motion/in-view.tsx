"use client";

import { useEffect, useRef } from "react";

type InViewProps = {
  children: React.ReactNode;
  className?: string;
  /** Fraction of the element that must be visible. */
  threshold?: number;
};

/** Adds `is-in` to every `.split` inside once the block scrolls into view. */
export function InView({ children, className, threshold = 0.35 }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.querySelectorAll(".split").forEach((split) => split.classList.add("is-in"));
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
