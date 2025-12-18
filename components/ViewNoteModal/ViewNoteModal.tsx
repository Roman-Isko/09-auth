"use client";

import { useRouter } from "next/navigation";
import type { Note } from "@/types/note";
import css from "./ViewNoteModal.module.css";

type Props = {
  note: Note;
  from?: string;
};

export default function ViewNoteModal({ note, from = "/notes" }: Props) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(from || "/notes");
    }
  };

  return (
    <div className={css.backdrop} onClick={goBack}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <div className={css.actions}>
          <button className={css.closeButton} onClick={goBack}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
