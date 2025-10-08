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
      className="px-4 py-2 text-stone-100 md:dark:text-stone-100 md:text-stone-900 cursor-pointer  border rounded-[3px] border-stone-100 md:dark:border-stone-100 md:border-stone-900"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
