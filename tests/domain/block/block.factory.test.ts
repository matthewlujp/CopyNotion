import { describe, it, expect } from "vitest";
import { createDefaultBlock } from "@/domain/block/block.factory";

describe("createDefaultBlock", () => {
  it("creates a paragraph block by default", () => {
    const block = createDefaultBlock();
    expect(block.type).toBe("paragraph");
    expect(block.id).toBeDefined();
    expect(block.props).toEqual({});
    expect(block.content).toEqual([]);
    expect(block.children).toEqual([]);
  });

  it("generates unique IDs", () => {
    const block1 = createDefaultBlock();
    const block2 = createDefaultBlock();
    expect(block1.id).not.toBe(block2.id);
  });
});
