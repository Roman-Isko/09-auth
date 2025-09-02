"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "../../../../components/NotePreview/Modal";
import Loader from "../../../../components/Loader/Loader";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

import { getNoteById } from "../../../../lib/api";
import type { Note } from "../../../../types/note";

type NotePreviewProps = {
  id: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),

    refetchOnMount: false,
  });

  let content: React.ReactNode;

  if (isLoading) {
    content = <Loader />;
  } else if (isError || !note) {
    const message =
      (error as Error)?.message || "Failed to load note. Please try again.";
    content = <ErrorMessage message={message} />;
  } else {
    const { title, content: body, tag, createdAt } = note;
    content = (
      <div>
        <h1 style={{ marginBottom: 8 }}>{title}</h1>
        {tag ? <p style={{ opacity: 0.8, marginBottom: 8 }}>#{tag}</p> : null}
        <p style={{ whiteSpace: "pre-wrap", marginBottom: 12 }}>{body}</p>
        <p style={{ fontSize: 12, opacity: 0.8 }}>
          <strong>Created:</strong> {formatDate(createdAt)}
        </p>
      </div>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
