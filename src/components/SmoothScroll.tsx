"use client";

import { useEffect, useContext, createContext, useState } from "react";
import Lenis from "lenis";

const SmoothScrollerContext = createContext<Lenis | null>(null);

export const useSmoothScroller = () => useContext(SmoothScrollerContext);

export default function ScrollSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisRef, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const scroller = new Lenis();
    setLenis(scroller); // Update state with Lenis instance

    // Smooth scroll loop
    const raf = (time: number) => {
      scroller.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      scroller.destroy(); // Cleanup on unmount
    };
  }, []);

  return (
    <SmoothScrollerContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollerContext.Provider>
  );
}
