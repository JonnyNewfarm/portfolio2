"use client";

import { useEffect, useState } from "react";

import SmoothScroll from "@/components/SmoothScroll";

import DesktopWorkCarousel from "./DesktopWorkCarousel";
import MobileProjects from "./MobileProjects";

export default function ProjectsClient() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    const updateTheme = () => {
      setIsDark(htmlElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SmoothScroll>
      <section
        className="
          relative
          min-h-screen
          w-full
          bg-[#ececec] 
text-[#211f1e]
dark:bg-[#1e1c1a]
dark:text-[#e7e3dd]
          
          transition-colors
          duration-500
          
          md:h-screen
        "
      >
        <DesktopWorkCarousel
          activeProjectIndex={activeProjectIndex}
          setActiveProjectIndex={setActiveProjectIndex}
          isDark={isDark}
        />

        <MobileProjects />
      </section>
    </SmoothScroll>
  );
}
