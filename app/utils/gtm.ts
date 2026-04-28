export type GTMEventPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Push an event to GTM's dataLayer safely (client-side only).
 * - No-ops during SSR
 * - Works even if GTM hasn't loaded yet (dataLayer will queue)
 */
export function pushToDataLayer(event: string, payload: GTMEventPayload = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  } catch {
    // Never break UX if tracking fails
  }
}

