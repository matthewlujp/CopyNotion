import { describe, it, expect } from "vitest";
import { createPage } from "@/domain/page/page.factory";

describe("createPage", () => {
  it("creates a page with default values", () => {
    const page = createPage();
    expect(page.id).toBeDefined();
    expect(page.title).toBe("Untitled");
    expect(page.icon).toBeNull();
    expect(page.parentId).toBeNull();
    expect(page.content).toEqual([]);
    expect(page.isArchived).toBe(false);
    expect(page.createdAt).toBeDefined();
    expect(page.updatedAt).toBeDefined();
    expect(page.sortOrder).toBeGreaterThan(0);
  });

  it("creates a page with custom title", () => {
    const page = createPage({ title: "My Notes" });
    expect(page.title).toBe("My Notes");
  });

  it("creates a page with parent ID", () => {
    const page = createPage({ parentId: "parent-123" });
    expect(page.parentId).toBe("parent-123");
  });

  it("creates a page with icon", () => {
    const page = createPage({ icon: "📝" });
    expect(page.icon).toBe("📝");
  });

  it("generates unique IDs for each page", () => {
    const page1 = createPage();
    const page2 = createPage();
    expect(page1.id).not.toBe(page2.id);
  });
});
