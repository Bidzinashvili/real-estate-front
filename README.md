# Real Estate Frontend

Next.js App Router frontend for the real-estate platform.

## Requirements

- Node.js 20+ (tested with Node 22)
- npm (lockfile: `package-lock.json`)

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API origin (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID for sign-in |

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (default port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | Static validation (TypeScript; Next.js 16 removed `next lint`) |

## Routing & auth

- Protected routes are enforced by `src/proxy.ts` (Next.js proxy/middleware).
- Auth token is stored in `localStorage` and an `authToken` cookie for server-side route checks.
- Public routes: `/sign-in`, `/forgot-password`, `/reset-password`, `/set-password`, `/share/property/:id`, `/invite/:token`.

## Backend

The frontend expects a running backend at `NEXT_PUBLIC_API_BASE_URL`. Without it, authenticated pages and API calls will fail.
