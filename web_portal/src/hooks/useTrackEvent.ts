"use client";

export const useTrackEvent = () => {
  const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
    const w = window as Window & typeof globalThis & { gtag?: (type: string, name: string, params?: Record<string, unknown>) => void };
    if (typeof window !== "undefined" && w.gtag) {
      w.gtag("event", eventName, eventParams);
    } else {
      console.warn(`GA4 Event Blocked (no gtag): ${eventName}`, eventParams);
    }
  };

  return { trackEvent };
};
