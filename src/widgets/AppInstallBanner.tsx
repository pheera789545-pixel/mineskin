"use client";

import IconButton from "@/components/IconButton/IconButton";
import * as Icons from "@/components/Icons/Icons";
import { usePopupQueue } from "@/contexts/PopupQueueContext";
import { isNativeWebview } from "@/hooks/useNativeWebview";
import { useAppBannerHeight } from "@/hooks/useAppBannerHeight";
import { useDictionary } from "@/i18n/DictionaryContext";
import { isPromoActive } from "@/lib/promo";
import {
  STORE_LINKS,
  detectStorePlatform,
  type MaybeStorePlatform,
} from "@/lib/storeLinks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "app-install-banner-dismissed";
const VISIT_COUNT_KEY = "mineskin-visit-count";
const VISIT_THRESHOLD = 1; // Show banner on first visit (set to 1 or higher to require multiple visits)

export default function AppInstallBanner() {
  const { dictionary } = useDictionary();
  const { registerPopup, unregisterPopup, isActivePopup } = usePopupQueue();
  const [platform, setPlatform] = useState<MaybeStorePlatform>(null);
  const visible = isActivePopup("appInstallBanner");
  const bannerRef = useRef<HTMLDivElement>(null);

  const releaseBannerHeight = useAppBannerHeight(
    "appInstallBanner",
    visible,
    bannerRef,
  );

  useEffect(() => {
    if (isNativeWebview()) return;
    // During the launch sale the promo banner replaces this one; stand aside
    // so we don't compete for the same slot. Reverts automatically once the
    // sale ends.
    if (isPromoActive()) return;
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (isStandalone) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const detected = detectStorePlatform();
    if (!detected) return;

    const visits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
    if (visits < VISIT_THRESHOLD) return;

    setPlatform(detected);
    const timer = setTimeout(() => {
      registerPopup("appInstallBanner");
      window.gtag?.("event", "app_banner_view", { platform: detected });
    }, 800);
    return () => clearTimeout(timer);
  }, [registerPopup]);


  const handleDismiss = () => {
    unregisterPopup("appInstallBanner");
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const storeUrl = platform ? STORE_LINKS[platform] : "#";
  const storeName =
    platform === "android"
      ? dictionary.appBanner.googlePlay
      : dictionary.appBanner.appStore;

  return (
    <AnimatePresence>
      {visible && platform && (
        <motion.div
          ref={bannerRef}
          className="fixed top-0 inset-x-0 z-1999"
          initial={{ y: -80, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 24, stiffness: 260 },
          }}
          exit={{ y: -80, opacity: 0, transition: { duration: 0.3 } }}
          onAnimationComplete={(def: { opacity?: number }) => {
            // Reset the height once the exit animation completes — unless a
            // higher-priority banner has already claimed the slot.
            if (def.opacity === 0) releaseBannerHeight();
          }}
        >
          <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 safe-area-pt">
            <div className="flex items-center gap-3 px-3 py-2">
              {/* Close */}
              <IconButton
                onClick={handleDismiss}
                label={dictionary.appBanner.dismiss}
                className="shrink-0 -ml-1"
              >
                <Icons.Close />
              </IconButton>

              {/* App icon */}
              <img
                src="/icon-144x144.png"
                alt="MineSkin"
                width={36}
                height={36}
                className="rounded-lg shrink-0"
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">
                  MineSkin Pro
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {storeName}
                </p>
              </div>

              {/* CTA */}
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.gtag?.("event", "app_banner_click", { platform });
                  window.gtag?.("event", "store_visit", {
                    platform,
                    source: "app_banner",
                  });
                }}
                className="shrink-0 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                {dictionary.appBanner.view}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
