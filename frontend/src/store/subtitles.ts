import { create } from "zustand";

export type Subtitle = {
  id: string;
  start: number;
  end: number;
  text: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
};

type State = {
  subtitles: Subtitle[];
  setSubtitles: (subs: Subtitle[]) => void;
};

export const useSubtitleStore = create<State>((set) => ({
  subtitles: [],
  setSubtitles: (subs) => set({ subtitles: subs }),
}));
