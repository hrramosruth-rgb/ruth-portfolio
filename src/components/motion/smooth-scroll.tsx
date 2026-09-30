"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

let lenis: Lenis | null = null;

/** The running Lenis instance, or null under reduced motion. */
export function getLenis() {
  return lenis;
}

function scrollToHashOrTop() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) {
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else target.scrollIntoView();
  } else if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Weighted smooth scrolling (Lenis) with smooth same-page anchor links. Off under reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.085 });
    lenis = instance;

    let raf = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    });

    // Capture phase, so a same-page "/#work" link scrolls smoothly instead of letting Next jump.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      instance.scrollTo(target, { duration: 1.6 });
      window.history.replaceState(window.history.state, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      instance.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    scrollToHashOrTop();
  }, [pathname]);

  return null;
}
