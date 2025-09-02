import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Draft {
  title: string;
  content: string;
  tag: string;
}

interface NoteStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist<NoteStore>(
    (set) => ({
      draft: initialDraft,
      setDraft: (note: Partial<Draft>) =>
        set((state: NoteStore) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    },
  ),
);
