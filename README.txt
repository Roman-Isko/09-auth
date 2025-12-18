Patch for 09-auth (Notes + Auth integration)

Apply:
1) Copy over your repo (keep structure).
2) Ensure .env has NEXT_PUBLIC_API_URL=http://localhost:3000 for local; on Vercel use the short domain.
3) npm i
4) npm run dev

Contains:
- middleware.ts, next.config.mjs
- lib/api (axios instance + client/server split)
- Zustand auth store
- AuthProvider, AuthNavigation
- SSR notes page + CSR NotesClient
- NoteList, TagsMenu components and styles
- types (user, note)
