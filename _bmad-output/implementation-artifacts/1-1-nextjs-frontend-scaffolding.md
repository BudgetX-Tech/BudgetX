# Story 1.1: Next.js Frontend Scaffolding

Status: done

## Story

As a **developer**,
I want a Next.js 16 app with the design system fully configured,
so that all subsequent frontend work uses consistent tokens and tooling.

## Acceptance Criteria

1. **Given** a clean repository, **When** the Next.js app is initialized with `npx create-next-app@latest --yes --use-npm`, **Then** the app runs in development mode with TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack, **And** the following dependencies are installed: `zustand`, `axios`, `date-fns`, `recharts`, `lucide-react`, **And** shadcn/ui is initialized via `npx shadcn@latest init`.

2. **Given** the Tailwind config, **When** `tailwind.config.ts` is updated, **Then** custom surface levels are defined (`bg-surface-0` through `bg-surface-4`) for both dark and light themes, **And** semantic color tokens are mapped: Green/Primary, Blue/Secondary, Amber/Accent, Red/Destructive, **And** JetBrains Mono is configured as the monospace font for financial numbers, **And** Inter is configured as the primary UI font via Google Fonts.

3. **Given** the design system, **When** `globals.css` is configured, **Then** dark mode is the default theme (via `class` strategy), **And** CSS custom properties define all theme colors for both dark and light modes, **And** `prefers-color-scheme` media query sets the initial theme.

4. **Given** the app layout, **When** `app/layout.tsx` is created, **Then** it includes HTML lang attribute, meta viewport, page title "BudgetX", font loading with `display=swap`, **And** a skip link ("Skip to main content") is the first focusable element, **And** sonner `<Toaster />` provider is mounted at root level (top-right, max 3 visible).

