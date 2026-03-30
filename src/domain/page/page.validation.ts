import type { CreatePageInput, UpdatePageInput } from "./page.types";

const MAX_TITLE_LENGTH = 500;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCreatePageInput(
  input: CreatePageInput
): ValidationResult {
  const errors: string[] = [];

  if (input.title !== undefined) {
    if (typeof input.title !== "string") {
      errors.push("Title must be a string");
    } else if (input.title.length > MAX_TITLE_LENGTH) {
      errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
    }
  }

  if (input.parentId !== undefined && input.parentId !== null) {
    if (typeof input.parentId !== "string" || input.parentId.length === 0) {
      errors.push("Parent ID must be a non-empty string or null");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdatePageInput(
  input: UpdatePageInput
): ValidationResult {
  const errors: string[] = [];

  if (input.title !== undefined) {
    if (typeof input.title !== "string") {
      errors.push("Title must be a string");
    } else if (input.title.length > MAX_TITLE_LENGTH) {
      errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
    }
  }

  if (input.sortOrder !== undefined && typeof input.sortOrder !== "number") {
    errors.push("Sort order must be a number");
  }

  return { valid: errors.length === 0, errors };
}
