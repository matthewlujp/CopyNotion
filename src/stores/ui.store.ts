import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface UIState {
  activePageId: string | null;
  isSidebarOpen: boolean;
  theme: Theme;
  sidebarWidth: number;
  expandedPageIds: Set<string>;
}

interface UIActions {
  setActivePage(id: string | null): void;
  toggleSidebar(): void;
  setTheme(theme: Theme): void;
  setSidebarWidth(width: number): void;
  togglePageExpanded(id: string): void;
  isPageExpanded(id: string): boolean;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  activePageId: null,
  isSidebarOpen: true,
  theme: "light",
  sidebarWidth: 240,
  expandedPageIds: new Set<string>(),

  setActivePage(id: string | null) {
    set({ activePageId: id });
  },

  toggleSidebar() {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setTheme(theme: Theme) {
    set({ theme });
  },

  setSidebarWidth(width: number) {
    set({ sidebarWidth: Math.max(180, Math.min(480, width)) });
  },

  togglePageExpanded(id: string) {
    set((state) => {
      const next = new Set(state.expandedPageIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedPageIds: next };
    });
  },

  isPageExpanded(id: string): boolean {
    return get().expandedPageIds.has(id);
  },
}));
