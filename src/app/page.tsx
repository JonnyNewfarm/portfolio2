"use client";

import Hero from "@/components/Hero";
import PreLoadingShow from "@/components/PreLoadingShow";
import ScrollSection from "@/components/SmoothScroll";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloaderShown = sessionStorage.getItem("preloaderShown");

    if (preloaderShown) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("preloaderShown", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ScrollSection>
      {isLoading && <PreLoadingShow />}
      <div className="relative">
        <Hero />
      </div>
    </ScrollSection>
  );
}
