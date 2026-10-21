"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-24 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="inline-flex items-center p-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-sm transition-colors duration-200"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Switch to light theme"
        className={`flex items-center justify-center h-7 w-7 rounded-full text-xs transition-all duration-200 ${
          theme === "light"
            ? "bg-white text-stone-900 shadow-sm font-medium"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark theme"
        className={`flex items-center justify-center h-7 w-7 rounded-full text-xs transition-all duration-200 ${
          theme === "dark"
            ? "bg-stone-800 text-stone-100 shadow-sm font-medium"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="Switch to system theme"
        className={`flex items-center justify-center h-7 w-7 rounded-full text-xs transition-all duration-200 ${
          theme === "system"
            ? "bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-medium"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        }`}
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
