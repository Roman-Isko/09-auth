"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, Tag } from "@/types/note";
import { ALLOWED_TAGS } from "@/types/note";
import { updateNote } from "@/lib/api/clientApi";
import css from "./EditNoteModal.module.css";

type Props = {
  note: Note;
  from?: string;
};

export default function EditNoteModal({ note, from = "/notes" }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const DRAFT_KEY = `notehub-edit-draft-${note.id}`;

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tag, setTag] = useState<Tag>(note.tag);
  const [error, setError] = useState("");

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(from || "/notes");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as {
        title?: string;
        content?: string;
        tag?: Tag;
      };
      if (draft.title) setTitle(draft.title);
      if (draft.content) setContent(draft.content);
      if (draft.tag) setTag(draft.tag);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (title === note.title && content === note.content && tag === note.tag) {
      window.localStorage.removeItem(DRAFT_KEY);
      return;
    }

    const draft = { title, content, tag };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, content, tag, note.title, note.content, note.tag, DRAFT_KEY]);

  const mutation = useMutation({
    mutationFn: async () =>
      updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
        tag,
      }),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY);
      }
      qc.invalidateQueries({ queryKey: ["notes"] });
      goBack();
    },
    onError: () => {
      setError("Failed to update note. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");
    mutation.mutate();
  };

  const handleCancel = () => {
    goBack();
  };

  return (
    <div className={css.backdrop} onClick={handleCancel}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={css.title}>Edit note</h2>

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.row}>
            <input
              className={css.input}
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className={css.select}
              value={tag}
              onChange={(e) => setTag(e.target.value as Tag)}
            >
              {ALLOWED_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className={css.textarea}
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
