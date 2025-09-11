import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "../../../lib/getQueryClient";
import { getNoteById } from "../../../lib/api";
import NoteDetailsWrapper from "./NoteDetailsWrapper";
import QueryHydration from "../../../components/QueryHydration/QueryHydration";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);

  const title = note.title || "Нотатка";
  const description =
    note.content?.slice(0, 150) || "Перегляньте нотатку у NoteHub.";

  return {
    title: `NoteHub – ${title}`,
    description,
    openGraph: {
      title: `NoteHub – ${title}`,
      description,
      url: `https://notehub.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub – ${title}`,
        },
      ],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <QueryHydration state={dehydrate(queryClient)}>
      <NoteDetailsWrapper noteId={id} />
    </QueryHydration>
  );
}
