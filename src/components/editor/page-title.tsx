"use client";

import { useRef, useState, useCallback } from "react";
import type { Page } from "@/domain/page/page.types";
import { usePageStore } from "@/stores/page.store";

interface PageTitleProps {
  page: Page;
}

export function PageTitle({ page }: PageTitleProps) {
  const updatePage = usePageStore((s) => s.updatePage);
  const [value, setValue] = useState(page.title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newTitle = e.target.value;
      setValue(newTitle);
      updatePage(page.id, { title: newTitle || "Untitled" });
    },
    [page.id, updatePage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Move focus to editor
        const editor = document.querySelector(
          "[data-blocknote-editor]"
        ) as HTMLElement;
        editor?.focus();
      }
    },
    []
  );

  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Untitled"
      className="w-full text-page-title text-notion-text bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-notion-text-tertiary"
      rows={1}
      style={{ minHeight: "1.2em" }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto";
        target.style.height = target.scrollHeight + "px";
      }}
    />
  );
}
