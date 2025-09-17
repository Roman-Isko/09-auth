import NotesClient from "../../../../../components/Notes/Notes.client";
import type { NotesResponse } from "../../../../../types/note";
import { getNotesSSR } from "../../../../../lib/api/ssr";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const { slug } = await params;
  const { page = "1", search = "" } = await searchParams;

  const tag = slug?.[0] ?? "All";
  const pageNumber = Number(page) || 1;

  const initialNotes: NotesResponse = await getNotesSSR({
    page: pageNumber,
    ...(search ? { search } : {}),
    ...(tag !== "All" ? { tag } : {}),
  });

  return (
    <NotesClient
      initialNotes={initialNotes}
      initialTag={tag}
      initialPage={pageNumber}
      initialSearch={search}
    />
  );
}
