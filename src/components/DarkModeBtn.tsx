"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeBtn() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents server/client mismatch

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
