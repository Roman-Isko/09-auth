"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api/api";
import type { NewNote } from "../../types/note";
import { useNoteStore } from "../../lib/store/noteStore";
import css from "./NoteForm.module.css";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: NewNote) => createNote(payload),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.back();
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ title: draft.title, content: draft.content, tag: draft.tag });
  }

  function handleCancel() {
    router.back();
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label className={css.label}>
        Title
        <input
          className={css.input}
          name="title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          required
          placeholder="Enter title"
        />
      </label>

      <label className={css.label}>
        Tag
        <select
          className={css.select}
          name="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          name="content"
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          rows={6}
          required
          placeholder="Write your note..."
        />
      </label>

      {error && <p className={css.error}>{(error as Error).message}</p>}

      <div className={css.actions}>
        <button type="submit" className={css.button} disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>

        <button type="button" className={css.secondary} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
