![SPORA-VISUAL](https://res.cloudinary.com/dsy30p7gf/image/upload/v1770388115/SPORA-LACE-TRANSPARENT-MINI_hzwlvt.webp)

**Text becomes generative art. Collaboration without destruction.**

⟡ ═════════════════════════════════════════ ⟡

## ✦ Table of Contents

- [What is SPORA Client?](#-what-is-spora-client)
- [Project Status](#-project-status)
- [Frontend Architecture](#-frontend-architecture)
- [Main User Journeys (Client Side)](#-main-user-journeys-client-side)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Backend Contract (Required)](#-backend-contract-required)
- [Testing Notes](#-testing-notes)
- [License](#-license)
- [Author](#-author)
- [Contact](#-contact)

⟡ ═════════════════════════════════════════ ⟡

## ✿ What is SPORA Client?

`spora-client` is the frontend application of SPORA: a generative, collaborative writing platform where each published text becomes a visual organism (**Flora**).

This repository contains the full user-facing experience:
♦ Public discovery (Garden / Greenhouse)  
♦ Creation flow (Laboratory / Installation)  
♦ Profile + social layer (follow system)  
♦ Moderation dashboard (Admin Panel)  
♦ Reading experience with voice playback (Flora Reader)

⟡ ═════════════════════════════════════════ ⟡

## ✧ Project Status

SPORA is currently in a **solid ~95% implementation stage**.

### Implemented and stable
▸ Full navigation and route guards (guest/protected/lab-full)  
▸ Flora creation and publication workflows  
▸ Garden and Greenhouse browsing flows  
▸ Public and private profile experiences  
▸ Follow / followers / following views  
▸ Admin panel modules (users, reports, flagged content, metrics)  
▸ Email verification flow UI  
▸ Core test coverage with Vitest + Testing Library

### In active refinement
▹ UX polish for edge states and transitions  
▹ Final documentation and deployment hardening  
▹ Minor visual and content consistency passes

⟡ ═════════════════════════════════════════ ⟡

## ♢ Frontend Architecture

### Routing and Access Model
The app is built on `react-router-dom` with clear route segmentation:
▸ Public pages (`/`, `/garden`, `/greenhouse`, `/flora/:id`, `/team`, `/terms`, etc.)  
▸ Guest-only auth pages (`/signin`, `/signup`)  
▸ Auth-only routes (`/laboratory`)  
▸ Session-unlock route for advanced lab mode (`/laboratory/full`)  
▸ Role-gated admin area (`/admin`)

### UI and State Strategy
▸ Component-driven UI in `src/components`  
▸ Feature views in `src/views`  
▸ API layer in `src/lib` (auth, floras, reports, admin, profile, follows)  
▸ Reusable hooks in `src/hooks`  
▸ Typed route helpers in `src/constants/routes.ts`

### Visual Layer
▸ React + TypeScript + Vite  
▸ Three.js ecosystem (`@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`)  
▸ Tailwind CSS v4 + utility helpers (`clsx`, `tailwind-merge`)  
▸ Motion-driven UI animation

⟡ ═════════════════════════════════════════ ⟡

## ❖ Main User Journeys (Client Side)

### 1) Discover
Browse community creations through:
▸ **Garden** (active/blossoming ecosystem)  
▸ **Greenhouse** (sealed/final works)

### 2) Create
In **Laboratory / Installation**, users:
▸ Write text  
▸ Trigger generative analysis + visual preview  
▸ Configure publication state and output

### 3) Connect
Profiles support:
▸ Public identity pages  
▸ Follow relationships  
▸ Followers/following lists  
▸ Personal metrics and editable profile fields

### 4) Moderate
Admins can:
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
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

If your backend runs elsewhere, point this variable to that API base URL.

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
├── public/                     # Static files
├── scripts/                    # Build-time content scripts
├── src/
│   ├── components/             # Reusable UI by domain
│   │   ├── admin/
│   │   ├── flora/
│   │   ├── home/
│   │   ├── laboratory/
│   │   ├── layout/
│   │   ├── profile/
│   │   ├── shared/
│   │   └── ui/
│   ├── constants/              # Route constants/helpers
│   ├── data/                   # Static and generated datasets
│   ├── hooks/                  # Reusable React hooks
│   ├── integration/            # Integration tests
│   ├── lib/                    # API clients + core frontend logic
│   ├── router/                 # Router configuration
│   ├── test/                   # Test setup
│   ├── views/                  # Top-level pages
│   └── main.tsx                # App bootstrap
└── README.md
```

⟡ ═════════════════════════════════════════ ⟡

## ◉ Backend Contract (Required)

This client expects `spora-server` API endpoints under `/api`, including:
▸ Auth (`/auth/*`) with email verification + refresh token flow  
▸ Floras (`/floras/*`) for browse/create/update  
▸ Reader (`/reader/tts`) for voice generation (optional server config)  
▸ Follows (`/follows/*`) for social graph  
▸ Users (`/users/*`) for profile/public data  
▸ Reports (`/reports/*`) for moderation reports  
▸ Admin (`/admin/*`) for role-based moderation and metrics

Without a reachable backend, most app features are intentionally unavailable.

⟡ ═════════════════════════════════════════ ⟡

## ◑ Testing Notes

The test suite includes:
▸ Component rendering and interaction tests  
▸ API wrapper unit tests  
▸ Auth flow integration tests  
▸ Route guard behavior tests

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
