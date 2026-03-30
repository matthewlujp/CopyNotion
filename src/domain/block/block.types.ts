export type BlockType =
  | "paragraph"
  | "heading"
  | "bulletListItem"
  | "numberedListItem"
  | "checkListItem"
  | "codeBlock"
  | "table"
  | "divider"
  | "quote"
  | "callout"
  | "image";

export interface InlineContent {
  type: "text" | "link";
  text?: string;
  href?: string;
  styles?: Record<string, boolean | string>;
}

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  content: InlineContent[];
  children: Block[];
}
