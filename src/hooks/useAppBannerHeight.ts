"use client";

import { RefObject, useCallback, useEffect } from "react";

const CSS_VAR = "--app-banner-height";

/**
 * Which banner currently owns the `--app-banner-height` slot.
 *
 * The promo, free-app and app-install banners all publish their height into
 * that one variable, and only one of them is ever on screen — but the handover
 * is asynchronous: the outgoing banner's exit animation finishes ~300ms *after*
 * the incoming one has already measured itself. Without an owner check the
 * late "I'm gone, reset to 0" wiped the height the new banner had just
 * published, and the layout underneath slid back up so the banner floated over
 * it.
 */
let owner: string | null = null;

/**
 * Keep `--app-banner-height` in sync with a top banner's measured height while
 * it is visible, and release it (back to 0) when it goes away — but only if the
 * banner still owns the slot. Returns that release function so the exit
 * animation can call it too.
 */
export function useAppBannerHeight(
  id: string,
  visible: boolean,
  ref: RefObject<HTMLElement | null>,
) {
  const publish = useCallback(
    (height: number) => {
      owner = id;
      document.documentElement.style.setProperty(CSS_VAR, `${height}px`);
    },
    [id],
  );

  const release = useCallback(() => {
    if (owner !== id) return;
    owner = null;
    document.documentElement.style.setProperty(CSS_VAR, "0px");
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!visible || !el) {
      release();
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        publish(entry.contentRect.height);
      }
    });
    observer.observe(el);
    // Initial measurement
    publish(el.offsetHeight);

    return () => {
      observer.disconnect();
      release();
    };
  }, [visible, publish, release, ref]);

  return release;
}
