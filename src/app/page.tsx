"use client";

import { Providers } from "./providers";
import { AppLayout } from "@/components/layout/app-layout";
import { EmptyState } from "@/components/page/empty-state";
import { useUIStore } from "@/stores/ui.store";
import { usePageStore } from "@/stores/page.store";
import dynamic from "next/dynamic";

const PageView = dynamic(
  () => import("@/components/page/page-view").then((mod) => mod.PageView),
  { ssr: false }
);

function MainContent() {
  const activePageId = useUIStore((s) => s.activePageId);
  const pages = usePageStore((s) => s.pages);
  const activePage = activePageId ? pages.get(activePageId) : null;

  if (!activePage) {
    return <EmptyState />;
  }

  return <PageView page={activePage} />;
}

export default function Home() {
  return (
    <Providers>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </Providers>
  );
}
