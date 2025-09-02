import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "../../../../lib/getQueryClient";
import { getNoteById } from "../../../../lib/api";
import NotePreview from "./NotePreview.client";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);

  return {
    title: `NoteHub – Прев’ю: ${note.title || "Нотатка"}`,
    description:
      note.content?.slice(0, 150) || "Перегляньте прев’ю нотатки у NoteHub.",
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
