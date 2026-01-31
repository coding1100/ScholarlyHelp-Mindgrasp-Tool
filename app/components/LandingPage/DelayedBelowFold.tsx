"use client";

import { ReactNode, useEffect, useState } from "react";

interface DelayedBelowFoldProps {
    children: ReactNode;
    delay?: number;
}

/**
 * Delays the rendering of its children by a specified amount of time (default 2s).
 * This is used to ensure the browser prioritizes the Hero section for LCP optimization.
 */
export default function DelayedBelowFold({ children, delay = 2000 }: DelayedBelowFoldProps) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!shouldRender) {
        return null;
    }

    return <>{children}</>;
}
