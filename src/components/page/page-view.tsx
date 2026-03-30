"use client";

import type { Page } from "@/domain/page/page.types";
import { PageTitle } from "@/components/editor/page-title";
import { PageEditor } from "@/components/editor/page-editor";

interface PageViewProps {
  page: Page;
}

export function PageView({ page }: PageViewProps) {
  return (
    <div className="max-w-page-content mx-auto px-24 py-12">
      <PageTitle key={`title-${page.id}`} page={page} />
      <div className="mt-4">
        <PageEditor key={`editor-${page.id}`} page={page} />
      </div>
    </div>
  );
}
