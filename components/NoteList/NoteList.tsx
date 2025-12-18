"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";

import css from "./NoteList.module.css";

type Props = {
  notes: Note[];
};

export default function NoteList({ notes }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(id);
  };

  if (!notes.length) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={`${css.list} ${css.grid}`}>
      {notes.map((note) => {
        // ✅ типобезпечний id
        const id = note.id;

        return (
          <li key={id} className={css.card}>
            <h3 className={css.title}>{note.title}</h3>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <div className={css.actions}>
                <Link
                  href={`/notes/${id}`}
                  scroll={false}
                  prefetch={false}
                  className={css.viewButton}
                >
                  View
                </Link>

                <Link href={`/notes/${id}/edit`} className={css.editButton}>
                  Edit
                </Link>

                <button
                  type="button"
                  className={css.deleteButton}
                  onClick={() => handleDelete(id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "..." : "Delete"}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
