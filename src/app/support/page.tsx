"use client";

import { getPreferredLocale } from "@/i18n/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * `/support` is a short, shareable link to the report-a-problem page. It is a
 * real static route (not the `[...path]` catch-all, which would send it to
 * `/<locale>/support` and 404), and the locale is resolved on the client the
 * same way as the other entry points — the export has no server to read
 * headers with.
 */
export default function SupportPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${getPreferredLocale()}/report-problem`);
  }, [router]);

  return null;
}
