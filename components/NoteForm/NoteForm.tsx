"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api/clientApi";
import type { Tag } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteDraftStore";

import css from "./NoteForm.module.css";

const TAGS: Tag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { title, content, tag, setField, reset } = useNoteDraftStore();

  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // оновлюємо список нотаток
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // чистимо чернетку
      reset();
      // повертаємось до списку
      router.push("/notes");
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err.message || "Failed to create note");
      } else {
        setError("Failed to create note");
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("All fields are required");
      return;
    }

    mutation.mutate({
      title: trimmedTitle,
      content: trimmedContent,
      tag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Note title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={(e) => setField("title", e.target.value)}
          disabled={mutation.isPending}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setField("tag", e.target.value)}
          disabled={mutation.isPending}
          required
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Note content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          rows={5}
          value={content}
          onChange={(e) => setField("content", e.target.value)}
          disabled={mutation.isPending}
          required
        />
      </div>

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Create note"}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
