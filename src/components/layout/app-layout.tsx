"use client";

import { PanelLeftOpen } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const sidebarWidth = useUIStore((s) => s.sidebarWidth);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="flex h-screen overflow-hidden bg-notion-bg">
      {/* Sidebar */}
      <div
        className={cn(
          "shrink-0 border-r border-notion-border transition-all duration-200 overflow-hidden",
          isSidebarOpen ? "opacity-100" : "w-0 opacity-0"
        )}
        style={{ width: isSidebarOpen ? sidebarWidth : 0 }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        {!isSidebarOpen && (
          <div className="flex items-center px-3 py-2 border-b border-notion-border">
            <button
              onClick={toggleSidebar}
              className="rounded p-1 text-notion-text-secondary hover:bg-notion-bg-hover"
              aria-label="Open sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
