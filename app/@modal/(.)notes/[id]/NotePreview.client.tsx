"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import css from "./NotePreview.module.css";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note | null>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <div className={css.backdrop} onClick={handleClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeButton} onClick={handleClose}>
          ×
        </button>

        {isLoading && <p>Loading note...</p>}

        {(isError || !note) && !isLoading && (
          <p>Failed to load note. Try again.</p>
        )}

        {note && !isLoading && (
          <>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
          </>
        )}
      </div>
    </div>
  );
}
