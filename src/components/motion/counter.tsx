"use client";

import { useEffect, useRef } from "react";
import type { Figure } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

const DURATION = 1800;

export function formatFigure(figure: Figure, value = figure.value) {
  return `${figure.prefix ?? ""}${value.toLocaleString("en-US")}${figure.suffix ?? ""}`;
}

/** Renders the final figure on the server; counts up from zero once it is half visible. */
export function Counter({ figure, className }: { figure: Figure; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.textContent = formatFigure(figure, 0);

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min((now - start) / DURATION, 1);
          el.textContent = formatFigure(figure, Math.round((1 - (1 - k) ** 4) * figure.value));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [figure]);

  return (
    <b ref={ref} className={className}>
      {formatFigure(figure)}
    </b>
  );
}
