"use client";

import { usePageStore } from "@/stores/page.store";
import { PageTreeItem } from "./page-tree-item";
import type { PageTreeNode } from "@/domain/page/page.types";

function TreeNodes({ nodes, depth }: { nodes: PageTreeNode[]; depth: number }) {
  return (
    <>
      {nodes.map((node) => (
        <PageTreeItem
          key={node.page.id}
          page={node.page}
          depth={depth}
          hasChildren={node.children.length > 0}
        >
          <TreeNodes nodes={node.children} depth={depth + 1} />
        </PageTreeItem>
      ))}
    </>
  );
}

export function PageTree() {
  const tree = usePageStore((s) => s.getPageTree());

  if (tree.length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-notion-text-tertiary">
        No pages yet. Click + to create one.
      </div>
    );
  }

  return (
    <div className="py-1">
      <TreeNodes nodes={tree} depth={0} />
    </div>
  );
}
