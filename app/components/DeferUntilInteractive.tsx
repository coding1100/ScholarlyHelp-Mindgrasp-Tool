"use client";

import { ReactNode, useEffect, useState } from "react";

type DeferUntilInteractiveProps = {
  children: ReactNode;
};

/**
 * Generic wrapper that renders its children only after the page
 * is interactive on the client (post-hydration, when the main
 * thread is idle or after a short timeout).
 *
 * Good for deferring below-the-fold or non-critical sections
 * to improve mobile LCP and initial CSS/JS cost.
 */
export default function DeferUntilInteractive({
  children,
}: DeferUntilInteractiveProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const start = () => setReady(true);

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(start, { timeout: 3000 });
    } else {
      // Fallback: schedule right after first paint
      setTimeout(start, 0);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

