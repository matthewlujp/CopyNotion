import { describe, it, expect, beforeEach } from "vitest";
import { usePageStore, setPageStorage } from "@/stores/page.store";
import type { StoragePort } from "@/infrastructure/persistence/storage.interface";
import type { Page } from "@/domain/page/page.types";

function createMockStorage(): StoragePort<Page> {
  const store = new Map<string, Page>();
  return {
    getAll: () => Array.from(store.values()),
    getById: (id) => store.get(id) ?? null,
    save: (item) => store.set(item.id, item),
    saveAll: (items) => items.forEach((item) => store.set(item.id, item)),
    delete: (id) => store.delete(id),
    clear: () => store.clear(),
  };
}

beforeEach(() => {
  setPageStorage(createMockStorage());
  usePageStore.setState({
    pages: new Map(),
    isLoaded: false,
  });
});

describe("usePageStore", () => {
  it("starts with empty pages", () => {
    const { pages } = usePageStore.getState();
    expect(pages.size).toBe(0);
  });

  it("adds a page", () => {
    const page = usePageStore.getState().addPage({ title: "Test Page" });
    expect(page.title).toBe("Test Page");
    expect(usePageStore.getState().pages.size).toBe(1);
  });

  it("updates a page", () => {
    const page = usePageStore.getState().addPage({ title: "Original" });
    usePageStore.getState().updatePage(page.id, { title: "Updated" });
    const updated = usePageStore.getState().pages.get(page.id);
    expect(updated?.title).toBe("Updated");
  });

  it("deletes a page", () => {
    const page = usePageStore.getState().addPage({ title: "To Delete" });
    usePageStore.getState().deletePage(page.id);
    expect(usePageStore.getState().pages.size).toBe(0);
  });

  it("reparents children when deleting a parent", () => {
    const parent = usePageStore.getState().addPage({ title: "Parent" });
    const child = usePageStore
      .getState()
      .addPage({ title: "Child", parentId: parent.id });
    usePageStore.getState().deletePage(parent.id);
    const orphan = usePageStore.getState().pages.get(child.id);
    expect(orphan?.parentId).toBeNull();
  });

  it("builds a page tree", () => {
    const parent = usePageStore.getState().addPage({ title: "Parent" });
    usePageStore
      .getState()
      .addPage({ title: "Child", parentId: parent.id });
    const tree = usePageStore.getState().getPageTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].page.title).toBe("Parent");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].page.title).toBe("Child");
  });

  it("gets child pages for a parent", () => {
    const parent = usePageStore.getState().addPage({ title: "Parent" });
    usePageStore.getState().addPage({ title: "Child 1", parentId: parent.id });
    usePageStore.getState().addPage({ title: "Child 2", parentId: parent.id });
    const children = usePageStore.getState().getChildPages(parent.id);
    expect(children).toHaveLength(2);
  });

  it("loads pages from storage", () => {
    const mockStorage = createMockStorage();
    const page: Page = {
      id: "loaded-1",
      title: "Loaded",
      icon: null,
      parentId: null,
      content: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      sortOrder: 1,
    };
    mockStorage.save(page);
    setPageStorage(mockStorage);
    usePageStore.getState().loadPages();
    expect(usePageStore.getState().pages.get("loaded-1")?.title).toBe(
      "Loaded"
    );
    expect(usePageStore.getState().isLoaded).toBe(true);
  });
});
