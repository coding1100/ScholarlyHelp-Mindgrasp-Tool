"use client";

import Image from "next/image";

export type ToolsApiLoaderProps = {
  show: boolean;
  /** Cover only the nearest positioned ancestor */
  contained?: boolean;
  /** Offset for the desktop tools sidebar (w-60) when using a full-area overlay */
  respectToolsSidebar?: boolean;
  className?: string;
};

export function ToolsApiLoader({
  show,
  contained = false,
  respectToolsSidebar = true,
  className = "",
}: ToolsApiLoaderProps) {
  if (!show) return null;

  const positionClasses = contained
    ? "absolute inset-0 z-50"
    : [
        "fixed inset-0 z-[100]",
        respectToolsSidebar ? "lg:left-60" : "",
      ].join(" ");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`${positionClasses} flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-[2px] pointer-events-auto ${className}`}
    >
      <Image
        src="/videos/icon.gif"
        alt=""
        width={160}
        height={160}
        unoptimized
        priority
        className="h-[clamp(3.5rem,16vmin,7.5rem)] w-[clamp(3.5rem,16vmin,7.5rem)] object-contain sm:h-[clamp(4rem,14vmin,8rem)] sm:w-[clamp(4rem,14vmin,8rem)] md:h-[clamp(4.5rem,12vmin,8.5rem)] md:w-[clamp(4.5rem,12vmin,8.5rem)]"
      />
    </div>
  );
}

/** Suspense fallback for /tools/* pages */
export function ToolsSuspenseFallback() {
  return <ToolsApiLoader show />;
}

export default ToolsApiLoader;
