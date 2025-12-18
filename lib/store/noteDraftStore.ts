"use client";

import { create } from "zustand";
import type { Tag } from "@/types/note";

type DraftState = {
  title: string;
  content: string;
  tag: Tag;
  setField: (field: "title" | "content" | "tag", value: string) => void;
  reset: () => void;
};

export const useNoteDraftStore = create<DraftState>()((set) => ({
  title: "",
  content: "",
  tag: "Todo",
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  reset: () => set({ title: "", content: "", tag: "Todo" }),
}));
