"use client";

import { Plus, PanelLeftClose } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace.store";
import { usePageStore } from "@/stores/page.store";
import { useUIStore } from "@/stores/ui.store";

export function SidebarHeader() {
  const workspaceName = useWorkspaceStore((s) => s.name);
  const addPage = usePageStore((s) => s.addPage);
  const setActivePage = useUIStore((s) => s.setActivePage);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  function handleNewPage() {
    const page = addPage();
    setActivePage(page.id);
  }

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-sm font-semibold text-notion-text truncate">
        {workspaceName}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          onClick={handleNewPage}
          className="rounded p-1 text-notion-text-secondary hover:bg-notion-sidebar-hover"
          aria-label="New page"
          title="New page"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-notion-text-secondary hover:bg-notion-sidebar-hover"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>
    </div>
  );
}
