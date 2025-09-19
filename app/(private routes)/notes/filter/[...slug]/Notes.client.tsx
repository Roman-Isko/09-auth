// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { useDebounce } from "@uidotdev/usehooks";
// import { getNotes } from "../../../../../lib/api/api";
// import type { NotesResponse } from "../../../../../types/note";

// import NoteList from "../../../../../components/NoteList/NoteList";
// import Loader from "../../../../../components/Loader/Loader";
// import ErrorMessage from "../../../../../components/ErrorMessage/ErrorMessage";
// import Pagination from "../../../../../components/Pagination/Pagination";
// import SearchBox from "../../../../../components/SearchBox/SearchBox";

// import css from "./Notes.client.module.css";

// interface NotesClientProps {
//   initialTag: string;
// }

// export default function NotesClient({ initialTag }: NotesClientProps) {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//   const tag = useMemo(
//     () => (initialTag === "All" ? undefined : initialTag),
//     [initialTag],
//   );

//   const debouncedSearch = useDebounce(search, 500);

//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, tag]);

//   const { data, isLoading, isError, error } = useQuery<NotesResponse>({
//     queryKey: ["notes", page, debouncedSearch, tag],
//     queryFn: () =>
//       getNotes({
//         page,
//         ...(debouncedSearch ? { search: debouncedSearch } : {}),
//         ...(tag ? { tag } : {}),
//       }),
//     placeholderData: (prev) => prev,
//     refetchOnMount: false,
//   });

//   const handleSearch = (query: string) => setSearch(query);

//   return (
//     <div className={css.container}>
//       <SearchBox onSearch={handleSearch} initialValue="" />

//       <Link href="/notes/action/create" className={css.button}>
//         Create note +
//       </Link>

//       {isLoading && <Loader />}
//       {isError && (
//         <ErrorMessage
//           message={(error as Error)?.message || "Failed to load notes"}
//         />
//       )}

//       {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

//       {data && data.totalPages > 1 && (
//         <Pagination
//           currentPage={page}
//           totalPages={data.totalPages}
//           onPageChange={(newPage) => setPage(newPage)}
//         />
//       )}
//     </div>
//   );
// }

// app/(private routes)/notes/filter/[...slug]/Notes.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { getNotes } from "../../../../../lib/api/clientApi";
import type { NotesResponse } from "../../../../../types/note";

import NoteList from "../../../../../components/NoteList/NoteList";
import Loader from "../../../../../components/Loader/Loader";
import ErrorMessage from "../../../../../components/ErrorMessage/ErrorMessage";
import Pagination from "../../../../../components/Pagination/Pagination";
import SearchBox from "../../../../../components/SearchBox/SearchBox";

import css from "./Notes.client.module.css";

interface NotesClientProps {
  initialTag: string;
  initialPage: number;
  initialSearch: string;
  initialNotes: NotesResponse;
}

export default function NotesClient({
  initialTag,
  initialPage,
  initialSearch,
  initialNotes,
}: NotesClientProps) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);

  const tag = useMemo(
    () => (initialTag === "All" ? undefined : initialTag),
    [initialTag],
  );

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      getNotes({
        page,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(tag ? { tag } : {}),
      }),
    placeholderData: initialNotes,
    refetchOnMount: false,
  });

  const handleSearch = (query: string) => setSearch(query);

  return (
    <div className={css.container}>
      <SearchBox onSearch={handleSearch} initialValue={initialSearch} />

      <Link href="/notes/action/create" className={css.button}>
        Create note +
      </Link>

      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message={error?.message || "Failed to load notes"} />
      )}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
