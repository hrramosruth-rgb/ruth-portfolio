"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets the page theme from the section crossing the middle of the viewport: `data-theme="ink"` gives
 * the blush band (`body.is-ink`), `data-theme="night"` the black first page (`body.is-night`).
 * The nav follows the section directly beneath it instead (`body.nav-ink` / `body.nav-night`).
 */
export function SectionTheme() {
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const themeAt = (y: number) => {
        for (const section of document.querySelectorAll<HTMLElement>("[data-theme]")) {
          const box = section.getBoundingClientRect();
          if (box.top <= y && box.bottom > y) return section.dataset.theme ?? "paper";
        }
        return "paper";
      };
      const theme = themeAt(window.innerHeight / 2);
      const nav = themeAt(40);
      const body = document.body.classList;
      body.toggle("is-ink", theme === "ink");
      body.toggle("is-night", theme === "night");
      body.toggle("nav-ink", nav === "ink");
      body.toggle("nav-night", nav === "night");
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
