"use client";

import { ChevronRight, FileText, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePageStore } from "@/stores/page.store";
import { useUIStore } from "@/stores/ui.store";
import type { Page } from "@/domain/page/page.types";
import { useState, useRef, useEffect } from "react";

interface PageTreeItemProps {
  page: Page;
  depth: number;
  hasChildren: boolean;
  children?: React.ReactNode;
}

export function PageTreeItem({
  page,
  depth,
  hasChildren,
  children,
}: PageTreeItemProps) {
  const activePageId = useUIStore((s) => s.activePageId);
  const setActivePage = useUIStore((s) => s.setActivePage);
  const isExpanded = useUIStore((s) => s.isPageExpanded(page.id));
  const toggleExpanded = useUIStore((s) => s.togglePageExpanded);
  const addPage = usePageStore((s) => s.addPage);
  const deletePage = usePageStore((s) => s.deletePage);
  const updatePage = usePageStore((s) => s.updatePage);

  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(page.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = activePageId === page.id;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  function handleRenameSubmit() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== page.title) {
      updatePage(page.id, { title: trimmed });
    }
    setIsRenaming(false);
  }

  function handleAddSubpage() {
    const child = addPage({ parentId: page.id });
    if (!isExpanded) toggleExpanded(page.id);
    setActivePage(child.id);
    setShowMenu(false);
  }

  function handleDelete() {
    if (isActive) setActivePage(null);
    deletePage(page.id);
    setShowMenu(false);
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center h-8 pr-2 cursor-pointer text-sm select-none",
          isActive
            ? "bg-notion-bg-hover text-notion-text"
            : "text-notion-text-secondary hover:bg-notion-sidebar-hover"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => setActivePage(page.id)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded(page.id);
          }}
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded shrink-0",
            "hover:bg-notion-bg-hover",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight
            size={14}
            className={cn(
              "transition-transform duration-150",
              isExpanded && "rotate-90"
            )}
          />
        </button>

        <span className="mr-1.5 shrink-0">
          {page.icon ? (
            <span className="text-sm">{page.icon}</span>
          ) : (
            <FileText size={14} className="text-notion-text-tertiary" />
          )}
        </span>

        {isRenaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
              if (e.key === "Escape") setIsRenaming(false);
            }}
            className="flex-1 min-w-0 bg-transparent text-sm outline-none border border-notion-accent rounded px-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate flex-1 min-w-0">
            {page.title || "Untitled"}
          </span>
        )}

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0 ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded p-0.5 hover:bg-notion-bg-hover"
          >
            <MoreHorizontal size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddSubpage();
            }}
            className="rounded p-0.5 hover:bg-notion-bg-hover"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute z-50 mt-1 ml-8 bg-notion-bg border border-notion-border rounded-md shadow-lg py-1 min-w-[160px]"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              setRenameValue(page.title);
              setIsRenaming(true);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-notion-text hover:bg-notion-bg-hover"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-500 hover:bg-notion-bg-hover"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      {isExpanded && hasChildren && children}
    </div>
  );
}
