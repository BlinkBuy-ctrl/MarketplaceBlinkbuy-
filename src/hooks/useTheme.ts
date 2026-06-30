import { useState, useEffect } from "react";

const KEY = "marketplace_theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as "light" | "dark") || "dark";
    setThemeState(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    localStorage.setItem(KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return { theme, toggleTheme };
}
