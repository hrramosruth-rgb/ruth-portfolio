"use client";

import { useEffect } from "react";
import { Monogram } from "@/components/brand/monogram";

declare global {
  interface Window {
    __rrHydrated?: boolean;
  }
}

/**
 * Re-mounts on every navigation. After the first page (which has the loader), each client-side
 * navigation reveals the new page by lifting a paper curtain.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = typeof window !== "undefined" && window.__rrHydrated === true;

  useEffect(() => {
    window.__rrHydrated = true;
  }, []);

  return (
    <>
      {curtain ? (
        <div className="curtain" aria-hidden="true">
          <span className="curtain-mark">
            <Monogram />
          </span>
        </div>
      ) : null}
      {children}
    </>
  );
}
