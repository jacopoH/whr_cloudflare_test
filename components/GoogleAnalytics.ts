"use client"; // Ensure it's a client component
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
    }
  }

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "G-S28S8LN2KR", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}