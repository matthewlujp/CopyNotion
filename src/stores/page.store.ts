import { create } from "zustand";
import type {
  Page,
  PageTreeNode,
  CreatePageInput,
  UpdatePageInput,
} from "@/domain/page/page.types";
import { createPage } from "@/domain/page/page.factory";
import type { StoragePort } from "@/infrastructure/persistence/storage.interface";
import { LocalStorageAdapter } from "@/infrastructure/persistence/local-storage.adapter";

interface PageState {
  pages: Map<string, Page>;
  isLoaded: boolean;
}

interface PageActions {
  loadPages(): void;
  addPage(input?: CreatePageInput): Page;
  updatePage(id: string, input: UpdatePageInput): void;
  deletePage(id: string): void;
  getPageTree(): PageTreeNode[];
  getChildPages(parentId: string | null): Page[];
}

type PageStore = PageState & PageActions;

let storage: StoragePort<Page> | null = null;

function getStorage(): StoragePort<Page> {
  if (!storage) {
    storage = new LocalStorageAdapter<Page>("ruflo-pages");
  }
  return storage;
}

export function setPageStorage(s: StoragePort<Page>): void {
  storage = s;
}

export const usePageStore = create<PageStore>((set, get) => ({
  pages: new Map(),
  isLoaded: false,

  loadPages() {
    const items = getStorage().getAll();
    const pages = new Map<string, Page>();
    for (const item of items) {
      pages.set(item.id, item);
    }
    set({ pages, isLoaded: true });
  },

  addPage(input?: CreatePageInput): Page {
    const page = createPage(input);
    const pages = new Map(get().pages);
    pages.set(page.id, page);
    set({ pages });
    getStorage().save(page);
    return page;
  },

  updatePage(id: string, input: UpdatePageInput) {
    const pages = new Map(get().pages);
    const existing = pages.get(id);
    if (!existing) return;
    const updated: Page = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    pages.set(id, updated);
    set({ pages });
    getStorage().save(updated);
  },

  deletePage(id: string) {
    const pages = new Map(get().pages);
    // Reparent children to deleted page's parent
    const deleted = pages.get(id);
    if (!deleted) return;
    for (const page of Array.from(pages.values())) {
      if (page.parentId === id) {
        const reparented = { ...page, parentId: deleted.parentId };
        pages.set(page.id, reparented);
        getStorage().save(reparented);
      }
    }
    pages.delete(id);
    set({ pages });
    getStorage().delete(id);
  },

  getChildPages(parentId: string | null): Page[] {
    const { pages } = get();
    return Array.from(pages.values())
      .filter((p) => p.parentId === parentId && !p.isArchived)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getPageTree(): PageTreeNode[] {
    const { getChildPages } = get();

    function buildTree(parentId: string | null): PageTreeNode[] {
      return getChildPages(parentId).map((page) => ({
        page,
        children: buildTree(page.id),
        isExpanded: false,
      }));
    }

    return buildTree(null);
  },
}));
