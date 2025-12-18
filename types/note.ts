// types/note.ts

export type Tag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Ideas"
  | "Travel"
  | "Finance"
  | "Health"
  | "Important";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
}

// для Sidebar / селектів (включає "All")
export const TAGS_UI = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
] as const;

// тегі саме нотаток (без "All") — те, що чекали старі компоненти
export const ALLOWED_TAGS: Tag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
];

export type UITag = (typeof TAGS_UI)[number];
