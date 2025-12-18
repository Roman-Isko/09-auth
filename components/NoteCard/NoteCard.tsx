import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteCard.module.css";

type Props = {
  note: Note;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export default function NoteCard({ note, onDelete, isDeleting }: Props) {
  return (
    <article className={css.card}>
      <div className={css.body}>
        <h3 className={css.title}>{note.title}</h3>
        <p className={css.content}>{note.content}</p>
      </div>

      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>

        <div className={css.actions}>
          <Link
            href={`/notes/${note.id}`}
            className={`${css.button} ${css.view}`}
          >
            View
          </Link>
          <Link
            href={`/notes/${note.id}/edit`}
            className={`${css.button} ${css.edit}`}
          >
            Edit
          </Link>
          <button
            type="button"
            className={`${css.button} ${css.delete}`}
            onClick={() => onDelete(note.id)}
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
