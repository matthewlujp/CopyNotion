import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageAdapter } from "@/infrastructure/persistence/local-storage.adapter";

interface TestItem {
  id: string;
  name: string;
}

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
    clear: () => mockStorage.clear(),
  });
});

describe("LocalStorageAdapter", () => {
  it("starts empty", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    expect(adapter.getAll()).toEqual([]);
  });

  it("saves and retrieves an item", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    const item = { id: "1", name: "Test" };
    adapter.save(item);
    expect(adapter.getById("1")).toEqual(item);
  });

  it("returns null for non-existent item", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    expect(adapter.getById("missing")).toBeNull();
  });

  it("deletes an item", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    adapter.save({ id: "1", name: "Test" });
    adapter.delete("1");
    expect(adapter.getById("1")).toBeNull();
    expect(adapter.getAll()).toEqual([]);
  });

  it("clears all items", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    adapter.save({ id: "1", name: "A" });
    adapter.save({ id: "2", name: "B" });
    adapter.clear();
    expect(adapter.getAll()).toEqual([]);
  });

  it("persists to localStorage", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test-key");
    adapter.save({ id: "1", name: "Persisted" });
    const stored = mockStorage.get("test-key");
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toEqual([{ id: "1", name: "Persisted" }]);
  });

  it("loads from localStorage on construction", () => {
    mockStorage.set("test-key", JSON.stringify([{ id: "1", name: "Loaded" }]));
    const adapter = new LocalStorageAdapter<TestItem>("test-key");
    expect(adapter.getById("1")).toEqual({ id: "1", name: "Loaded" });
  });

  it("handles corrupted localStorage gracefully", () => {
    mockStorage.set("test-key", "not valid json");
    const adapter = new LocalStorageAdapter<TestItem>("test-key");
    expect(adapter.getAll()).toEqual([]);
  });

  it("saveAll saves multiple items", () => {
    const adapter = new LocalStorageAdapter<TestItem>("test");
    adapter.saveAll([
      { id: "1", name: "A" },
      { id: "2", name: "B" },
    ]);
    expect(adapter.getAll()).toHaveLength(2);
  });
});
