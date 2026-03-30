export interface StoragePort<T extends { id: string }> {
  getAll(): T[];
  getById(id: string): T | null;
  save(item: T): void;
  saveAll(items: T[]): void;
  delete(id: string): void;
  clear(): void;
}
