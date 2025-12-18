"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { Tag } from "@/types/note";
import { ALLOWED_TAGS } from "@/types/note";
import css from "./CreateNoteModal.module.css";

const DRAFT_KEY = "notehub-create-note-draft";

type Draft = {
  title: string;
  content: string;
  tag: Tag;
};

type Props = {
  from?: string; // куди повертатись; за замовчуванням /notes
};

export default function CreateNoteModal({ from = "/notes" }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("Todo");
  const [error, setError] = useState("");

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(from || "/notes");
    }
  };

  const saveDraft = (next: Draft) => {
    if (typeof window === "undefined") return;

    const isEmpty = !next.title && !next.content;
    if (isEmpty) {
      window.localStorage.removeItem(DRAFT_KEY);
    } else {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    }
  };

  // 1. Завантажуємо чернетку при монтуванні
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as Draft;
      if (saved.title) setTitle(saved.title);
      if (saved.content) setContent(saved.content);
      if (saved.tag) setTag(saved.tag);
    } catch {
      // якщо щось битське — ігноруємо
    }
  }, []);

  // 2. Мутація створення
  const mutation = useMutation({
    mutationFn: async () =>
      createNote({
        title: title.trim(),
        content: content.trim(),
        tag,
      }),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY);
      }
      qc.invalidateQueries({ queryKey: ["notes"] });
      // завжди повертаємось до списку
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(from || "/notes");
      }
    },
    onError: () => {
      setError("Failed to create note. Please try again.");
    },
  });

  // 3. Обробники з миттєвим збереженням чернетки

  const handleTitleChange = (value: string) => {
    setTitle(value);
    saveDraft({ title: value, content, tag });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    saveDraft({ title, content: value, tag });
  };

  const handleTagChange = (value: Tag) => {
    setTag(value);
    saveDraft({ title, content, tag: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");
    mutation.mutate();
  };

  const handleClose = () => {
    // ВАЖЛИВО: чернетку не чіпаємо.
    // Вона вже збережена, при наступному відкритті підхопиться.
    goBack();
  };

  return (
    <div className={css.backdrop} onClick={handleClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={css.title}>Create note</h2>

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.row}>
            <input
              className={css.input}
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <select
              className={css.select}
              value={tag}
              onChange={(e) => handleTagChange(e.target.value as Tag)}
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
            onChange={(e) => handleContentChange(e.target.value)}
          />

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
