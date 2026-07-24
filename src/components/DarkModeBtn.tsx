"use client";

import { useEffect, useState } from "react";
import { CiSun } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";

export default function DarkModeBtn() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateThemeState = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateThemeState();

    const observer = new MutationObserver(updateThemeState);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");

    setIsDark(document.documentElement.classList.contains("dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        z-[200]
        flex
        cursor-pointer
        items-center
        justify-center
        gap-x-2
        bg-[#161310]
        px-3
        py-2
        text-base
        font-semibold
        uppercase
        text-stone-300
        dark:bg-stone-300
        dark:text-[#161310]
      "
    >
      {isDark ? (
        <>
          Light mode
          <CiSun size={20} />
        </>
      ) : (
        <>
          Dark mode
          <IoMoonOutline size={20} />
        </>
      )}
    </button>
  );
}
