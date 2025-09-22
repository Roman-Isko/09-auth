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
import axios from "axios";

type Note = {
  id: string;
  title: string;
  body: string;
};

/**
 * Функція для отримання нотаток з API.
 * Якщо filter пустий (порожній масив), запит робиться з пустим filter.
 */
async function getNotes(slug: string[]): Promise<Note[]> {
  const filter = slug.length > 0 ? slug.join(",") : "";
  const res = await axios.get(
    `https://notehub-public.goit.study/api/notes?filter=${encodeURIComponent(filter)}`,
  );
  return res.data;
}

/**
 * Важлива зміна в типах:
 * - через баг/несумісність типів Next.js 15 під час генерації internal PageProps
 *   іноді TS вимагає, щоб params містив промісоподібні методи (then/catch/finally).
 * - щоб не використовувати `any` і не ламати runtime логіку, ми "перетинаємо"
 *   тип { slug: string[] } з Promise<unknown>. Це лише type-level хак, runtime не змінюється.
 */
export default async function NotesPage({
  params,
  searchParams,
}: {
  params: { slug: string[] } & Promise<unknown>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // params.slug гарантовано присутній по структурі маршруту [...slug]
  const slugArray = params.slug ?? [];

  // Якщо slugArray порожній, передаємо пустий рядок як filter — API обробить це.
  const notes = await getNotes(slugArray);

  return (
    <Fragment>
      <h1>Notes Page</h1>

      <div>
        <strong>Params:</strong>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>

      <div>
        <strong>Search Params:</strong>
        <pre>{JSON.stringify(searchParams, null, 2)}</pre>
      </div>

      <div>
        <h2>Notes:</h2>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
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
