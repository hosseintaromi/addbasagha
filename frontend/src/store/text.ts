import { create } from "zustand";

export type TextOverlay = {
  id: string;
  text: string;
  // Timeline properties
  startTime: number;
  endTime: number;
  // Canvas position properties
  left?: number;
  top?: number;
  // Style properties
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  align?: "left" | "center" | "right";
  // Canvas transform properties
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
  // Visual effects
  animation?: "none" | "fade-in" | "slide-up" | "scale-in" | "bounce-in";
  shadow?: boolean;
  stroke?: string;
  strokeWidth?: number;
  // Interaction properties
  selectable?: boolean;
  moveable?: boolean;
  resizable?: boolean;
};

type State = {
  texts: TextOverlay[];
  addText: (t: TextOverlay) => void;
  updateText: (id: string, updates: Partial<TextOverlay>) => void;
  removeText: (id: string) => void;
  setTexts: (texts: TextOverlay[]) => void;
};

export const useTextStore = create<State>((set) => ({
  texts: [],
  addText: (t) => set((s) => ({ texts: [...s.texts, t] })),
  updateText: (id, updates) =>
    set((s) => ({
      texts: s.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeText: (id) =>
    set((s) => ({
      texts: s.texts.filter((t) => t.id !== id),
    })),
  setTexts: (texts) => set({ texts }),
}));
