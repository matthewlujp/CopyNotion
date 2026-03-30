"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";
import { usePageStore } from "@/stores/page.store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);
  const loadPages = usePageStore((s) => s.loadPages);

  useKeyboardShortcuts();

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return <>{children}</>;
}
