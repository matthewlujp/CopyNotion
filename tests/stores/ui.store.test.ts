import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/stores/ui.store";

beforeEach(() => {
  useUIStore.setState({
    activePageId: null,
    isSidebarOpen: true,
    theme: "light",
    sidebarWidth: 240,
    expandedPageIds: new Set(),
  });
});

describe("useUIStore", () => {
  it("sets active page", () => {
    useUIStore.getState().setActivePage("page-1");
    expect(useUIStore.getState().activePageId).toBe("page-1");
  });

  it("clears active page", () => {
    useUIStore.getState().setActivePage("page-1");
    useUIStore.getState().setActivePage(null);
    expect(useUIStore.getState().activePageId).toBeNull();
  });

  it("toggles sidebar", () => {
    expect(useUIStore.getState().isSidebarOpen).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);
  });

  it("sets theme", () => {
    useUIStore.getState().setTheme("dark");
    expect(useUIStore.getState().theme).toBe("dark");
  });

  it("clamps sidebar width", () => {
    useUIStore.getState().setSidebarWidth(100);
    expect(useUIStore.getState().sidebarWidth).toBe(180);
    useUIStore.getState().setSidebarWidth(600);
    expect(useUIStore.getState().sidebarWidth).toBe(480);
  });

  it("toggles page expanded state", () => {
    useUIStore.getState().togglePageExpanded("page-1");
    expect(useUIStore.getState().isPageExpanded("page-1")).toBe(true);
    useUIStore.getState().togglePageExpanded("page-1");
    expect(useUIStore.getState().isPageExpanded("page-1")).toBe(false);
  });
});
