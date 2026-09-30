"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** A small difference-blended dot that grows into a labelled disc over `[data-cursor]` elements. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const ease = prefersReducedMotion() ? 1 : 0.22;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      el.classList.add("is-on");
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.<HTMLElement>("[data-cursor]");
      if (target && label.current) {
        label.current.textContent = target.dataset.cursor ?? "";
        el.classList.add("is-big");
      } else {
        el.classList.remove("is-big");
      }
    };
    const leave = () => el.classList.remove("is-on");
    const loop = () => {
      cx += (x - cx) * ease;
      cy += (y - cy) * ease;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    html.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      html.removeEventListener("pointerleave", leave);
      html.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    ref.current?.classList.remove("is-big");
  }, [pathname]);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
