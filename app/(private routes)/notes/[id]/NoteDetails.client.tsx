"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./page.module.css";

type Props = {
  id: string;
};

export default function NoteDetailsClient({ id }: Props) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note | null>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p className={css.infoText}>Loading note...</p>;
  }

  if (isError || !note) {
    return <p className={css.errorText}>Failed to load note.</p>;
  }

  return (
    <main className={css.mainContent}>
      <article className={css.noteCard}>
        <h1 className={css.title}>{note.title}</h1>
        <p className={css.meta}>
          <span className={css.tag}>{note.tag}</span>
        </p>
        <p className={css.content}>{note.content}</p>
      </article>
    </main>
  );
}
