"use client";

import { useCallback, useMemo } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { Block as BNBlock } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import type { Page } from "@/domain/page/page.types";
import { usePageStore } from "@/stores/page.store";
import { useUIStore } from "@/stores/ui.store";
import { useDebounce } from "@/hooks/use-debounce";

interface PageEditorProps {
  page: Page;
}

export function PageEditor({ page }: PageEditorProps) {
  const updatePage = usePageStore((s) => s.updatePage);
  const theme = useUIStore((s) => s.theme);

  const initialContent = useMemo(() => {
    if (page.content && page.content.length > 0) {
      return page.content as unknown as BNBlock[];
    }
    return undefined;
  }, [page.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useCreateBlockNote({
    initialContent,
  });

  const { debouncedFn: debouncedSave } = useDebounce((blocks: unknown[]) => {
    updatePage(page.id, { content: blocks as Page["content"] });
  }, 500);

  const handleChange = useCallback(() => {
    const blocks = editor.document;
    debouncedSave(blocks);
  }, [editor, debouncedSave]);

  return (
    <div data-blocknote-editor>
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
