import { create } from "zustand";

interface WorkspaceState {
  name: string;
}

interface WorkspaceActions {
  setName(name: string): void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  name: "My Workspace",

  setName(name: string) {
    set({ name });
  },
}));
