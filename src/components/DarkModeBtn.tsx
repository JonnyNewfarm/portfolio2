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
      className="px-4 py-2 text-stone-200 text-sm md:text-lg  cursor-pointer font-semibold  border-2 border-stone-200 uppercase "
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
