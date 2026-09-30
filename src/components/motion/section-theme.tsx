"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Switches the page to ink while a `data-theme="ink"` section crosses the middle of the viewport. */
export function SectionTheme() {
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let ink = false;
      for (const section of document.querySelectorAll<HTMLElement>("[data-theme]")) {
        const box = section.getBoundingClientRect();
        if (box.top <= mid && box.bottom > mid) {
          ink = section.dataset.theme === "ink";
          break;
        }
      }
      document.body.classList.toggle("is-ink", ink);
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
  }, [pathname]);

  return null;
}
