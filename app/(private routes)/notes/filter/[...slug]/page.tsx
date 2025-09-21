// import NotesClient from "../../../../../components/Notes/Notes.client";
// import type { NotesResponse } from "../../../../../types/note";
// import { getNotesServer } from "../../../../../lib/api/serverApi";

// interface NotesPageProps {
//   params: { slug?: string[] };
//   searchParams: { page?: string; search?: string };
// }

// export default async function NotesPage({
//   params,
//   searchParams,
// }: NotesPageProps) {
//   const { slug } = params;
//   const { page = "1", search = "" } = searchParams;

//   const tag = slug?.[0] ?? "All";
//   const pageNumber = Number(page) || 1;

//   const initialNotes: NotesResponse = await getNotesServer({
//     page: pageNumber,
//     ...(search ? { search } : {}),
//     ...(tag !== "All" ? { tag } : {}),
//   });

//   return (
//     <NotesClient
//       initialNotes={initialNotes}
//       initialTag={tag}
//       initialPage={pageNumber}
//       initialSearch={search}
//     />
//   );
// }

// app/(private routes)/notes/filter/[...slug]/page.tsx
import NotesClient from "../../../../../components/Notes/Notes.client";
import type { NotesResponse } from "../../../../../types/note";
import { getNotesServer } from "../../../../../lib/api/serverApi";

interface NotesPageParams {
  slug?: string[];
}

interface NotesPageSearchParams {
  page?: string;
  search?: string;
}

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Readonly<NotesPageParams>;
  searchParams?: Readonly<NotesPageSearchParams>;
}) {
  const { slug } = params ?? {};
  const { page = "1", search = "" } = searchParams ?? {};

  const tag = slug?.[0] ?? "All";
  const pageNumber = Number(page) || 1;

  const initialNotes: NotesResponse = await getNotesServer({
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
