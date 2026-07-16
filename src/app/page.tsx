"use client";

import Hero from "@/components/Hero";
import PreLoadingShow from "@/components/PreLoadingShow";
import ScrollSection from "@/components/SmoothScroll";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloaderShown = sessionStorage.getItem("preloaderShown");

    if (preloaderShown) {
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("preloaderShown", "true");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Innholdet rendres og laster bak preloaderen */}
      <ScrollSection>
        <div className="relative">
          <Hero />
        </div>
      </ScrollSection>

      <AnimatePresence>
        {isLoading && <PreLoadingShow key="preloader" />}
      </AnimatePresence>
    </main>
  );
}
