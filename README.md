# 09-auth (Next.js App Router)

## Setup
1. Copy `.env.example` to `.env` and set
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
2. Install and run
   ```bash
   npm i
   npm run dev
   ```

## Deploy (Vercel)
- Set `NEXT_PUBLIC_API_URL=https://<your-vercel-domain>`
- No API tokens needed. Auth via cookies.

## Notes
- `app/api` is prefilled for HW-09 (cookies proxy).
- `middleware.ts` uses `req.nextUrl.origin` and excludes `/api` in matcher.
- `types/note.ts` uses `id: string`.
