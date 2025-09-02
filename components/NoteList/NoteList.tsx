import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.item}>
          <h2>{title}</h2>
          <p>{content}</p>
          <span>{tag}</span>

          <Link href={`/notes/${id}`} className={css.link}>
            View details
          </Link>

          <button
            className={css.delete}
            disabled={mutation.isPending}
            onClick={() => {
              if (confirm("Are you sure you want to delete this note?")) {
                mutation.mutate(id);
              }
            }}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
