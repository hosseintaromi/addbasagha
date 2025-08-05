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
  subtitles: [
    {
      id: "1",
      start: 1,
      end: 4,
      text: "به ABBASAGHA خوش آمدید",
      fontSize: 24,
      color: "#ffffff",
      align: "center"
    },
    {
      id: "2", 
      start: 5,
      end: 8,
      text: "پلتفرم ویرایش ویدیوی حرفه‌ای",
      fontSize: 24,
      color: "#ffffff", 
      align: "center"
    },
    {
      id: "3",
      start: 9,
      end: 12,
      text: "Welcome to ABBASAGHA",
      fontSize: 24,
      color: "#ffffff",
      align: "center"
    }
  ],
  setSubtitles: (subs) => set({ subtitles: subs }),
}));
