import type { Block } from "./block.types";
import { generateId } from "@/infrastructure/id/id.service";

export function createDefaultBlock(): Block {
  return {
    id: generateId(),
    type: "paragraph",
    props: {},
    content: [],
    children: [],
  };
}
