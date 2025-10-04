"use client";

import { useState, useEffect } from "react";
import HeroSection from "./Hero";

export default function HeroSectionWithLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 1; // Increase by 1% every tick
      });
    }, 15); // adjust speed (15ms → ~1.5s for full load)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#ececec] z-50">
          <div className="text-2xl font-bold mb-4">{progress}%</div>
        </div>
      )}
      {!loading && <HeroSection />}
    </div>
  );
}
