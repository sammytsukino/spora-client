![SPORA-VISUAL](https://res.cloudinary.com/dsy30p7gf/image/upload/v1770388115/SPORA-LACE-TRANSPARENT-MINI_hzwlvt.webp)

**Text becomes generative art. Collaboration without destruction.**

⟡ ═════════════════════════════════════════ ⟡

## ✦ Table of Contents

- [What is SPORA Client?](#-what-is-spora-client)
- [Frontend Architecture](#-frontend-architecture)
- [Main User Journeys (Client Side)](#-main-user-journeys-client-side)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Backend Contract (Required)](#-backend-contract-required)
- [Language Support](#-language-support)
- [Clean Code Guidelines](#-clean-code-guidelines)
- [Testing Notes](#-testing-notes)
- [License](#-license)
- [Author](#-author)
- [Contact](#-contact)

⟡ ═════════════════════════════════════════ ⟡

## ✿ What is SPORA Client?

`spora-client` is the living interface of SPORA: the place where writing turns into visual life and collaborative creation remains traceable, layered, and non-destructive.

This repository holds the complete front-of-house experience:
♦ Discovery spaces (Garden / Greenhouse)  
♦ Creation ritual (Laboratory / Installation)  
♦ Identity and social continuity (profiles + follow graph)  
♦ Stewardship tools (Admin Panel)  
♦ Reading layer with optional voice playback (Flora Reader)  
♦ Contact form flow that submits to backend and notifies admin emails

⟡ ═════════════════════════════════════════ ⟡

## ♢ Frontend Architecture

### Routing and Access Model
The application uses `react-router-dom` with intentional route boundaries:
▸ Public pages (`/`, `/garden`, `/greenhouse`, `/flora/:id`, `/team`, `/terms`, etc.)  
▸ Guest-only auth pages (`/signin`, `/signup`) with invisible honeypot bot protection  
▸ Auth-only routes (`/laboratory`)  
▸ Session-unlock route for advanced lab mode (`/laboratory/full`)  
▸ Role-gated admin area (`/admin`)

### UI and State Strategy
▸ Component-driven UI in `src/components`  
▸ Feature views in `src/views`  
▸ API layer in `src/lib` (auth, floras, reports, admin, profile, follows)  
▸ Reusable hooks in `src/hooks`  
▸ Typed route helpers in `src/constants/routes.ts`  
▸ Accessibility baseline across key views (main landmarks, keyboard-safe overlays, labels/ARIA updates)

### Visual Layer
▸ **Vite 7 SPA** (React + TypeScript) — not Next.js  
▸ P5.js (loaded via CDN in `public/Installation.html`) + Three.js ecosystem (`@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`)  
▸ Tailwind CSS v4 + utility helpers (`clsx`, `tailwind-merge`)  
▸ Motion-driven UI animation

### Generative iframe architecture
The Laboratory and Flora Reader embed `public/Installation.html` (~3.6k lines of inline p5.js). React shells (`Installation.tsx`, `FloraReader.tsx`) pass query params (`floraId`, `reader=1`, `apiBase`) and communicate over `postMessage` (`spora:reader-ready`, `spora:setWind`, `spora:regenerate`, `spora:capture`).

`npm run prebuild` (also runs before `build`) generates `public/installation/mood-lexicons.js` from `src/data/mood-lexicons.ts`.

### Flora viewing (mobile vs desktop)
Route `/flora/:id` renders `FloraView`:
▸ **Desktop (`md+`)**: `FloraReader` — iframe visualization + TTS controls  
▸ **Mobile**: `FloraDetail` — static detail layout  
Route `/flora/:id/details` always renders `FloraDetail`.

⟡ ═════════════════════════════════════════ ⟡

## ❖ Main User Journeys (Client Side)

### 1) Discover
Explore the shared ecosystem through:
▸ **Garden** (active/blossoming ecosystem)  
▸ **Greenhouse** (sealed/final works)

### 2) Create
In **Laboratory / Installation**, cultivators:
▸ Write text  
▸ Trigger generative analysis + visual preview  
▸ Configure publication state and output

### 3) Connect
Profiles preserve social and authorship continuity through:
▸ Public identity pages  
▸ Follow relationships  
▸ Followers/following lists  
▸ Personal metrics and editable profile fields

### 4) Moderate
Admins can safeguard the ecosystem by:
▸ Audit users and content  
▸ Review reports and flagged items  
▸ Track platform metrics and usage charts

⟡ ═════════════════════════════════════════ ⟡

## ⚙ Tech Stack

### Core
▸ React 19  
▸ TypeScript  
▸ Vite 7  
▸ React Router 7

### Styling and Motion
▸ Tailwind CSS 4  
▸ Motion  
▸ Lucide icons

### Generative / 3D
▸ P5.js (CDN in `Installation.html`, not an npm dependency)  
▸ Three.js  
▸ `@react-three/fiber`  
▸ `@react-three/drei`  
▸ `@react-three/rapier`

### Data and Utilities
▸ Axios  
▸ UUID  
▸ jsPDF + autotable (admin exports)

### Quality
▸ ESLint 9  
▸ Vitest + Testing Library + jsdom

⟡ ═════════════════════════════════════════ ⟡

## ◆ Getting Started

### Prerequisites
```bash
Node.js >= 18
npm >= 9
spora-server running locally or remotely
```

### Installation
```bash
git clone https://github.com/sammytsukino/spora-client.git
cd spora-client
npm install
```

### Environment Variables

> **Mandatory setup:** copy [`.env.example`](./.env.example) to `.env` before running the client.  
> **Backend setup:** copy [`spora-server/.env.example`](../spora-server/.env.example) to `spora-server/.env` and configure **both** repos. SPORA only works correctly when client and server env files are aligned.

```bash
# spora-client/.env
VITE_API_BASE_URL=http://localhost:4000/api
```

| Client variable | Must match on server |
|---------------|----------------------|
| `VITE_API_BASE_URL` → host + `/api` | Server `PORT` / public API URL |
| SPA origin (e.g. `http://localhost:5173`) | `CORS_ORIGIN` includes that origin |
| — | `FRONTEND_URL` = SPA URL without `/api` |

**Cloudinary (server-side only):** thumbnail and avatar uploads are configured in `spora-server/.env`, not here. If your professor or deployment skips Cloudinary, floras will still save but **Garden cards will lack generative thumbnails** — see the Cloudinary section in [`spora-server/.env.example`](../spora-server/.env.example) for why that matters for evaluation.

If the backend runs elsewhere, set `VITE_API_BASE_URL` to that API base (always including `/api`). Restart Vite after any change.

Full comments: [`.env.example`](./.env.example)

### Run
```bash
npm run dev
```

Default local URL is usually `http://localhost:5173`.

⟡ ═════════════════════════════════════════ ⟡

## ◈ Available Scripts

```bash
npm run dev               # Start Vite dev server
npm run build             # Type-check + production build
npm run preview           # Preview production build
npm run lint              # Run ESLint
npm run test              # Run tests (watch mode)
npm run test:ui           # Vitest UI
npm run test:coverage     # Coverage report
npm run generate:lexicons # Generate installation lexicons
```

⟡ ═════════════════════════════════════════ ⟡

## ◈ Project Structure

```text
spora-client/
├── public/
│   ├── Installation.html       # p5 generative lab + reader iframe
│   └── installation/           # Generated lexicons + mask URLs
├── scripts/                    # Build-time content scripts
├── src/
│   ├── components/             # Reusable UI by domain
│   │   ├── admin/
│   │   ├── flora/
│   │   ├── home/
│   │   ├── laboratory/
│   │   ├── layout/
│   │   ├── profile/
│   │   ├── reader/
│   │   ├── shared/
│   │   └── ui/
│   ├── constants/              # Route + media constants
│   ├── data/                   # Static and generated datasets
│   ├── hooks/                  # Reusable React hooks
│   ├── lib/                    # API clients + core frontend logic
│   ├── router/                 # Router configuration
│   ├── test/                   # Test setup, fixtures, integration tests
│   ├── views/                  # Top-level pages
│   └── main.tsx                # App bootstrap
└── README.md
```

⟡ ═════════════════════════════════════════ ⟡

## ◉ Backend Contract (Required)

This client grows on top of `spora-server` endpoints under `/api`, including:
▸ Auth (`/auth/*`) with JWT access tokens + refresh cookie flow  
▸ Floras (`/floras/*`) for browse/create/update  
▸ Reader (`/reader/tts`) for voice generation (optional server config)  
▸ Follows (`/follows/*`) for social graph  
▸ Users (`/users/*`) for profile/public data  
▸ Reports (`/reports/*`) for moderation reports  
▸ Admin (`/admin/*`) for role-based moderation and metrics  
▸ Contact (`/contact`) for contact-form delivery to active admin recipients

Without a reachable backend **and a correctly configured `.env` on both repos**, the collaborative lifecycle cannot be completed. Use [`.env.example`](./.env.example) and [`spora-server/.env.example`](../spora-server/.env.example) as the single source of truth — especially **MongoDB**, **JWT**, **CORS**, and **Cloudinary** on the server.

⟡ ═════════════════════════════════════════ ⟡

## ◈ Language Support

SPORA currently supports usage in:
▸ **Español**  
▸ **Castellano**

⟡ ═════════════════════════════════════════ ⟡

## ◈ Clean Code Guidelines

These conventions are the expected baseline for `spora-client`:

### 1) Keep responsibilities separated
▸ `views/` compose page-level layout and route behavior  
▸ `components/` stay reusable and focused on one UI concern  
▸ `lib/` owns API access and core client-side business helpers  
▸ `hooks/` encapsulate reusable state/effects logic

### 2) Accessibility is a default requirement
▸ Use semantic landmarks/headings (`main`, valid heading order)  
▸ Keep interactive elements keyboard-usable (`button`/`Link` over clickable `div`)  
▸ Always provide labels/ARIA/alt text based on content meaning  
▸ Mark decorative media as hidden from assistive tech when appropriate

### 3) Prefer typed, explicit data contracts
▸ Keep API interfaces in `lib/*` up to date with backend responses  
▸ Avoid `any`; use narrow unions for status/role/route-related values  
▸ Normalize mapping logic near API boundaries, not deep in presentational components

### 4) Avoid duplicated UI logic
▸ Reuse shared components (`UnderlineField`, `MainButton`, shared cards)  
▸ Extract repeated class patterns/constants when duplication appears  
▸ Keep one source of truth for routes (`constants/routes.ts`)

### 5) Keep effects predictable
▸ Use effects for external sync only (events, network, DOM integration)  
▸ Prefer derived state/computed values over setState chains when possible  
▸ Clean up listeners/timers/async flows to prevent stale UI behavior

### 6) Keep docs and behavior aligned
▸ When routes/endpoints/flows change (auth, contact, admin), update README contract notes  
▸ Include minimal validation feedback in UI for user-facing forms  
▸ Verify with `lint`, tests, and build before shipping

⟡ ═════════════════════════════════════════ ⟡

## ◑ Testing Notes

The test suite protects both interaction quality and platform behavior:
▸ Component rendering and interaction tests  
▸ API wrapper unit tests  
▸ Auth flow integration tests  
▸ Route guard behavior tests

**Architecture and coverage policy:** see [docs/ARCHITECTURE_AND_TESTING.md](docs/ARCHITECTURE_AND_TESTING.md) for why `public/Installation.html` is a monolithic p5 iframe and why `FloraReader.tsx` is excluded from Vitest coverage thresholds (thesis-ready rationale).

For CI-like validation:
```bash
npm run lint
npm run test:coverage
npm run build
```

⟡ ═════════════════════════════════════════ ⟡

## ◍ License

This repository is part of the SPORA project.
Code license details should be defined in the project `LICENSE` file.

Individual Floras published in the platform are licensed by their authors under the platform licensing rules.

⟡ ═════════════════════════════════════════ ⟡

## ◕ Author

**Sammy Cabello**  
SPORA ▸ CEI: Centros de Estudios de Innovacion  
Academic Year: 2025-2026

⟡ ═════════════════════════════════════════ ⟡

## ◈ Contact

▸ **Email:** sammy.cabello.g@gmail.com  
▸ **GitHub:** [@sammytsukino](https://github.com/sammytsukino)

⟡ ═════════════════════════════════════════ ⟡

**SPORA Client** ♡ The interface where text takes root, blooms, and branches.
