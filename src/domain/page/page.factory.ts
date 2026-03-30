import type { Page, CreatePageInput } from "./page.types";
import { generateId } from "@/infrastructure/id/id.service";

export function createPage(input: CreatePageInput = {}): Page {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: input.title ?? "Untitled",
    icon: input.icon ?? null,
    parentId: input.parentId ?? null,
    content: [],
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    sortOrder: Date.now(),
  };
}
