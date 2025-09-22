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
import { Fragment } from "react";

type Note = {
  id: string;
  title: string;
  body: string;
};

/**
 * Server component: отримує params/searchParams від Next.js.
 * Ми приймаємо props як `unknown`, щоб уникнути конфліктів типів Next.js під час build.
 * Потім локально приводимо props до потрібної форми.
 */
export default async function NotesPage(props: unknown) {
  // Локально приводимо props до очікуваної форми (без any)
  const { params, searchParams } =
    (props as {
      params?: { slug?: string[] };
      searchParams?: Record<string, string | string[] | undefined>;
    }) ?? {};

  const slugArray = params?.slug ?? [];

  // Побудуємо запитний параметр filter; API очікує рядок, або пустий рядок
  const filter = slugArray.length > 0 ? slugArray.join(",") : "";

  // Використовуємо fetch (Edge-friendly) замість axios
  const url = filter
    ? `https://notehub-public.goit.study/api/notes?filter=${encodeURIComponent(filter)}`
    : `https://notehub-public.goit.study/api/notes`;

  const res = await fetch(url);

  if (!res.ok) {
    // У production краще робити більш витончену обробку помилок.
    // Тут просто повернемо повідомлення.
    return (
      <Fragment>
        <h1>Notes Page</h1>
        <p>
          Failed to fetch notes: {res.status} {res.statusText}
        </p>
      </Fragment>
    );
  }

  // Припускаємо, що API повертає масив нотаток (як у твоєму прикладі).
  // Якщо API повертає { notes: [...] } — треба адаптувати: const data = await res.json(); const notes = data.notes;
  const notes = (await res.json()) as Note[] | { notes?: Note[] };

  // Підтримка двох можливих форматів відповіді:
  const notesArray: Note[] = Array.isArray(notes)
    ? notes
    : Array.isArray((notes as { notes?: Note[] }).notes)
      ? (notes as { notes?: Note[] }).notes!
      : [];

  return (
    <Fragment>
      <h1>Notes Page</h1>

      <div>
        <strong>Params:</strong>
        <pre>{JSON.stringify(params ?? {}, null, 2)}</pre>
      </div>

      <div>
        <strong>Search Params:</strong>
        <pre>{JSON.stringify(searchParams ?? {}, null, 2)}</pre>
      </div>

      <div>
        <h2>Notes:</h2>
        {notesArray.length > 0 ? (
          <ul>
            {notesArray.map((note) => (
              <li key={note.id}>
                <strong>{note.title}</strong>: {note.body}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </Fragment>
  );
}

// // app/(private routes)/notes/filter/[...slug]/page.tsx
// import NotesClient from "../../../../../components/Notes/Notes.client";
// import type { NotesResponse } from "../../../../../types/note";
// import { getNotesServer } from "../../../../../lib/api/serverApi";

// export default async function NotesPage({
//   params,
//   searchParams,
// }: {
//   params: { slug?: string[] };
//   searchParams?: { page?: string; search?: string };
// }) {
//   const { slug } = params;
//   const page = searchParams?.page ?? "1";
//   const search = searchParams?.search ?? "";

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
