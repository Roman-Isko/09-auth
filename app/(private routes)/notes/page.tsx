import NotesClient from "../../../components/Notes/Notes.client";
import type { NotesResponse } from "../../../types/note";
import { getNotesSSR } from "../../../lib/api/ssr";
import { redirect } from "next/navigation";

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { page = "1", search = "" } = await searchParams;
  const pageNumber = Number(page) || 1;

  const initialNotes: NotesResponse | null = await getNotesSSR({
    page: pageNumber,
    ...(search ? { search } : {}),
  });

  if (!initialNotes) {
    redirect("/sign-in");
  }

  return (
    <NotesClient
      initialNotes={initialNotes!}
      initialTag="All"
      initialPage={pageNumber}
      initialSearch={search}
    />
  );
}
