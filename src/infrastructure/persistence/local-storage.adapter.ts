import type { StoragePort } from "./storage.interface";
import { safeJsonParse, safeJsonStringify } from "./serialization";

export class LocalStorageAdapter<T extends { id: string }>
  implements StoragePort<T>
{
  private cache: Map<string, T>;

  constructor(private readonly storageKey: string) {
    this.cache = new Map();
    this.loadFromStorage();
  }

  getAll(): T[] {
    return Array.from(this.cache.values());
  }

  getById(id: string): T | null {
    return this.cache.get(id) ?? null;
  }

  save(item: T): void {
    this.cache.set(item.id, item);
    this.persistToStorage();
  }

  saveAll(items: T[]): void {
    for (const item of items) {
      this.cache.set(item.id, item);
    }
    this.persistToStorage();
  }

  delete(id: string): void {
    this.cache.delete(id);
    this.persistToStorage();
  }

  clear(): void {
    this.cache.clear();
    this.persistToStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    const items = safeJsonParse<T[]>(raw, []);
    for (const item of items) {
      if (item && typeof item === "object" && "id" in item) {
        this.cache.set(item.id, item);
      }
    }
  }

  private persistToStorage(): void {
    if (typeof window === "undefined") return;
    const data = safeJsonStringify(Array.from(this.cache.values()));
    localStorage.setItem(this.storageKey, data);
  }
}
