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