5. **Given** the file structure, **When** reviewing the project, **Then** directories exist: `/app`, `/components`, `/components/ui`, `/lib`, `/hooks`, `/public`, **And** `lib/categories.ts` contains 12 category icon/color mappings (Lucide icon name + HSL color), **And** `.env.local.example` documents required environment variables.

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js project (AC: #1)
  - [x] Run `npx create-next-app@latest ./ --yes --use-npm` in the frontend directory
  - [x] Verify TypeScript, Tailwind CSS, ESLint, App Router, Turbopack enabled
  - [x] Install dependencies: `npm install zustand axios date-fns recharts lucide-react`
  - [x] Initialize shadcn/ui: `npx shadcn@latest init` (style: New York, base color: Slate, CSS variables: yes)
  - [x] Install sonner for toast: `npx shadcn@latest add sonner`

- [x] Task 2: Configure Tailwind design tokens (AC: #2)
  - [x] Add surface color system (5 levels) to `tailwind.config.ts`
  - [x] Map semantic color tokens (primary/secondary/accent/destructive)
  - [x] Configure `fontFamily` with Inter as sans and JetBrains Mono as mono

- [x] Task 3: Configure dark mode + globals.css (AC: #3)
  - [x] Set up CSS custom properties for dark mode (default) and light mode
  - [x] Set `darkMode: 'class'` in Tailwind config (shadcn sets this)
  - [x] Add `prefers-color-scheme` media query to set initial theme class on `<html>`
  - [x] Import Google Fonts (Inter + JetBrains Mono) via `@import` or `next/font`

- [x] Task 4: Create root layout (AC: #4)
  - [x] `app/layout.tsx` — HTML lang="en", meta viewport, title "BudgetX"
  - [x] Load fonts with `next/font/google` for Inter and JetBrains Mono with `display: 'swap'`
  - [x] Add skip link as first focusable element
  - [x] Mount `<Toaster />` from sonner (position: top-right, max 3 visible)

- [x] Task 5: Create file structure + categories (AC: #5)
  - [x] Create directories: `/components`, `/components/ui` (from shadcn), `/lib`, `/hooks`
  - [x] Create `lib/categories.ts` with 12 predefined category mappings
  - [x] Create `.env.local.example` with documented env vars

### Review Findings

- [x] [Review][Patch] Missing ThemeProvider for next-themes [app/layout.tsx] — components/ui/sonner.tsx uses useTheme() from next-themes, but no ThemeProvider is wrapping the app.

## Dev Notes

### Architecture Compliance

**Stack:** Next.js 16.2.x, TypeScript strict mode, Tailwind CSS, shadcn/ui, Turbopack
[Source: architecture.md#Starter Template Selection]

**CRITICAL: Use `next/font/google`** — Do NOT use `@import url(...)` for fonts. Next.js's built-in font optimization provides zero-layout-shift loading, automatic `display=swap`, and self-hosting. This is the correct approach for Next.js 16.

```typescript
// app/layout.tsx — Font loading pattern
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
```

**State Management:** Zustand — only for client-side UI state (modals, FAB open/close, toast queue). NOT for server data. Server data goes through RSC or `fetch` + cache.
[Source: architecture.md#State Management Decision]

### Project Structure Notes

```
budgetx-frontend/
├── app/
│   ├── layout.tsx         ← Root layout (fonts, toaster, theme)
│   ├── page.tsx           ← Landing/redirect to dashboard
│   └── globals.css        ← CSS custom properties + Tailwind
├── components/
│   └── ui/                ← shadcn/ui components (auto-generated)
├── lib/
│   ├── utils.ts           ← shadcn's cn() utility (auto-generated)
│   └── categories.ts      ← 12 category icon/color mappings
├── hooks/                 ← Custom React hooks (empty for now)
├── public/                ← Static assets
├── tailwind.config.ts     ← Design tokens, surface levels, fonts
├── .env.local.example     ← Documented env vars template
└── next.config.ts         ← Next.js config
```

### Critical Design Token Values

**Surface Hierarchy (5 levels) — from UX spec:**

| Level | CSS Variable | Tailwind Class | HSL (Dark) |
|-------|-------------|---------------|------------|
| L0 | `--background` | `bg-surface-0` | `222 47% 6%` |
| L1 | `--card` | `bg-surface-1` | `222 47% 9%` |
| L2 | `--muted` | `bg-surface-2` | `222 47% 14%` |
| L3 | `--popover` | `bg-surface-3` | `222 47% 12%` |
| L4 | `--input` | `bg-surface-4` | `222 47% 16%` |

[Source: ux-design-specification.md#Visual Design Foundation]

**Semantic Colors (HSL):**

| Token | HSL | Role |
|-------|-----|------|
| `--primary` | `142 70% 45%` | Emerald green — FAB, save, income |
| `--secondary` | `217 91% 60%` | Cool blue — expenses (NOT red), links |
| `--accent` | `38 92% 50%` | Amber — streaks, badges, alerts |
| `--destructive` | `0 84% 60%` | Red — delete/error ONLY |
| `--income` | `142 70% 45%` | Same as primary |
| `--expense` | `217 91% 60%` | Same as secondary (blue, NOT red) |
| `--alert` | `38 92% 50%` | Same as accent (amber, NOT red) |
| `--streak-fire` | `15 90% 55%` | Orange-red fire gradient |

[Source: ux-design-specification.md#Color Palette]

**CRITICAL: Expenses are BLUE, not red.** This is a deliberate design decision ("Encouragement Over Surveillance"). Red is reserved for destructive actions only.

### Light Mode Colors

Light mode values are the inverse: lighter backgrounds, darker text. Map these CSS variables in `.light` or `:root` (with dark being the `class="dark"` override is reversed — dark is the default):

- `--background`: `0 0% 100%` (white)
- `--card`: `0 0% 97%`
- `--muted`: `222 10% 94%`
- `--popover`: `0 0% 98%`
- `--input`: `222 10% 91%`
- `--foreground`: `222 47% 11%` (near-black)
- Primary/secondary/accent/destructive remain the same in both modes

### Category Definitions

`lib/categories.ts` must export these 12 predefined categories. Use exact Lucide icon names:

```typescript
export const PREDEFINED_CATEGORIES = [
  { name: 'Food', icon: 'Utensils', color: 'hsl(25, 95%, 53%)', type: 'EXPENSE' },
  { name: 'Transport', icon: 'Car', color: 'hsl(217, 91%, 60%)', type: 'EXPENSE' },
  { name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(280, 68%, 60%)', type: 'EXPENSE' },
  { name: 'Bills', icon: 'Receipt', color: 'hsl(0, 84%, 60%)', type: 'EXPENSE' },
  { name: 'Entertainment', icon: 'Film', color: 'hsl(330, 81%, 60%)', type: 'EXPENSE' },
  { name: 'Health', icon: 'Heart', color: 'hsl(142, 70%, 45%)', type: 'EXPENSE' },
  { name: 'Education', icon: 'GraduationCap', color: 'hsl(199, 89%, 48%)', type: 'EXPENSE' },
  { name: 'Travel', icon: 'Plane', color: 'hsl(262, 83%, 58%)', type: 'EXPENSE' },
  { name: 'Groceries', icon: 'Apple', color: 'hsl(142, 55%, 42%)', type: 'EXPENSE' },
  { name: 'Rent', icon: 'Home', color: 'hsl(38, 92%, 50%)', type: 'EXPENSE' },
  { name: 'Salary', icon: 'Briefcase', color: 'hsl(142, 70%, 45%)', type: 'INCOME' },
  { name: 'Other', icon: 'MoreHorizontal', color: 'hsl(222, 10%, 55%)', type: 'EXPENSE' },
] as const;
```

### Environment Variables Template

`.env.local.example`:
```env
# BudgetX Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=BudgetX
```

### Library & Framework Requirements

| Library | Version | Purpose | Critical Notes |
|---------|---------|---------|---------------|
| Next.js | 16.2.x | App framework | Use App Router, NOT pages. Turbopack is default bundler. |
| TypeScript | 5.x | Type safety | strict mode enabled by create-next-app |
| Tailwind CSS | 4.x | Styling | CSS-first config in v4 — check if `tailwind.config.ts` or `@theme` in CSS |
| shadcn/ui | latest | UI components | `npx shadcn@latest init`, New York style, Slate base |
| Zustand | 5.x | Client state | Only for UI state. NOT for server data. |
| Axios | 1.x | HTTP client | For Spring Boot API calls |
| date-fns | 4.x | Date utilities | IST timezone handling |
| Recharts | 2.x | Charts | Dashboard analytics (not used in this story) |
| Lucide React | latest | Icons | Category icons, navigation icons |
| Sonner | latest | Toast notifications | Via shadcn: `npx shadcn@latest add sonner` |

### Next.js 16 Specific Notes

- **Turbopack is the default bundler** — no need for `--turbopack` flag. It's automatic.
- **`create-next-app@latest --yes`** uses recommended defaults: TypeScript, Tailwind CSS, ESLint, App Router. The `--yes` flag skips all prompts.
- **`use cache` directive** — New in Next.js 16 for caching. Not needed in this story but will be used for dashboard data in Epic 6.

### Anti-Patterns to Avoid

1. **Do NOT create a `pages/` directory.** App Router only. File-based routing in `/app`.
2. **Do NOT use CSS-in-JS** (styled-components, emotion). Tailwind + shadcn only.
3. **Do NOT install `@radix-ui/*` manually.** shadcn/ui handles Radix primitives internally.
4. **Do NOT use `React.FC` type annotation.** Use plain function components with typed props.
5. **Do NOT use `useEffect` for theme detection.** Use `next-themes` or the `class` strategy with `prefers-color-scheme` media query in CSS.
6. **Do NOT create a custom toast system.** Use sonner (installed via shadcn).
7. **Do NOT store category data in a database at this stage.** `lib/categories.ts` is a static file. Database categories are created in Story 3.1.

### Testing Requirements

- Verify `npm run dev` starts without errors
- Verify `npm run build` completes without errors
- Verify `npm run lint` passes
- Verify dark mode renders by default
- Verify all 12 categories are exported from `lib/categories.ts`
- Verify `<Toaster />` is mounted (inspect DOM)
- Verify skip link is the first focusable element (Tab from page load)

### References

- [Source: architecture.md#Starter Template Selection] — Next.js 16.2.2 config, dependencies, structure
- [Source: architecture.md#State Management Decision] — Zustand rationale and scope
- [Source: ux-design-specification.md#Design System Foundation] — Color palette, typography, spacing
- [Source: ux-design-specification.md#Visual Design Foundation] — Surface hierarchy, gradient usage
- [Source: ux-design-specification.md#Typography System] — Font loading, type scale
- [Source: epics.md#Story 1.1] — Acceptance criteria and requirements

## Dev Agent Record

### Agent Model Used

Gemini 3.1 Pro (High)

### Debug Log References

- Tailwind v4 handles tokens dynamically via `@theme inline` rather than `tailwind.config.ts`.
- Implemented script tag for robust, flash-free dark mode theme initialization based on `localStorage` or `prefers-color-scheme`.
- Replaced font `@import` with `next/font/google` for optimal, zero CLS rendering and self-hosting.

### Completion Notes List

- ✅ Successfully initialized Next.js 16 app with Turbopack, App Router, and TypeScript.
- ✅ Configured semantic UI tokens and deep color hierarchies reflecting the `Dark Finance Premium` UX theme.
- ✅ Prepared custom categories and env variable templates.
- ✅ Validated build, lint, and formatting.

### File List

- `budgetx-frontend/app/globals.css` (Modified)
- `budgetx-frontend/app/layout.tsx` (Modified)
- `budgetx-frontend/lib/categories.ts` (New)
- `budgetx-frontend/.env.local.example` (New)
