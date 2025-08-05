import { create } from "zustand";

export type Clip = {
  id: string;
  start: number;
  end: number;
};

type State = {
  clips: Clip[];
  addClip: (c: Clip) => void;
  removeClip: (id: string) => void;
};

export const useEditorStore = create<State>((set) => ({
  clips: [],
  addClip: (c) => set((s) => ({ clips: [...s.clips, c] })),
  removeClip: (id) =>
    set((s) => ({ clips: s.clips.filter((c) => c.id !== id) })),
}));
