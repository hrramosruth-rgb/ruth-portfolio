"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Monogram } from "@/components/brand/monogram";

declare global {
  interface Window {
    __rrHydrated?: boolean;
  }
}

/**
 * After the first page (which has the loader), every client-side navigation reveals the new page
 * by lifting a paper curtain. The curtain is keyed on the pathname because this root template is
 * not re-mounted between pages that share a segment (e.g. /work/a → /work/b).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const curtain = typeof window !== "undefined" && window.__rrHydrated === true;

  useEffect(() => {
    window.__rrHydrated = true;
  }, []);

  return (
    <>
      {curtain ? (
        <div key={pathname} className="curtain" aria-hidden="true">
          <span className="curtain-mark">
            <Monogram />
          </span>
        </div>
      ) : null}
      {children}
    </>
  );
}
