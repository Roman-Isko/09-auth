"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/lib/api/clientApi";
import type { Tag } from "@/types/note";
import css from "./NoteForm.module.css";

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
  initialTag: Tag;
};

export default function EditNoteForm({
  id,
  initialTitle,
  initialContent,
  initialTag,
}: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tag, setTag] = useState<Tag>(initialTag);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      updateNote(id, { title: title.trim(), content: content.trim(), tag }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["note", id] });
      router.back();
    },
    onError: (err: any) => {
      setError(err?.message || "Failed to update note");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    mutation.mutate();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2 className={css.title}>Edit note</h2>

      <input
        className={css.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />

      <select
        className={css.select}
        value={tag}
        onChange={(e) => setTag(e.target.value as Tag)}
      >
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
        <option value="Ideas">Ideas</option>
        <option value="Travel">Travel</option>
        <option value="Finance">Finance</option>
        <option value="Health">Health</option>
        <option value="Important">Important</option>
      </select>

      <textarea
        className={css.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
      />

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button
          type="button"
          className={css.secondary}
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.primary}
          disabled={mutation.isPending}
        >
          Save
        </button>
      </div>
    </form>
  );
}
