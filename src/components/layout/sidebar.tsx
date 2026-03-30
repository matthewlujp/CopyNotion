"use client";

import { SidebarHeader } from "./sidebar-header";
import { PageTree } from "./page-tree";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-notion-sidebar">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto relative">
        <PageTree />
      </div>
      <div className="border-t border-notion-border px-2 py-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
