"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "../../../lib/api";
import type { Note } from "../../../types/note";
import Loader from "../../../components/Loader/Loader";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  noteId: string;
  onClose: () => void;
}

export default function NoteDetails({ noteId, onClose }: NoteDetailsProps) {
  const [mounted, setMounted] = useState(false);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    refetchOnMount: false,
  });

  useEffect(() => {
    setMounted(true);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!mounted) return null;

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (isError || !note) {
    const message =
      (error as Error)?.message || "Failed to load note. Please try again.";
    content = <ErrorMessage message={message} />;
  } else {
    const { title, content: body, tag, createdAt, updatedAt } = note;
    const created = createdAt
      ? new Date(createdAt).toLocaleString()
      : "Unknown";
    const updated = updatedAt
      ? new Date(updatedAt).toLocaleString()
      : "Unknown";

    content = (
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.close} onClick={onClose}>
          ×
        </button>
        <h1 className={css.title}>{title}</h1>
        <p className={css.tag}>#{tag}</p>
        <p className={css.content}>{body}</p>
        <div className={css.meta}>
          <p>
            <strong>Created:</strong> {created}
          </p>
          <p>
            <strong>Updated:</strong> {updated}
          </p>
        </div>
      </div>
    );
  }

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      {content}
    </div>,
    document.body,
  );
}
