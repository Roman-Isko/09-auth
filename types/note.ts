export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping" | string;
  createdAt: string;
  updatedAt: string;
}

export type NewNote = {
  title: string;
  content: string;
  tag: Note["tag"];
};

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};
