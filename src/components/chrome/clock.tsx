"use client";

import { useMemo, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};

/** Live local time for the nav, e.g. "Madrid 14:32". Renders "--:--" on the server. */
export function Clock({ city, timeZone }: { city: string; timeZone: string }) {
  const format = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }),
    [timeZone],
  );
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(new Date()),
    () => "--:--",
  );
  return (
    <span className="nav-clock">
      {city} <time>{time}</time>
    </span>
  );
}
