import type { Block } from "@/domain/block/block.types";

export interface Page {
  id: string;
  title: string;
  icon: string | null;
  parentId: string | null;
  content: Block[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  sortOrder: number;
}

export interface PageTreeNode {
  page: Page;
  children: PageTreeNode[];
  isExpanded: boolean;
}

export interface CreatePageInput {
  title?: string;
  parentId?: string | null;
  icon?: string;
}

export type UpdatePageInput = Partial<
  Pick<
    Page,
    "title" | "icon" | "content" | "parentId" | "isArchived" | "sortOrder"
  >
>;
