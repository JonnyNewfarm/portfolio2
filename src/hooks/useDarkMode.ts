"use client";
import { useEffect, useState } from "react";

export default function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    // run once to sync
    check();

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // attributeFilter ensures only 'class' changes appear, but double-check
        if (m.type === "attributes" && (m.target as Element).classList) {
          check();
          break;
        }
      }
    });

    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  return isDark;
}
