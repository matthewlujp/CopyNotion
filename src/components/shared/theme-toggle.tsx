"use client";

import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-notion-text-secondary hover:bg-notion-sidebar-hover w-full"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
