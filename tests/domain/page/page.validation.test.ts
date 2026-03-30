import { describe, it, expect } from "vitest";
import {
  validateCreatePageInput,
  validateUpdatePageInput,
} from "@/domain/page/page.validation";

describe("validateCreatePageInput", () => {
  it("validates empty input as valid", () => {
    const result = validateCreatePageInput({});
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("validates valid title", () => {
    const result = validateCreatePageInput({ title: "My Page" });
    expect(result.valid).toBe(true);
  });

  it("rejects title exceeding max length", () => {
    const result = validateCreatePageInput({ title: "a".repeat(501) });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("500 characters");
  });

  it("validates null parentId", () => {
    const result = validateCreatePageInput({ parentId: null });
    expect(result.valid).toBe(true);
  });

  it("rejects empty string parentId", () => {
    const result = validateCreatePageInput({ parentId: "" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Parent ID");
  });
});

describe("validateUpdatePageInput", () => {
  it("validates empty input as valid", () => {
    const result = validateUpdatePageInput({});
    expect(result.valid).toBe(true);
  });

  it("validates valid title update", () => {
    const result = validateUpdatePageInput({ title: "New Title" });
    expect(result.valid).toBe(true);
  });

  it("rejects non-number sortOrder", () => {
    const result = validateUpdatePageInput({
      sortOrder: "abc" as unknown as number,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Sort order");
  });
});
