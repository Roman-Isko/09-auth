import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "../../../../lib/getQueryClient";
import { getNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";
import QueryHydration from "../../../../components/QueryHydration/QueryHydration";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const tagParam = slug?.[0] || "All";
  const search = resolvedSearchParams?.q ?? "";

  let title = "NoteHub – Усі нотатки";
  let description = "Перегляньте та організуйте свої нотатки у NoteHub.";

  if (tagParam && tagParam !== "All") {
    title = `NoteHub – Нотатки з тегом "${tagParam}"`;
    description = `Ознайомтесь з усіма нотатками, що мають тег "${tagParam}".`;
  }

  if (search) {
    title = `NoteHub – Результати пошуку за "${search}"`;
    description = `Знайдено нотатки, що відповідають пошуковому запиту "${search}".`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.app/notes/filter/${tagParam}?q=${search}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const tagParam = slug?.[0] || "All";
  const tag = tagParam === "All" ? undefined : tagParam;

  const page = Number(resolvedSearchParams?.page ?? 1);
  const search = resolvedSearchParams?.q ?? "";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      getNotes({
        page,
        ...(search ? { search } : {}),
        ...(tag ? { tag } : {}),
      }),
  });

  return (
    <QueryHydration state={dehydrate(queryClient)}>
      <NotesClient initialTag={tagParam} />
    </QueryHydration>
  );
}
