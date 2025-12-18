// app/(private routes)/notes/[id]/edit/page.tsx
import { fetchNoteById } from "@/lib/api/serverApi";
import EditNoteForm from "@/components/NoteForm/EditNoteForm";
import type { Metadata } from "next";

type Params = Promise<{ id: string }>;
type PageProps = { params: Params };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit note ${id}`,
  };
}

export default async function EditNotePage({ params }: PageProps) {
  const { id } = await params;

  const note = await fetchNoteById(id);

  if (!note) {
    return (
      <main className="container">
        <h1>Note not found</h1>
      </main>
    );
  }

  return (
    <main className="container">
      <EditNoteForm
        id={note.id}
        initialTitle={note.title}
        initialContent={note.content}
        initialTag={note.tag}
      />
    </main>
  );
}
