import { useEffect, useState } from "react";

export default function DarkModeBtn() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check the current theme
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2  border rounded-[3px] border-stone-900 dark:border-stone-300 text-stone-900 dark:text-stone-100"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
