"use client";

import { useEffect, useRef } from "react";
import { Monogram } from "@/components/brand/monogram";

const DURATION = 2000;
const SESSION_KEY = "rr-loaded";

/**
 * Monogram + counter intro, once per browser session. The boot script in the layout adds
 * `is-loaded is-ready` to <html> up front for returning visits and reduced motion, which hides this.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("is-loaded")) return;

    const timers: number[] = [];
    const start = performance.now();
    let raf = 0;

    const finish = () => {
      root.current?.classList.add("is-leaving");
      timers.push(window.setTimeout(() => html.classList.add("is-ready"), 250));
      timers.push(window.setTimeout(() => html.classList.add("is-loaded"), 1400));
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Storage can be blocked; the intro simply plays again next time.
      }
    };

    const tick = (now: number) => {
      const k = Math.min((now - start) / DURATION, 1);
      const eased = 1 - (1 - k) ** 3;
      if (count.current) count.current.textContent = String(Math.round(eased * 100));
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (k < 1) raf = requestAnimationFrame(tick);
      else timers.push(window.setTimeout(finish, 200));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden="true">
      <div className="loader-mark">
        <Monogram />
      </div>
      <div className="loader-foot">
        <span className="ui">Ruth Ramos — Portfolio MMXXVI</span>
        <span ref={count} className="loader-count">
          0
        </span>
      </div>
      <i ref={bar} className="loader-bar" />
    </div>
  );
}
