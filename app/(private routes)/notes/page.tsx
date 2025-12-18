import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import FilteredNotesClient from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";
import type { UITag } from "@/types/note";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "All notes",
  description: "Browse your notes",
};

type SearchParams = {
  page?: string;
  search?: string;
  tag?: string;
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search ?? "";
  const tag = (searchParams.tag as UITag) || "All";
  const perPage = 12;

  const initialNotes = await fetchNotes({
    page,
    perPage,
    search,
    tag,
  });

  return (
    <main className={css.main}>
      <FilteredNotesClient
        initialNotes={initialNotes}
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
      />
    </main>
  );
}
