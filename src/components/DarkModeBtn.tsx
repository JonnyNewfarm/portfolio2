import { useEffect, useState } from "react";

export default function DarkModeBtn() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 text-stone-200 text-sm md:text-lg md:dark:text-stone-200 md:text-stone-800 cursor-pointer font-semibold  border-2 rounded-[3px] border-stone-200 md:dark:border-stone-200 md:border-stone-800"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
