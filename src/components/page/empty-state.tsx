"use client";

import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-notion-text-tertiary">
      <FileText size={48} strokeWidth={1} />
      <p className="mt-4 text-lg">Select a page or create a new one</p>
      <p className="mt-1 text-sm">
        Use the <kbd className="px-1.5 py-0.5 rounded bg-notion-bg-secondary text-xs font-mono">+</kbd> button in the sidebar
      </p>
    </div>
  );
}
