"use client";

import { useEffect } from "react";
import { usePageStore } from "@/stores/page.store";
import { useUIStore } from "@/stores/ui.store";

export function useKeyboardShortcuts() {
  const addPage = usePageStore((s) => s.addPage);
  const setActivePage = useUIStore((s) => s.setActivePage);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const activePageId = useUIStore((s) => s.activePageId);
  const deletePage = usePageStore((s) => s.deletePage);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      // Cmd+N: New page
      if (meta && e.key === "n") {
        e.preventDefault();
        const page = addPage();
        setActivePage(page.id);
      }

      // Cmd+\: Toggle sidebar
      if (meta && e.key === "\\") {
        e.preventDefault();
        toggleSidebar();
      }

      // Cmd+Shift+D: Delete active page
      if (meta && e.shiftKey && e.key === "D") {
        e.preventDefault();
        if (activePageId) {
          deletePage(activePageId);
          setActivePage(null);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addPage, setActivePage, toggleSidebar, activePageId, deletePage]);
}
