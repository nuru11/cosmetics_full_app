import { useEffect, useState } from "react";

/**
 * Increments a counter on an interval so relative time labels re-render.
 * Pauses while the tab is hidden; refreshes immediately when visible again.
 */
export function useTimeAgoTick(intervalMs = 1_000): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((n) => n + 1);

    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      bump();
    }, intervalMs);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        bump();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs]);

  return tick;
}
