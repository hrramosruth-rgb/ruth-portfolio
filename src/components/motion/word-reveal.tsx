"use client";

import { useEffect, useRef } from "react";
import type { Segment } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

type WordRevealProps = { segments: readonly Segment[]; className?: string; tail?: React.ReactNode };

/** A paragraph whose words light up in reading order as it scrolls through the viewport. */
export function WordReveal({ segments, className, tail }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>(".word")];
    if (prefersReducedMotion()) {
      words.forEach((word) => word.classList.add("is-lit"));
      return;
    }
    el.classList.add("is-armed");

    let raf = 0;
    const update = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.8 - box.top) / (box.height + vh * 0.2), 0), 1);
      const lit = Math.floor(progress * words.length * 1.1);
      words.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {segments.map((segment, s) => {
        const words = segment.text.split(/(\s+)/);
        const content = words.map((word, w) =>
          /^\s*$/.test(word) ? word : (
            <span key={w} className="word">
              {word}
            </span>
          ),
        );
        return segment.em ? <em key={s}>{content}</em> : <span key={s}>{content}</span>;
      })}
      {tail ? <span className="word">{tail}</span> : null}
    </p>
  );
}
