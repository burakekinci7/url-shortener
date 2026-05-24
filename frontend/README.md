React + TypeScript + Vite SPA for the URL Shortener API.

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router (routing)
- Axios (HTTP)
- Zustand (auth state)
- Recharts (analytics charts)
- react-hot-toast (notifications)
- lucide-react (icons)

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Configuration

Default API base URL is `http://localhost:5287`. To override, create `.env.local`:
VITE_API_BASE_URL=http://your-api-url

## Project Structure
src/
├── components/
│   ├── ui/              # Button, Input, Card primitives
│   ├── layout/          # Navbar, Footer
│   └── features/        # UrlShortenerForm, UrlList, StatsCharts
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── StatsDetail.tsx
├── lib/
│   ├── api.ts           # Axios instance + JWT interceptor
│   └── auth-store.ts    # Zustand auth store
└── types/
└── index.ts         # API DTO interfaces

## Build

```bash
npm run build
```

Output: `dist/`. Deploy this folder to any static host (Vercel, Netlify, GitHub Pages).

EOF