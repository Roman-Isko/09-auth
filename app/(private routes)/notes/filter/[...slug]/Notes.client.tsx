"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";
import type { Note, Tag } from "@/types/note";
import { ALLOWED_TAGS } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

import css from "./NotesClient.module.css";

type Props = {
  initialNotes: Note[];
  initialPage: number;
  initialSearch: string;
  perPage: number;
};

export default function FilteredNotesClient({
  initialPage,
  initialSearch,
  perPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(initialPage || 1);
  const [search, setSearch] = useState(initialSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || "");

  const rawTagParam = searchParams.get("tag");

  const uiTag: Tag | "All" = useMemo(() => {
    if (!rawTagParam || rawTagParam === "all") {
      return "All";
    }

    if ((ALLOWED_TAGS as string[]).includes(rawTagParam)) {
      return rawTagParam as Tag;
    }

    return "All";
  }, [rawTagParam]);

  const apiTag = uiTag === "All" ? "all" : uiTag;

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [page, debouncedSearch]);

  const queryKey = useMemo(
    () => ["notes", { page, perPage, search: debouncedSearch, tag: apiTag }],
    [page, perPage, debouncedSearch, apiTag],
  );

  const { data, isLoading, isError } = useQuery<Note[]>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
        tag: apiTag,
      }),
  });

  const notes = data ?? [];
  const hasMore = notes.length === perPage;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <h1 className={css.title}>Notes — {uiTag === "All" ? "All" : uiTag}</h1>
        <Link
          href="/notes/action/create"
          prefetch={false}
          className={css.createButton}
        >
          + Create note
        </Link>
      </div>

      <div className={css.searchRow}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
        />
      </div>

      {isLoading && <p className={css.infoText}>Loading...</p>}

      {isError && (
        <p className={css.errorText}>Failed to load notes. Please try again.</p>
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.infoText}>No notes found.</p>
      )}

      {notes.length > 0 && <NoteList notes={notes} />}

      {notes.length > 0 && (
        <Pagination
          page={page}
          hasPrev={page > 1}
          hasNext={hasMore}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
