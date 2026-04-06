---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
---

# BudgetX - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BudgetX, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

> **Global Testing Rule:** Every story includes E2E test(s) covering happy path + primary error path, using Playwright fixtures from Story 1.5. E2E tests are implicit acceptance criteria for all stories and do not need to be restated per-story.

## Requirements Inventory

### Functional Requirements

**Authentication & Account Management (FR1–FR6):**
- FR1: Users can register a new account with email and password
- FR2: Users can login with email and password to access their account
- FR3: Users can view their account information and settings
- FR4: Users can change their password securely
- FR5: System automatically logs out inactive users after token expiry
- FR6: Users remain authenticated across multiple app sessions via JWT token

**Transaction Logging & Management (FR7–FR16):**
- FR7: Users can create a new expense transaction and save it as a draft
- FR8: Users can create a new income entry and save it as a draft
- FR9: Users can create an investment transaction and save it as a draft
- FR9a: Users can enter initial investment balances during onboarding for each investment type (PPF, mutual funds, stocks)
- FR9b: System displays current investment value (initial balance + additions - withdrawals) on the dashboard
- FR9c: System tracks investment transactions (additions/withdrawals) separately from initial balance to show growth
- FR9d: Users can add or update investment balances at any time after onboarding
- FR10: Users can select from predefined expense categories or create custom categories
- FR11: Users can categorize investment transactions by type (PPF, mutual funds, stocks)
- FR12: Users can view all their transactions (both draft and published)
- FR13: Users can edit a draft transaction before publishing
- FR14: Users can delete a draft transaction before publishing
- FR15: Users can edit or delete a published transaction within 1 month of the transaction entry date
- FR16: Users can view transaction amount, category, date, and notes for each entry

**Weekly Publishing Ritual (FR17–FR20):**
- FR17: Users can publish all drafted transactions for the current week in a single action
- FR18: System converts all transactions to permanent/final state upon publish
- FR19: System prevents editing transactions from more than 1 month ago after published
- FR20: System resets draft transaction list after weekly publish for the next week's entries

**Dashboard & Financial Summary (FR21–FR24):**
- FR21: Users can view their lifetime financial summary (total income, total expenses, total invested)
- FR22: Users can view current month financial breakdown by expense category
- FR23: Users can view current month's total income, total expenses, and running savings rate
- FR24: Users can access a quick-add button to rapidly create new transactions

**Analytics & Insights (FR25–FR29a):**
- FR25: System calculates weekly savings rate as (total income - total expenses) / total income; investments excluded
- FR26: Users can view their savings rate displayed as a percentage each week after publishing
- FR27: Users can view monthly spending trends across previous months (visual graph)
- FR28: Users can see spending distribution broken down by category (current month)
- FR29: Users can view historical spending patterns to identify trends
- FR29a: System provides month-over-month spending pattern comparison

**Gamification & Engagement (FR30–FR36):**
- FR30: System automatically tracks daily transaction logging streaks
- FR31: Users can view their current streak count on the dashboard
- FR32: System maintains streak count even if a week is not published; streak resets weekly on Sunday after publish
- FR33: System awards achievement badges for milestones
- FR34: Users can view their badge collection on the dashboard
- FR35: Users can see badge descriptions and unlock conditions
- FR36: System displays streak and badge count prominently on user dashboard

**Alerts & Budget Thresholds (FR37–FR45):**
- FR37: System prompts users during onboarding to set up alert thresholds
- FR38: Users can define per-category spending alert thresholds (₹X OR Y% of average)
- FR39: Users can define a global monthly spending cap (₹X OR Y% of average income)
- FR40: Users can view their current alert configuration
- FR41: Users can modify alert thresholds after initial setup
- FR42: System monitors spending against configured alert thresholds in real-time
- FR43: System notifies users when a category-specific threshold is exceeded
- FR44: System notifies users when global monthly spending cap is exceeded
- FR45: Users can dismiss or clear alert notifications

**Friend Management (FR46–FR50):**
- FR46: Users can add a friend by entering their email address
- FR47: Users can view a list of their added friends
- FR48: Users can remove a friend from their friend list
- FR49: System displays friend name or identifier once connection is established
- FR50: System stores friend relationships for future leaderboard features (Phase 2)

**Onboarding & Setup (FR51–FR53):**
- FR51: System guides users through registration, investment balance entry, and alert threshold setup
- FR52: Users can skip optional investment balance entry
- FR53: System requires investment balance entry if user selects investment types

**Data Security & Persistence (FR54–FR59):**
- FR54: System encrypts sensitive transaction data (amounts and names) at rest
- FR55: System enforces HTTPS for all user data transmission
- FR56: System validates all user inputs to prevent injection attacks
- FR57: System maintains data persistence and prevents loss during system failures
- FR58: Users cannot access other users' transaction data or account information
- FR59: System prevents unauthorized API access by requiring valid JWT authentication

### NonFunctional Requirements

**NFR1 (Performance — Dashboard):** Dashboard summary page loads completely within 1 second (4G network)
**NFR2 (Performance — Visualization):** Category breakdown visualization renders within 1 second
**NFR3 (Performance — Transactions):** Transaction history page loads within 1 second
**NFR4 (Performance — Publish):** Weekly publish ritual completes within 500ms (atomic operation)
**NFR5 (Performance — FAB):** Quick-add FAB opens within 200ms
**NFR6 (Performance — CRUD):** Transaction editing/deletion completes within 500ms
**NFR7 (Performance — Analytics):** Monthly trends chart generates within 1 second
**NFR8 (Performance — Savings):** Savings rate calculations complete within 500ms
**NFR9 (Security — Injection):** OWASP A03:2025 — all inputs validated, prepared statements, no concatenated SQL
**NFR10 (Security — Auth):** OWASP A07:2025 — bcrypt 12+ rounds, JWT 30-day expiry, rate limiting (5/15min)
**NFR11 (Security — Encryption):** OWASP A02:2025 — AES-256 on amounts + names, keys in secrets manager, TLS 1.2+
**NFR12 (Security — Access):** OWASP A01:2025 — users access only own data, ownership validation, no account enumeration
**NFR13 (Security — Headers):** CORS frontend-only, X-Frame-Options, CSP headers, no secrets in logs
**NFR14 (Security — Passwords):** Minimum 8 characters, bcrypt hashing, secure reset with 24hr token
**NFR15 (Security — Dependencies):** Quarterly vulnerability scans, 30-day patch SLA
**NFR16 (Reliability — Uptime):** 99.9% uptime over 30-day rolling period
**NFR17 (Reliability — Backups):** Automated daily PostgreSQL backups, 7-day PITR
**NFR18 (Reliability — Recovery):** Health checks every 30s, auto-restart, graceful shutdown
**NFR19 (Browser):** Chrome latest 2 (primary), Safari/Firefox latest (secondary), 1024px+ minimum

### Additional Requirements

**From Architecture Document:**
- AR1: Next.js 16.2.2 frontend starter (App Router, TypeScript, Tailwind CSS, Turbopack)
- AR2: Spring Boot 4.0.5 backend starter (Java 25 LTS, Gradle Kotlin DSL, PostgreSQL)
- AR3: Rollup tables for dashboard aggregations (pre-computed, unencrypted totals updated on publish/edit)
- AR4: Polling-based notification delivery (check alerts on page load + post-transaction, not WebSocket)
- AR5: Flyway SQL-based database migrations
- AR6: JWT stored in httpOnly cookies + double-submit CSRF protection (not Authorization header)
- AR7: AES-256 encryption via JPA `@Converter` (transparent encrypt/decrypt on entity fields)
- AR8: All monetary amounts stored and transmitted as integer paise (₹1 = 100 paise)
- AR9: IST timezone hardcoded for all date/time logic in MVP1
- AR10: Zustand for client-side UI state (modals, toast, FAB state) — server data via RSC
- AR11: AWS deployment: ECS/Fargate (backend), RDS PostgreSQL (database), Secrets Manager (keys)
- AR12: GitHub Actions CI/CD pipeline (build → test → deploy)
- AR13: Sentry for error tracking, CloudWatch for logs/metrics
- AR14: Playwright for E2E testing, Jest+RTL for unit, JUnit5+Mockito+TestContainers for backend
- AR15: Investment model as mini state machine (baseline + additions - withdrawals = current value)
- AR16: Published transaction edit cascades recalculate all downstream aggregates (rollup tables, savings rate)

### UX Design Requirements

- UX-DR1: Implement Tailwind CSS design token system with 5-level dark surface hierarchy (`bg-surface-0` through `bg-surface-4`) and semantic color mapping (Green/Primary, Blue/Secondary, Amber/Accent, Red/Destructive)
- UX-DR2: Implement light mode theme as secondary (user-toggleable via Sun/Moon icon in sidebar)
- UX-DR3: Build FAB component — 56×56px fixed bottom-6 right-6, green with glow, 5 states (default, hover, active, success flash, pulsing), keyboard shortcut `N`
- UX-DR4: Build TransactionDialog component — slide-up dialog with Expense/Income type toggle (visible by default), ₹ amount input (JetBrains Mono), 3×4 CategoryGrid, "More options ▾" (Name, Date), "Log another?" success state
- UX-DR5: Build CategoryGrid component — 3×4 Lucide icon grid (12 categories), data-driven via `categories[]` prop, icon/color map in `lib/categories.ts`, last-used pre-highlighted
- UX-DR6: Build AnimatedNumber component — count-up animation (0→target), JetBrains Mono, Indian number formatting (₹1.25L for ≥₹1,00,000), respects `prefers-reduced-motion`
- UX-DR7: Build CelebrationOverlay component — 3 variants (first/normal/milestone), radial gradient bg, badge emoji bounce, AnimatedNumber for savings rate, streak counter
- UX-DR8: Build TransactionCard component — draft variant (dashed border, amber dot, edit/delete) and published variant (solid border, green dot, lock icon, read-only)
- UX-DR9: Build StreakCounter component — 4 states (active, shield-active, shield-used, broken), fire emoji animation, best streak display
- UX-DR10: Build PublishPreviewDialog component — client-side totals computation, scrollable mini transaction list (max 6 visible), week date range, Cancel/Confirm
- UX-DR11: Build SidebarNav component — server component with client islands, 6 nav items + avatar/name + theme toggle + keyboard shortcuts (?) + logout, 240px lg / 64px md
- UX-DR12: Build OnboardingStepper component — 4-step wizard (Income → Thresholds → Investment → First Transaction), horizontal progress dots, Back/Next/Skip
- UX-DR13: Implement sonner toast system — max 3 stacked (top-right), auto-dismiss 3s default / 5s for Undo, green/amber/red variants
- UX-DR14: Implement keyboard shortcuts system — N (new), P (publish), Esc (close), ⌘+Enter (save), ? (shortcuts dialog)
- UX-DR15: Implement empty state dashboard — all 6 card variants with instructional subtext and CTAs
- UX-DR16: Implement skeleton loading screens — pulsing surface-2 rectangles matching content shapes, never full-page spinners
- UX-DR17: Implement `data-testid` convention on all components — `{component}-{element}` naming
- UX-DR18: WCAG 2.1 AA compliance — 4.5:1 contrast ratios, focus-visible rings, aria labels, aria-live regions, skip link, focus trap in dialogs
- UX-DR19: Implement `<768px` unsupported message — "BudgetX is designed for desktop" full-screen message
- UX-DR20: Server vs Client component classification — TransactionCard and StreakCounter as Server Components; FAB, TransactionDialog, CategoryGrid, AnimatedNumber, CelebrationOverlay, PublishPreviewDialog, OnboardingStepper as Client Components
- UX-DR21: Implement soft delete + undo pattern for draft transaction deletion (5-second undo window)
- UX-DR22: Past-published-week backdating allowed — transactions dated in published weeks are immediately published, rollup tables recalculate
- UX-DR23: Publish button differentiation — `Send` Lucide icon prefix to distinguish from regular save buttons
- UX-DR24: Dashboard cards as navigation entry points — Savings Rate → Analytics, Streak → history dialog, This Week → Transactions filtered, Category donut segment → filtered Transactions

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Register with email/password |
| FR2 | Epic 2 | Login with email/password |
| FR3 | Epic 2 | View account info/settings |
| FR4 | Epic 2 | Change password |
| FR5 | Epic 2 | Auto-logout on token expiry |
| FR6 | Epic 2 | JWT session persistence |
| FR7 | Epic 3 | Create expense draft |
| FR8 | Epic 3 | Create income draft |
| FR9 | Epic 3 | Create investment draft |
| FR9a | Epic 4 | Investment baseline during onboarding |
| FR9b | Epic 6 | Dashboard investment value display |
| FR9c | Epic 6 | Investment growth tracking |
| FR9d | Epic 6 | Update investment balances anytime |
| FR10 | Epic 3 | Predefined + custom categories |
| FR11 | Epic 3 | Investment type categorization |
| FR12 | Epic 3 | View all transactions |
| FR13 | Epic 3 | Edit draft transaction |
| FR14 | Epic 3 | Delete draft transaction |
| FR15 | Epic 5 | Edit/delete published transaction (1-month grace) |
| FR16 | Epic 3 | View transaction details |
| FR17 | Epic 5 | Publish all drafts for week |
| FR18 | Epic 5 | Convert drafts to permanent state |
| FR19 | Epic 5 | Prevent editing >1 month old published transactions |
| FR20 | Epic 5 | Reset draft list after publish |
| FR21 | Epic 6 | Lifetime financial summary |
| FR22 | Epic 6 | Monthly category breakdown |
| FR23 | Epic 6 | Monthly income/expenses/savings rate |
| FR24 | Epic 6 | Quick-add FAB on dashboard |
| FR25 | Epic 6 | Weekly savings rate calculation |
| FR26 | Epic 6 | Savings rate display after publish |
| FR27 | Epic 6 | Monthly spending trends (graph) |
| FR28 | Epic 6 | Category spending distribution |
| FR29 | Epic 6 | Historical spending patterns |
| FR29a | Epic 6 | Month-over-month comparison |
| FR30 | Epic 7 | Track daily logging streaks |
| FR31 | Epic 7 | Streak count on dashboard |
| FR32 | Epic 7 | Streak persistence across missed publishes |
| FR33 | Epic 7 | Achievement badges for milestones |
| FR34 | Epic 7 | Badge collection display |
| FR35 | Epic 7 | Badge descriptions/unlock conditions |
| FR36 | Epic 7 | Streak/badge dashboard prominence |
| FR37 | Epic 4 | Onboarding alert threshold setup |
| FR38 | Epic 8 | Per-category alert thresholds |
| FR39 | Epic 8 | Global monthly spending cap |
| FR40 | Epic 8 | View alert configuration |
| FR41 | Epic 8 | Modify alert thresholds |
| FR42 | Epic 8 | Real-time threshold monitoring |
| FR43 | Epic 8 | Category threshold exceeded notification |
| FR44 | Epic 8 | Global cap exceeded notification |
| FR45 | Epic 8 | Dismiss/clear alert notifications |
| FR46 | Epic 9 | Add friend by email |
| FR47 | Epic 9 | View friends list |
| FR48 | Epic 9 | Remove friend |
| FR49 | Epic 9 | Display friend name/identifier |
| FR50 | Epic 9 | Store friend relationships (Phase 2 prep) |
| FR51 | Epic 4 | Guided onboarding flow |
| FR52 | Epic 4 | Skip optional investment entry |
| FR53 | Epic 4 | Require investment entry if type selected |
| FR54 | Epic 2 | Encrypt transaction data at rest |
| FR55 | Epic 1 | HTTPS enforcement |
| FR56 | Epic 2 | Input validation (injection prevention) |
| FR57 | Epic 1 | Data persistence / failure prevention |
| FR58 | Epic 2 | User data isolation |
| FR59 | Epic 2 | JWT-required API access |

## Epic List

### Epic 1: Project Scaffolding
**User outcome:** App shell is deployed and accessible — authenticated skeleton with design system, navigation, CI/CD pipeline, and testing infrastructure.
**Requirements:** FR55, FR57, AR1, AR2, AR5, AR8, AR9, AR11, AR12, AR13, AR14, UX-DR1, UX-DR2, UX-DR11, UX-DR13, UX-DR14, UX-DR16, UX-DR17, UX-DR18, UX-DR19, NFR16, NFR17, NFR18, NFR19
**Dependency:** None (foundation epic)

### Epic 2: Authentication & Security
**User outcome:** Users can register, login, manage account settings, and access a secure authenticated experience.
**Requirements:** FR1, FR2, FR3, FR4, FR5, FR6, FR54, FR56, FR58, FR59, AR6, AR7, NFR9, NFR10, NFR11, NFR12, NFR13, NFR14, NFR15
**Dependency:** Epic 1 (app shell + design system)

### Epic 3: Transaction Logging
**User outcome:** Users can quickly log expense, income, and investment transactions via FAB dialog — the core daily interaction.
**Requirements:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR16, AR10, UX-DR3, UX-DR4, UX-DR5, UX-DR8, UX-DR20, UX-DR21, UX-DR22, NFR3, NFR5, NFR6
**Dependency:** Epic 2 (authenticated user)

### Epic 4: Onboarding Experience
**User outcome:** New users are guided through setup — income, alert thresholds, investment baselines, and first transaction — so they're ready to use the app.
**Requirements:** FR37, FR51, FR52, FR53, FR9a, AR15, UX-DR12
**Dependency:** Epic 2 (auth), Epic 3 (transaction dialog for first transaction)

### Epic 5: Weekly Publishing Ritual
**User outcome:** Users can review drafts and publish their week in a single celebratory action. Published transactions are locked with 1-month grace for edits.
**Requirements:** FR15, FR17, FR18, FR19, FR20, AR3, AR16, UX-DR7, UX-DR10, UX-DR23, NFR4
**Dependency:** Epic 3 (transactions to publish)
**Note:** Publishes without gamification hooks — streak/badge integration added in Epic 7.

### Epic 6: Dashboard & Analytics
**User outcome:** Users see their financial health at a glance — lifetime totals, savings rate, category breakdown, monthly trends, and investment values.
**Requirements:** FR9b, FR9c, FR9d, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR29a, UX-DR6, UX-DR15, UX-DR24, NFR1, NFR2, NFR7, NFR8
**Dependency:** Epic 5 (published data to display)

### Epic 7: Gamification & Streaks
**User outcome:** Users track their logging streaks, earn badges, and feel rewarded for consistent engagement. Publish flow gains gamification hooks.
**Requirements:** FR30, FR31, FR32, FR33, FR34, FR35, FR36, UX-DR9
**Dependency:** Epic 5 (publish triggers streak/badge updates)

### Epic 8: Alerts & Budget Thresholds
**User outcome:** Users set spending guardrails and get notified when approaching or exceeding limits.
**Requirements:** FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45, AR4
**Dependency:** Epic 5 (rollup data for threshold comparison)

### Epic 9: Friend Management
**User outcome:** Users can add and manage friends in preparation for Phase 2 leaderboard features.
**Requirements:** FR46, FR47, FR48, FR49, FR50
**Dependency:** Epic 2 (authenticated users)

---

## Epic 1: Project Scaffolding

App shell is deployed and accessible — design system, navigation, CI/CD pipeline, and testing infrastructure.

### Story 1.1: Next.js Frontend Scaffolding

As a **developer**,
I want a Next.js 16 app with the design system fully configured,
So that all subsequent frontend work uses consistent tokens and tooling.

**Acceptance Criteria:**

**Given** a clean repository
**When** the Next.js app is initialized with `npx create-next-app@latest --yes --use-npm`
**Then** the app runs in development mode with TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack
**And** the following dependencies are installed: `zustand`, `axios`, `date-fns`, `recharts`, `lucide-react`
**And** shadcn/ui is initialized via `npx shadcn@latest init`

**Given** the Tailwind config
**When** `tailwind.config.ts` is updated
**Then** custom surface levels are defined (`bg-surface-0` through `bg-surface-4`) for both dark and light themes
**And** semantic color tokens are mapped: Green/Primary, Blue/Secondary, Amber/Accent, Red/Destructive
**And** JetBrains Mono is configured as the monospace font for financial numbers
**And** Inter is configured as the primary UI font via Google Fonts

**Given** the design system
**When** `globals.css` is configured
**Then** dark mode is the default theme (via `class` strategy)
**And** CSS custom properties define all theme colors for both dark and light modes
**And** `prefers-color-scheme` media query sets the initial theme

**Given** the app layout
**When** `app/layout.tsx` is created
**Then** it includes HTML lang attribute, meta viewport, page title "BudgetX", font loading with `display=swap`
**And** a skip link ("Skip to main content") is the first focusable element
**And** sonner `<Toaster />` provider is mounted at root level (top-right, max 3 visible)

**Given** the file structure
**When** reviewing the project
**Then** directories exist: `/app`, `/components`, `/components/ui`, `/lib`, `/hooks`, `/public`
**And** `lib/categories.ts` contains 12 category icon/color mappings (Lucide icon name + HSL color)
**And** `.env.local.example` documents required environment variables

### Story 1.2: Spring Boot Backend Scaffolding

As a **developer**,
I want a Spring Boot 4 backend with PostgreSQL, Flyway, and core utilities,
So that all subsequent backend work has a consistent foundation.

**Acceptance Criteria:**

**Given** a clean backend repository
**When** Spring Boot 4.0.5 is initialized via Spring Initializr
**Then** the project uses Gradle Kotlin DSL, Java 25 LTS, JAR packaging
**And** dependencies include: Spring Web, Spring Security, Spring Data JPA, PostgreSQL Driver, Spring Validation, Lombok, JJWT 0.12.6

**Given** the project structure
**When** reviewing `com.budgetx` package
**Then** domain packages exist: `config/`, `auth/`, `transaction/`, `publishing/`, `dashboard/`, `analytics/`, `gamification/`, `alert/`, `friend/`, `onboarding/`, `shared/`

**Given** the database configuration
**When** the application starts
**Then** it connects to PostgreSQL via `application.yml`
**And** Flyway runs migrations from `db/migration/` on startup
**And** initial migration `V1__init.sql` creates the `users` table

**Given** the paise utility
**When** `shared/PaiseUtil.java` is created
**Then** it provides `toPaise(BigDecimal)` → `long` and `toRupees(long)` → `BigDecimal`

**Given** IST timezone configuration
**When** the application starts
**Then** JVM default timezone is set to `Asia/Kolkata`

**Given** the encryption configuration
**When** `config/EncryptionConfig.java` is created
**Then** AES-256 key is loaded from environment / Secrets Manager
**And** `EncryptedStringConverter.java` implements JPA `AttributeConverter<String, String>`

**Given** the health endpoint
**When** `GET /api/health` is called
**Then** it returns `200 OK` with `{ "status": "healthy", "timestamp": "..." }`

**Given** the global exception handler
**When** any API error occurs
**Then** response format is `{ "success": false, "error": "message", "timestamp": "..." }`
**And** stack traces are never exposed in responses

**Given** CORS and security headers
**When** configured
**Then** only frontend origin is allowed, X-Frame-Options DENY, CSP headers set

### Story 1.3: CI Pipeline

As a **developer**,
I want automated build and test pipelines,
So that every push is validated before deployment.

**Acceptance Criteria:**

**Given** a push to main branch
**When** GitHub Actions CI workflow triggers
**Then** it builds Spring Boot JAR (Gradle `build`) and Next.js production bundle (`npm run build`)
**And** runs backend unit tests (JUnit5) and frontend linting + type checking
**And** pipeline fails fast if any step fails

**Given** all CI checks pass on a PR
**When** the PR is merged
**Then** the CD workflow (Story 1.4) triggers automatically

### Story 1.4: AWS Infrastructure & Deployment

As a **developer**,
I want AWS infrastructure provisioned and automated deployment,
So that the app is accessible in production with monitoring and backups.

**Acceptance Criteria:**

**Given** CI checks pass on main
**When** CD workflow triggers
**Then** Docker image is built and pushed to AWS ECR
**And** ECS Fargate service is updated with the new image
**And** Next.js is deployed to Vercel (or ECS as fallback)

**Given** AWS infrastructure
**When** environment is provisioned
**Then** RDS PostgreSQL has automated daily backups and 7-day PITR
**And** Secrets Manager stores DB credentials, AES key, JWT secret
**And** ECS health checks ping `/api/health` every 30s with auto-restart

**Given** monitoring
**When** deployed
**Then** Sentry DSN is configured for frontend and backend error tracking
**And** CloudWatch collects application logs from ECS

**Given** HTTPS enforcement (FR55)
**When** any HTTP request is made
**Then** it redirects to HTTPS (TLS 1.2+)

### Story 1.5: App Shell & Sidebar Navigation

As a **user**,
I want a navigation sidebar and responsive app layout,
So that I can navigate between app sections with clear visual hierarchy.

**Acceptance Criteria:**

**Given** an authenticated user on any page
**When** the app shell renders
**Then** sidebar shows: Avatar + Username (top), 6 nav items (Dashboard, Transactions, Analytics, Alerts, Friends, Settings), Theme toggle, Keyboard shortcuts (?), Logout (bottom)
**And** `data-testid` attributes follow convention: `sidebar-nav-dashboard`, etc.

**Given** screen width ≥1024px
**When** viewing sidebar
**Then** it renders at 240px with full text labels and avatar with username

**Given** screen width 768–1023px
**When** viewing sidebar
**Then** it collapses to 64px with icons only and initials avatar

**Given** screen width <768px
**When** viewing the page
**Then** full-screen message: "BudgetX is designed for desktop" (no functional UI)

**Given** the active page
**When** viewing sidebar
**Then** active item shows green text + left border + `surface-2` background
**And** `aria-current="page"` is set on active item

**Given** theme toggle click
**When** user clicks Sun/Moon icon
**Then** theme switches between dark/light, preference persisted in localStorage

**Given** keyboard shortcuts button
**When** user clicks ? or presses `?`
**Then** dialog shows all shortcuts (N, P, Esc, ⌘+Enter, ?)
**And** dialog closes on Esc or backdrop click

**Given** page navigation
**When** switching pages
**Then** content uses 200ms opacity fade-in
**And** skeleton loading screens appear during page loads

### Story 1.6: Testing Infrastructure

As a **developer**,
I want E2E and unit testing frameworks configured,
So that every subsequent story includes automated tests from day one.

**Acceptance Criteria:**

**Given** the frontend project
**When** Playwright is configured
**Then** `playwright.config.ts` targets Chrome, Firefox, Safari
**And** `tests/fixtures/` contains an authenticated route fixture
**And** sample E2E test verifies app loads and shows sidebar

**Given** Jest + React Testing Library
**When** configured
**Then** component tests render with design system providers
**And** sample test verifies `lib/categories.ts` exports 12 categories

**Given** the backend project
**When** JUnit5 + TestContainers is configured
**Then** base test class spins up PostgreSQL TestContainer with Flyway migrations
**And** sample test verifies `GET /api/health` returns 200

**Given** the CI pipeline
**When** tests are added
**Then** frontend, backend, and E2E tests run automatically in CI (headless)

---

## Epic 2: Authentication & Security

Users can register, login, manage account settings, and access a secure authenticated experience.

### Story 2.1: User Registration

As a **user**,
I want to create an account with my email and password,
So that I can start using BudgetX.

**Acceptance Criteria:**

**Given** an unauthenticated user on `/register`
**When** they enter email, name, and password (min 8 chars) and submit
**Then** a new user account is created with password hashed via bcrypt (12+ rounds)
**And** a JWT token is set as an httpOnly cookie with 30-day expiry
**And** a CSRF token is returned for double-submit protection
**And** the user is redirected to onboarding (or dashboard if already complete)

**Given** a registration attempt with an already-registered email
**When** the form is submitted
**Then** a generic error returns ("Unable to create account") — no email enumeration

**Given** invalid input
**When** email format is wrong or password <8 characters
**Then** inline validation errors appear below fields (red border + error text)

### Story 2.2: User Login

As a **user**,
I want to login with my email and password,
So that I can access my financial data.

**Acceptance Criteria:**

**Given** an unauthenticated user on `/login`
**When** they enter valid email and password
**Then** a JWT httpOnly cookie is set (30-day expiry) and user is redirected to dashboard

**Given** incorrect credentials
**When** login fails
**Then** generic error: "Invalid email or password" (no field-specific info)

**Given** rate limiting
**When** 5 failed attempts within 15 minutes
**Then** account is temporarily locked: "Too many attempts. Try again in 15 minutes."

**Given** an already-authenticated user visiting `/login`
**Then** they are redirected to dashboard

### Story 2.3: Session Management & Auto-Logout

As a **user**,
I want to stay logged in across sessions and be logged out when my token expires,
So that I don't have to login daily but my account stays secure.

**Acceptance Criteria:**

**Given** a valid JWT cookie
**When** visiting any protected page
**Then** user is authenticated without re-entering credentials (FR6)

**Given** an expired JWT (>30 days)
**When** visiting any protected page
**Then** user is redirected to `/login` with "Session expired" message (FR5)

**Given** an unauthenticated request to `/api/*` (except `/api/health`, `/api/auth/*`)
**Then** API returns `401 Unauthorized` (FR59)

**Given** user clicks "Logout"
**When** logout fires
**Then** JWT cookie and CSRF token are cleared, redirected to `/login`

### Story 2.4: Account Settings & Password Change

As a **user**,
I want to view my account info and change my password,
So that I can manage my account security.

**Acceptance Criteria:**

**Given** an authenticated user on `/settings`
**When** page loads
**Then** it displays: email (read-only), name, account creation date (FR3)

**Given** user enters current password + new password (min 8 chars) + confirm
**When** current password is correct
**Then** password is updated (bcrypt hashed), toast: "Password changed ✓" (FR4)

**Given** incorrect current password
**Then** error: "Current password is incorrect", no changes made

**Given** new password ≠ confirm password
**Then** inline error: "Passwords don't match"

### Story 2.5: Data Encryption & Input Validation

As a **system**,
I want all sensitive data encrypted and all inputs validated,
So that user data is protected from breaches and injection attacks.

**Acceptance Criteria:**

**Given** the `@Convert(converter = EncryptedStringConverter.class)` annotation on entity fields
**When** data is saved to database
**Then** values are AES-256 encrypted before write and decrypted on read (FR54)

**Given** any API endpoint receives input
**When** request is processed
**Then** all strings are trimmed/sanitized, SQL injection prevented via prepared statements (FR56)

**Given** a user makes an API request
**When** JWT is validated
**Then** user can only access resources matching their `userId` (FR58)
**And** accessing another user's data returns `403 Forbidden`

**Given** any state-changing request (POST/PUT/DELETE)
**When** processed
**Then** CSRF double-submit token is validated, missing token returns `403`

### Story 2.6: Login & Register UI Pages

As a **user**,
I want polished login and registration pages,
So that my first impression of BudgetX is professional and trustworthy.

**Acceptance Criteria:**

**Given** `/login` page
**When** it renders
**Then** centered card on `surface-1` with: BudgetX name, email input, password input, "Login" primary button, "Create account" link

**Given** `/register` page
**When** it renders
**Then** centered card with: name, email, password (strength hint), "Create Account" button, "Already have an account?" link

**Given** either form
**When** submitting
**Then** button shows spinner + disabled state
**And** all inputs have `aria-label`, logical tab order, `data-testid` attributes

### Story 2.7: Password Reset Flow

As a **user**,
I want to reset my password via email if I forget it,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** the login page
**When** user clicks "Forgot Password?"
**Then** a form appears asking for their email address

**Given** a valid email is submitted
**When** the account exists
**Then** a password reset email is sent with a one-time secure token (24-hour expiry)
**And** the response is generic: "If an account exists, a reset email was sent" (no enumeration)

**Given** the user clicks the reset link in the email
**When** the token is valid and not expired
**Then** a form appears to enter new password (min 8 chars) + confirm password

**Given** the user submits a new password
**When** the password meets requirements and tokens match
**Then** password is updated (bcrypt hashed), old sessions invalidated
**And** user is redirected to login with toast: "Password reset successful"

**Given** an expired or already-used token
**When** the user clicks the reset link
**Then** error: "This reset link has expired. Request a new one."

> **Infrastructure note:** Requires email service (AWS SES or SMTP) configured in Story 1.4 (AWS Infrastructure). Add `spring-boot-starter-mail` dependency in Story 1.2.

---

## Epic 3: Transaction Logging

Users can quickly log expense, income, and investment transactions via FAB dialog — the core daily interaction.

### Story 3.1: Transaction Database & API

As a **developer**,
I want the transaction backend (entity, repository, API endpoints),
So that the frontend can create, read, update, and delete transactions.

**Acceptance Criteria:**

**Given** the Flyway migration
**When** `V2__transactions.sql` runs
**Then** `transactions` table is created with: id (UUID), user_id (FK), type (EXPENSE/INCOME/INVESTMENT), amount_paise (long), name_encrypted (text), category (text), date (LocalDate), notes (text nullable), status (DRAFT/PUBLISHED), created_at, updated_at
**And** `categories` table is created with: id, user_id (FK nullable for predefined), name, icon, color, type (EXPENSE/INCOME/INVESTMENT), is_predefined (boolean)
**And** 12 predefined categories are seeded (matching `lib/categories.ts` icons)

**Given** `POST /api/transactions`
**When** a valid transaction payload is submitted
**Then** amount is stored as integer paise, name is encrypted via `@Convert`, status defaults to DRAFT
**And** response returns the created transaction with decrypted fields

**Given** `GET /api/transactions?status=DRAFT&weekStart=2026-04-06`
**When** called with filters
**Then** returns filtered transactions for the authenticated user only (FR12, FR58)

**Given** `PUT /api/transactions/{id}`
**When** updating a DRAFT transaction
**Then** fields are updated, encrypted fields re-encrypted (FR13)
**And** updating a PUBLISHED transaction older than 1 month returns `403`

**Given** `DELETE /api/transactions/{id}`
**When** deleting a DRAFT transaction
**Then** the transaction is soft-deleted (FR14)
**And** deleting a PUBLISHED transaction older than 1 month returns `403`

**Given** `GET /api/categories`
**When** called
**Then** returns predefined categories + user's custom categories

**Given** `POST /api/categories`
**When** a new custom category is created
**Then** it is associated with the user and available in future transactions (FR10)

**Given** `POST /api/transactions` with a date in a past-published week (UX-DR22)
**When** the transaction is saved
**Then** it saves as DRAFT (rollup tables may not exist yet in Epic 3)
**And** the response includes a flag `backdated: true` with the target week date
**And** the actual auto-publish + rollup recalculation is handled in Story 5.1 when rollup tables exist

### Story 3.2: FAB Component

As a **user**,
I want a floating action button to quickly start logging a transaction,
So that I can capture expenses in under 10 seconds.

**Acceptance Criteria:**

**Given** an authenticated user on any page
**When** the page renders
**Then** a 56×56px circular green button appears fixed at bottom-6 right-6 with a `+` icon
**And** it has a subtle green glow/shadow

**Given** the FAB
**When** hovering
**Then** it scales up slightly (1.1×) with brightness increase

**Given** the FAB
**When** clicked or `N` key is pressed
**Then** the TransactionDialog opens (slide-up animation, 300ms)
**And** FAB enters active state (no pulse)

**Given** a successful transaction save
**When** the dialog closes
**Then** FAB shows a brief green flash (success state, 500ms) then returns to default

**Given** no transactions exist in the current week
**When** viewing the FAB
**Then** it pulses gently (scale animation) to encourage first entry

**And** `data-testid="fab-button"` is set
**And** `aria-label="Add new transaction"` is set

### Story 3.3: TransactionDialog — Core

As a **user**,
I want a quick transaction entry dialog with amount, type, and category,
So that logging an expense takes minimal effort.

**Acceptance Criteria:**

**Given** the dialog opens (via FAB or `N` key)
**When** it renders
**Then** it slides up from bottom (300ms) with backdrop (`bg-black/50`)
**And** focus is trapped inside the dialog
**And** default type is "Expense" with Expense/Income toggle visible at top

**Given** the amount input
**When** the user types a number
**Then** it displays in JetBrains Mono, large size (`text-4xl`), with ₹ prefix
**And** amount field is auto-focused on dialog open

**Given** the CategoryGrid
**When** rendered below amount
**Then** 12 categories display in a 3×4 grid with Lucide icons
**And** the last-used category is pre-highlighted
**And** clicking a category selects it (green ring indicator)

**Given** the user clicks "Save" or presses `⌘+Enter`
**When** amount > 0 and category is selected
**Then** transaction is saved as DRAFT via `POST /api/transactions`
**And** toast: "Transaction saved ✓" (green, 3s)

**Given** validation failure
**When** amount is 0 or no category selected
**Then** inline error below the relevant field, dialog stays open

**Given** API error on save
**When** the request fails
**Then** inline error in dialog, all data preserved, dialog stays open

**And** `data-testid` set on: `transaction-dialog`, `transaction-amount-input`, `transaction-type-toggle`, `transaction-category-grid`, `transaction-save-button`
**And** dialog closes on Esc or backdrop click (unsaved data triggers confirmation only if amount entered)

> **Implementation note:** Dialog internal state (last-used type, last-used category, open/closed) is managed via Zustand store (`useTransactionDialogStore`). Set up the store in this story so Story 3.4 (Advanced) can extend it.

### Story 3.4: TransactionDialog — Advanced Features

As a **user**,
I want optional fields (name, date), backdating info, and "Log another" flow,
So that I have full flexibility when logging transactions.

**Acceptance Criteria:**

**Given** the "More options ▾" toggle
**When** clicked
**Then** it reveals: Name input (text, optional), Date picker (defaults to today, max = today)
**And** if date falls in a past published week, info text: "This transaction will be added to a published week" (UX-DR22)

**Given** a successful save
**When** dialog shows the success state
**Then** "Log another?" prompt appears with two options: Save & Close / Log Another
**And** "Log Another" resets amount + category but preserves type selection

**Given** the dialog has unsaved data (amount entered)
**When** Esc or backdrop click is attempted
**Then** a confirmation prompt asks: "Discard unsaved transaction?"

### Story 3.5: Transaction List Page

As a **user**,
I want to view all my transactions in a chronological list,
So that I can review what I've logged.

**Acceptance Criteria:**

**Given** an authenticated user on `/transactions`
**When** the page loads
**Then** transactions display in reverse chronological order (newest first)
**And** each transaction renders as a TransactionCard component

**Given** a DRAFT transaction card
**When** rendered
**Then** it shows: dashed border, amber status dot, category icon + name, amount (₹ formatted), date
**And** edit (pencil) and delete (trash) action buttons are visible

**Given** a PUBLISHED transaction card
**When** rendered
**Then** it shows: solid border, green status dot, lock icon, category + amount + date
**And** if within 1-month grace period: edit/delete buttons visible
**And** if older than 1 month: no action buttons, fully read-only

**Given** the transaction list is empty
**When** no transactions exist
**Then** empty state: illustration + "No transactions yet" + "Log your first transaction" CTA button (links to FAB action)

**Given** transaction filters
**When** status filter is toggled (All / Drafts / Published)
**Then** the list filters accordingly
**And** URL updates with query params for deep linking

**And** `data-testid` set: `transaction-list`, `transaction-card-{id}`, `transaction-card-edit`, `transaction-card-delete`

### Story 3.6: Edit & Delete Draft Transactions

As a **user**,
I want to edit and delete my draft transactions,
So that I can fix mistakes before publishing.

**Acceptance Criteria:**

**Given** a draft transaction card
**When** the edit button is clicked
**Then** the TransactionDialog opens pre-filled with the transaction's data (amount, type, category, name, date)
**And** the dialog title changes to "Edit Transaction"

**Given** the user modifies fields and clicks Save
**When** the update is submitted
**Then** `PUT /api/transactions/{id}` is called
**And** toast: "Transaction updated ✓"
**And** the transaction list refreshes with updated data

**Given** a draft transaction card
**When** the delete button is clicked
**Then** the transaction is immediately removed from the list (optimistic UI)
**And** toast: "Transaction deleted" with "Undo" button (amber, 5-second window) (UX-DR21)
**And** if Undo is clicked within 5 seconds, the transaction is restored
**And** if no Undo, `DELETE /api/transactions/{id}` is called

**Given** an attempt to edit/delete a published transaction older than 1 month
**When** the action is attempted
**Then** the API returns `403` and toast: "This transaction can no longer be edited" (FR19)

### Story 3.7: Investment Transaction Type Support

As a **user**,
I want to log investment transactions (PPF, mutual funds, stocks),
So that I can track my investments alongside expenses and income.

**Acceptance Criteria:**

**Given** the TransactionDialog type toggle
**When** "Investment" is selected (as a third option or sub-type of Income)
**Then** the CategoryGrid switches to investment types: PPF, Mutual Funds, Stocks
**And** amount input accepts positive values (additions) or negative values (withdrawals)

**Given** an investment transaction
**When** saved
**Then** it stores with type=INVESTMENT, category = investment type (FR9, FR11)
**And** appears in the transaction list with investment-specific icon

**Given** the custom category feature (FR10)
**When** a user clicks "+" in the CategoryGrid
**Then** a small input appears to name a new category
**And** the user selects an icon from a Lucide icon picker
**And** the custom category is saved via `POST /api/categories` and immediately available

---

## Epic 4: Onboarding Experience

New users are guided through setup — income, alert thresholds, investment baselines, and first transaction — so they're ready to use the app.

### Story 4.1: Onboarding Backend API

As a **developer**,
I want onboarding API endpoints to save income, thresholds, and investment baselines,
So that the frontend wizard can persist the user's setup data.

**Acceptance Criteria:**

**Given** Flyway migration `V3__onboarding.sql`
**When** it runs
**Then** `alerts` table is created: id, user_id (FK), category (text nullable for global), threshold_type (FIXED/PERCENTAGE), threshold_value (long paise or int percentage), is_global (boolean), created_at, updated_at
**And** `investment_baselines` table is created: id, user_id (FK), investment_type (PPF/MUTUAL_FUNDS/STOCKS), amount_paise (long), created_at, updated_at
**And** `users` table gains: `monthly_income_paise` (long, nullable), `onboarding_completed` (boolean, default false)

**Given** `POST /api/onboarding/income`
**When** monthly income is submitted
**Then** `users.monthly_income_paise` is updated

**Given** `POST /api/onboarding/alerts`
**When** alert thresholds are submitted (array of category thresholds + optional global cap)
**Then** entries are created in `alerts` table (FR37)
**And** each threshold is either FIXED (₹X paise) or PERCENTAGE (Y%), never both

**Given** `POST /api/onboarding/investments`
**When** investment baselines are submitted
**Then** entries are created in `investment_baselines` for each type (FR9a)

**Given** `POST /api/onboarding/complete`
**When** called
**Then** `users.onboarding_completed` is set to true
**And** subsequent logins redirect to dashboard instead of onboarding

### Story 4.2: OnboardingStepper Component

As a **new user**,
I want a guided step-by-step setup wizard,
So that I can configure my account without being overwhelmed.

**Acceptance Criteria:**

**Given** a new user who has not completed onboarding
**When** they login
**Then** they are redirected to `/onboarding` (not dashboard)

**Given** the onboarding page
**When** it renders
**Then** a 4-step horizontal progress indicator shows: Income → Thresholds → Investments → First Transaction
**And** dots indicate: completed (green), current (green + ring), upcoming (muted)

**Given** Step 1 (Income)
**When** the user enters monthly income (₹ amount input, JetBrains Mono)
**Then** the value is validated (> 0)
**And** "Next" saves income via `POST /api/onboarding/income`

**Given** Step 2 (Thresholds)
**When** the user sets per-category thresholds
**Then** each category shows: name, toggle for ₹ amount or % of average, threshold value
**And** global monthly cap field is available (optional)
**And** "Next" saves via `POST /api/onboarding/alerts` (FR37)

**Given** Step 3 (Investments)
**When** the user optionally enters investment balances
**Then** investment types display: PPF, Mutual Funds, Stocks with ₹ amount inputs
**And** "Skip" allows bypassing (FR52)
**And** if values entered, saved via `POST /api/onboarding/investments` (FR9a, FR53)

**Given** Step 4 (First Transaction)
**When** the step renders
**Then** TransactionDialog is embedded inline with encouragement messaging
**And** after saving, confetti/celebration and "Go to Dashboard" button
**And** `POST /api/onboarding/complete` is called

**Given** step navigation
**When** "Back" is clicked
**Then** user returns to previous step with data preserved
**And** `data-testid`: `onboarding-stepper`, `onboarding-step-1`, `onboarding-next-button`, `onboarding-skip-button`

> **Dependency note:** Step 4 embeds the TransactionDialog component from Story 3.3. This story requires Story 3.3 (TransactionDialog — Core) to be complete and available as a reusable component.

---

## Epic 5: Weekly Publishing Ritual

Users can review drafts and publish their week in a single celebratory action. Published transactions are locked with 1-month grace for edits.

### Story 5.1: Publish Backend API & Rollup Tables

As a **developer**,
I want an atomic publish endpoint that finalizes drafts and creates rollup data,
So that the weekly ritual is fast, reliable, and drives all downstream reads.

**Acceptance Criteria:**

**Given** Flyway migration `V4__publishing.sql`
**When** it runs
**Then** `weekly_rollups` table is created: id, user_id (FK), week_start (LocalDate), week_end (LocalDate), total_income_paise, total_expense_paise, total_invested_paise, savings_rate_percent (int), published_at (timestamp), created_at, updated_at
**And** `category_rollups` table is created: id, weekly_rollup_id (FK), category, total_paise, transaction_count

**Given** `POST /api/transactions/publish-week`
**When** called with current week's date range
**Then** all DRAFT transactions for that week are updated to PUBLISHED in a single DB transaction (FR17, FR18)
**And** if any update fails, entire operation rolls back (atomicity)
**And** `weekly_rollups` row is created with computed totals
**And** `category_rollups` rows are created per category
**And** response returns: savings rate %, totals, transaction count
**And** completes within 500ms (NFR4)

**Given** no drafts exist
**When** publish is called
**Then** returns `400: No draft transactions to publish`

**Given** FR20
**When** publish completes
**Then** subsequent `GET /api/transactions?status=DRAFT` returns empty for that week

**Given** a published transaction edit within 1-month grace (FR15)
**When** `PUT /api/transactions/{id}` updates a published transaction
**Then** associated `weekly_rollups` and `category_rollups` are recalculated (AR16)

**Given** a backdated transaction (date in a past-published week, UX-DR22)
**When** `POST /api/transactions` is called with a date in an already-published week
**Then** the transaction is auto-published (status = PUBLISHED, not DRAFT)
**And** the associated `weekly_rollups` and `category_rollups` are recalculated
**And** the response includes `autoPublished: true` for frontend to display info text

### Story 5.2: PublishPreviewDialog Component

As a **user**,
I want to review my week's transactions before publishing,
So that I can catch mistakes and feel confident about my weekly snapshot.

**Acceptance Criteria:**

**Given** user clicks "Publish Week" or presses `P`
**When** draft transactions exist for the current week
**Then** PublishPreviewDialog opens (slide-up, 300ms)
**And** shows: week date range (Mon–Sun), transaction count, scrollable list (max 6 visible)

**Given** the preview
**When** totals are computed
**Then** client-side computation: Total Income, Total Expenses, Total Invested, Savings Rate %
**And** savings rate = (Income - Expenses) / Income × 100 (investments excluded)

**Given** "Confirm Publish" button (with `Send` icon prefix, UX-DR23)
**When** clicked
**Then** `POST /api/transactions/publish-week` is called, button shows spinner

**Given** no drafts exist
**When** publish triggered
**Then** toast: "No transactions to publish this week" (amber)

**And** `data-testid`: `publish-preview-dialog`, `publish-confirm-button`, `publish-cancel-button`

### Story 5.3: CelebrationOverlay Component

As a **user**,
I want a celebratory moment after publishing my week,
So that I feel rewarded for maintaining my financial ritual.

**Acceptance Criteria:**

**Given** a successful publish
**When** API returns successfully
**Then** CelebrationOverlay appears (z-70, fade-in 400ms, radial gradient bg)
**And** displays: Savings rate % (AnimatedNumber count-up), total spent, total income, "Week Published!"

**Given** first-ever publish (variant: "first")
**When** displayed
**Then** extra messaging: "🎉 Your first week published!" with larger confetti

**Given** milestone publish (variant: "milestone")
**When** displayed
**Then** badge emoji bounces into view with milestone badge name

**Given** normal publish (variant: "normal")
**When** displayed
**Then** standard celebration with savings rate + streak count

**Given** the overlay
**When** "Done" clicked or Esc pressed
**Then** overlay fades out (300ms), returns to dashboard
**And** `prefers-reduced-motion` disables confetti and count-up

**And** `data-testid`: `celebration-overlay`, `celebration-savings-rate`, `celebration-done-button`

### Story 5.4: Published Transaction Grace Period Editing

As a **user**,
I want to edit or delete published transactions within 1 month,
So that I can correct genuine errors without losing historical accuracy.

**Acceptance Criteria:**

**Given** a published transaction within 1 month of entry date
**When** viewed in transaction list
**Then** edit and delete buttons are visible

**Given** user edits a published transaction
**When** amount, category, or name is changed
**Then** `PUT /api/transactions/{id}` updates the transaction
**And** weekly and category rollups recalculate (AR16)
**And** toast: "Transaction updated ✓ — Weekly totals recalculated"

**Given** user deletes a published transaction within grace
**When** confirmed
**Then** soft-deleted, rollups recalculate, undo toast (5s window)

**Given** a published transaction older than 1 month
**When** viewed
**Then** no edit/delete buttons, lock icon with tooltip: "Cannot edit transactions older than 1 month" (FR19)

---

## Epic 6: Dashboard & Analytics

Users see their financial health at a glance — lifetime totals, savings rate, category breakdown, monthly trends, and investment values.

### Story 6.1: Dashboard API & Rollup Reads

As a **developer**,
I want dashboard API endpoints that read from rollup tables,
So that the dashboard loads within 1 second.

**Acceptance Criteria:**

**Given** `GET /api/dashboard/summary`
**When** called
**Then** returns lifetime totals via `SUM(total_income_paise) FROM weekly_rollups` (no transaction table decryption on dashboard reads)
**And** returns current month totals via `WHERE week_start >= first-of-month`
**And** returns current streak placeholder (0 until Epic 7)
**And** response <500ms (rollup tables are the read model — all dashboard queries hit rollups, never encrypted transaction data)

**Given** `GET /api/dashboard/month/{yyyy-MM}`
**When** called
**Then** returns category-level breakdown + month totals

**Given** `GET /api/analytics/savings-rate?period=weekly`
**When** called
**Then** returns array of weekly savings rate % from rollups (FR25, FR26)

**Given** `GET /api/analytics/trends?months=6`
**When** called
**Then** returns monthly totals for trend visualization (FR27, FR29)

**Given** `GET /api/analytics/category-breakdown?month={yyyy-MM}`
**When** called
**Then** returns category-level spending (FR28)

**Given** `GET /api/analytics/comparison`
**When** called
**Then** returns current vs previous month category changes (FR29a)

**Given** `GET /api/investments/summary`
**When** called
**Then** returns per-type current value = baseline + additions - withdrawals (FR9b, FR9c)

**Given** `PUT /api/investments/baseline/{type}`
**When** called
**Then** investment baseline updated (FR9d)

### Story 6.2: Dashboard Page — Summary Cards

As a **user**,
I want to see my financial summary on the dashboard,
So that I know my financial health at a glance.

**Acceptance Criteria:**

**Given** an authenticated user on `/dashboard`
**When** page loads
**Then** renders within 1 second (NFR1) with 6 summary cards:
1. This Week — draft count + total draft amount
2. Savings Rate — current % (AnimatedNumber count-up, UX-DR6)
3. Streak — "0 days" placeholder (until Epic 7)
4. Monthly Spend — total expenses this month
5. Monthly Income — total income this month
6. Investments — total current value

**Given** no published data
**When** dashboard loads
**Then** empty state variants render with instructional subtext (UX-DR15)

**Given** dashboard cards clicked
**When** navigating (UX-DR24)
**Then** Savings Rate → `/analytics`, This Week → `/transactions?status=DRAFT`, Monthly Spend → `/analytics?view=categories`

**And** `data-testid`: `dashboard-this-week`, `dashboard-savings-rate`, `dashboard-streak`, `dashboard-monthly-spend`, `dashboard-monthly-income`, `dashboard-investments`

### Story 6.3: Category Breakdown Visualization

As a **user**,
I want to see where my money is going by category,
So that I can identify spending patterns.

**Acceptance Criteria:**

**Given** published data exists for current month
**When** dashboard renders
**Then** donut chart shows spending by category (Recharts), colored per `lib/categories.ts`
**And** renders within 1 second (NFR2)

**Given** a donut segment hovered
**Then** tooltip: category name, ₹ amount, % of total

**Given** a donut segment clicked
**Then** navigates to `/transactions?category={name}`

**Given** no published data
**Then** empty circle with "No data yet"

### Story 6.4: Analytics Page — Trends & Comparisons

As a **user**,
I want to view monthly trends and spending comparisons,
So that I can track my progress over time.

**Acceptance Criteria:**

**Given** an authenticated user on `/analytics`
**When** page loads
**Then** shows: savings rate trend (line chart), monthly spending (bar chart), category donut, month-over-month comparison table

**Given** savings rate trend
**When** rendered
**Then** X-axis: weeks/months, Y-axis: 0–100%, data points clickable (NFR7)

**Given** monthly spending trend
**When** rendered
**Then** bar chart: last 6 months, each bar clickable → month breakdown

**Given** month-over-month comparison (FR29a)
**When** rendered
**Then** table: category, last month ₹, this month ₹, change % (green↓, red↑), sorted by largest change

**Given** <2 months data
**Then** message: "Keep logging! Trends appear after 2 published weeks."

### Story 6.5: Quick-Add FAB on Dashboard

As a **user**,
I want the FAB on the dashboard,
So that I can log transactions without leaving my financial overview.

**Acceptance Criteria:**

**Given** dashboard page
**When** FAB clicked or `N` pressed
**Then** TransactionDialog opens within 200ms (NFR5, categories pre-loaded)

**Given** transaction saved from dashboard
**When** dialog closes
**Then** dashboard cards refresh with updated totals
**And** toast: "Transaction saved ✓"

---

## Epic 7: Gamification & Streaks

Users track their logging streaks, earn badges, and feel rewarded for consistent engagement. Publish flow gains gamification hooks.

### Story 7.1: Streak Tracking Backend

As a **developer**,
I want streak tracking logic that counts consecutive logging days,
So that the gamification system accurately rewards consistency.

**Acceptance Criteria:**

**Given** Flyway migration `V5__gamification.sql`
**When** it runs
**Then** `streaks` table is created: id, user_id (FK), current_streak (int), best_streak (int), last_log_date (LocalDate), shield_available (boolean, default false), shield_used_date (LocalDate nullable), created_at, updated_at
**And** `badges` table is created: id, user_id (FK), badge_type (text), badge_name (text), earned_at (timestamp)

**Given** a user creates a transaction (draft) on a new day
**When** `last_log_date` was yesterday (IST)
**Then** `current_streak` increments by 1 (FR30)
**And** `last_log_date` updates to today

**Given** a user creates a transaction
**When** `last_log_date` was today
**Then** no streak change (already counted today)

**Given** a user creates a transaction
**When** `last_log_date` was more than 1 day ago (gap)
**Then** if `shield_available` is true and gap is exactly 1 day: shield is consumed, streak preserved, `shield_used_date` set
**And** if no shield or gap > 1: streak resets to 1

**Given** a weekly publish on Sunday
**When** publish completes
**Then** streak continues (publishing doesn't reset streak, FR32)
**And** if 4 consecutive weeks published: `shield_available` set to true (earned, not used)

**Given** IST timezone
**When** any date comparison occurs
**Then** "today" and "yesterday" are computed in IST (AR9)

**Given** streak logic implementation
**When** unit tests are written
**Then** tests cover: consecutive days (streak increments), 1-day gap with shield (shield consumed, streak preserved), 1-day gap without shield (streak resets), 2+ day gap (streak resets regardless of shield), publish on Sunday (streak continues), multiple transactions same day (no double-count), timezone edge case at midnight IST

### Story 7.2: Badge System Backend

As a **developer**,
I want a badge awarding system for milestones,
So that users earn achievements for consistent engagement.

**Acceptance Criteria:**

**Given** the badge definitions
**When** the system checks badges
**Then** the following badges are defined:
- "First Log" — first transaction created
- "First Week" — first publish completed
- "Weekly Champion" — 3 consecutive weeks published
- "7-Day Streak" — 7 consecutive logging days
- "30-Day Streak" — 30 consecutive logging days
- "100-Day Streak" — 100 consecutive logging days
- "Budget Guardian" — completed onboarding with all thresholds set
- "Investor" — first investment transaction logged

**Given** a badge milestone is reached
**When** the trigger event occurs (transaction create, publish, streak update)
**Then** badge is created in `badges` table with `earned_at` timestamp (FR33)
**And** badge is returned in the publish response or transaction response for frontend to display

**Given** `GET /api/gamification/badges`
**When** called
**Then** returns all earned badges + all available badges with unlock conditions (FR34, FR35)

**Given** `GET /api/gamification/streak`
**When** called
**Then** returns: current_streak, best_streak, shield_available, shield_used_date

### Story 7.3: StreakCounter Component

As a **user**,
I want to see my current streak with visual flair on the dashboard,
So that I feel motivated to keep logging daily.

**Acceptance Criteria:**

**Given** an active streak (current_streak > 0)
**When** StreakCounter renders
**Then** it shows: 🔥 fire emoji (animated flicker), current streak number, "day streak" label, best streak below

**Given** shield is available (4+ consecutive weeks)
**When** StreakCounter renders
**Then** 🛡️ shield icon appears next to streak, subtle glow indicator

**Given** shield was used (gap survived)
**When** StreakCounter renders
**Then** 🛡️ appears dimmed with "Shield used" text, no glow

**Given** streak is broken (current_streak = 0 or 1 after gap)
**When** StreakCounter renders
**Then** muted state, "Start a new streak!" encouragement text

**Given** `prefers-reduced-motion`
**When** active
**Then** fire animation is disabled, static emoji shown

**And** `data-testid`: `streak-counter`, `streak-count`, `streak-shield`, `streak-best`

### Story 7.4: Badge Collection & Dashboard Integration

As a **user**,
I want to see my badges and have streaks/badges prominent on the dashboard,
So that my achievements feel visible and rewarding.

**Acceptance Criteria:**

**Given** the dashboard
**When** Epic 7 is deployed
**Then** the Streak card (from Story 6.2) updates to show real streak data from `GET /api/gamification/streak`
**And** StreakCounter component replaces the "0 days" placeholder

**Given** the dashboard
**When** badges exist
**Then** a badge row displays below summary cards showing: earned badges as emoji icons with names (FR34, FR36)
**And** clicking a badge shows tooltip with unlock condition (FR35)

**Given** a new badge earned during publish
**When** CelebrationOverlay renders
**Then** the new badge bounces into view with its emoji and name

**Given** `GET /api/gamification/badges`
**When** called from dashboard
**Then** earned badges show as full-color, unearned show as muted with lock icon + condition text

### Story 7.5: Publish Flow Gamification Hooks

As a **user**,
I want the publish flow to update my streak and check for badges,
So that publishing my week feels even more rewarding.

**Acceptance Criteria:**

**Given** a successful publish
**When** `POST /api/transactions/publish-week` completes
**Then** the publish service calls `StreakService.onPublish(userId)` to record publish date
**And** calls `BadgeService.checkBadges(userId, "PUBLISH")` to award any new badges
**And** the publish response includes: `streak` object (current, best, shield) and `newBadges` array

**Given** the CelebrationOverlay (from Story 5.3)
**When** rendering after publish
**Then** it now displays: real streak count, any newly earned badges
**And** milestone variant triggers when badge is earned during this publish

**Given** a transaction is created
**When** saved via `POST /api/transactions`
**Then** the response triggers `StreakService.onLog(userId)` to update streak
**And** triggers `BadgeService.checkBadges(userId, "LOG")`

---

## Epic 8: Alerts & Budget Thresholds

Users set spending guardrails and get notified when approaching or exceeding limits.

### Story 8.1: Alert Monitoring Backend

As a **developer**,
I want the alert engine to monitor spending against thresholds,
So that users are notified when limits are exceeded.

**Acceptance Criteria:**

**Given** Flyway migration `V6__alert_history.sql`
**When** it runs
**Then** `alert_history` table is created: id, user_id (FK), alert_id (FK), category (text), message (text), threshold_value, actual_value, status (CREATED/DISPLAYED/DISMISSED), created_at

**Given** a transaction is created or updated
**When** the save completes
**Then** `AlertService.checkThresholds(userId)` runs
**And** compares current month category totals (from rollups) against alert thresholds

**Given** a FIXED threshold (₹X) for a category
**When** the category total exceeds ₹X
**Then** an `alert_history` entry is created with status CREATED (FR42, FR43)

**Given** a PERCENTAGE threshold (Y%) for a category
**When** the category total exceeds Y% of the user's average spending in that category (last 3 months)
**Then** an `alert_history` entry is created (FR42, FR43)

**Given** a PERCENTAGE threshold with <3 months of data
**When** the system calculates average
**Then** it uses the available months (1-2 months) as the average baseline
**And** if no prior data exists, the percentage alert is skipped until at least 1 month of published data exists

**Given** a global monthly cap
**When** total monthly expenses exceed the cap
**Then** an `alert_history` entry is created for the global alert (FR44)

**Given** `GET /api/alerts/check`
**When** called (polled on page load + after transaction save, AR4)
**Then** returns all CREATED alerts (not yet displayed) for the user

**Given** `PUT /api/alerts/history/{id}/dismiss`
**When** called
**Then** alert status changes to DISMISSED (FR45)

### Story 8.2: Alert Configuration Page

As a **user**,
I want to view and modify my alert thresholds,
So that I can adjust my spending guardrails as needed.

**Acceptance Criteria:**

**Given** an authenticated user on `/alerts`
**When** page loads
**Then** it shows all configured thresholds: per-category (name, type FIXED/%, value) and global cap (FR40)

**Given** a threshold row
**When** the user clicks edit
**Then** inline editing activates: toggle between ₹ fixed / % of average, value input
**And** "Save" persists via `PUT /api/alerts/config/{id}` (FR41)

**Given** a new threshold
**When** the user clicks "Add Threshold"
**Then** category selector appears (from predefined + custom categories)
**And** type toggle (₹ or %) and value input
**And** saved via `POST /api/alerts/config` (FR38, FR39)

**Given** a threshold
**When** the user clicks delete
**Then** threshold is removed with confirmation dialog

**Given** recent alert history
**When** displayed on the alerts page
**Then** past alerts show: category, threshold value, actual value, date, status (active/dismissed)
**And** active alerts have a "Dismiss" button

**And** `data-testid`: `alerts-config-list`, `alert-threshold-edit`, `alert-add-button`

### Story 8.3: Alert Toast Notifications

As a **user**,
I want to see toast notifications when my spending crosses a threshold,
So that I'm immediately aware of budget breaches.

**Acceptance Criteria:**

**Given** the user saves a transaction
**When** `GET /api/alerts/check` is polled after save
**Then** any new CREATED alerts trigger amber toast: "🔔 {Category} crossed ₹{threshold}" (FR43)
**And** toast auto-dismisses in 3 seconds or on click

**Given** a global cap breach
**When** detected
**Then** amber toast: "🔔 Monthly spending crossed ₹{cap}" (FR44)

**Given** dashboard or any page load
**When** `GET /api/alerts/check` returns new alerts
**Then** toasts display for each unviewed alert
**And** alerts are marked DISPLAYED after toast shown

**Given** the user clicks a toast
**When** it's an alert toast
**Then** navigates to `/alerts` page with that alert highlighted

---

## Epic 9: Friend Management

Users can add and manage friends in preparation for Phase 2 leaderboard features.

### Story 9.1: Friend Backend API

As a **developer**,
I want friend management API endpoints,
So that users can add, view, and remove friends.

**Acceptance Criteria:**

**Given** Flyway migration `V7__friends.sql`
**When** it runs
**Then** `friends` table is created: id, user_id (FK), friend_user_id (FK), status (PENDING/ACCEPTED), created_at
**And** unique constraint on (user_id, friend_user_id) prevents duplicates

**Given** `POST /api/friends/{email}`
**When** called with a valid email of an existing user
**Then** a friend relationship is created with status ACCEPTED (FR46)
**And** if email doesn't exist: returns `404: User not found`
**And** if already friends: returns `409: Already connected`

**Given** `GET /api/friends`
**When** called
**Then** returns list of friends with: id, name, email (FR47, FR49)
**And** only returns relationships for the authenticated user

**Given** `DELETE /api/friends/{friendId}`
**When** called
**Then** the friend relationship is removed (FR48)
**And** the relationship is removed from both sides

> **Data model note:** The `friends` table stores a single row per relationship (A→B). Queries check both `WHERE user_id = ? OR friend_user_id = ?`. On delete, the single row is removed, which removes the relationship from both users' perspectives. No reverse row (B→A) is created.

### Story 9.2: Friends Page UI

As a **user**,
I want to see my friends list and add or remove friends,
So that I can manage who I'll compare savings with in the future.

**Acceptance Criteria:**

**Given** an authenticated user on `/friends`
**When** page loads
**Then** friends list displays: friend name, email, "Remove" button per row (FR47, FR49)

**Given** the "Add Friend" button
**When** clicked
**Then** an input appears for entering a friend's email
**And** "Add" submits via `POST /api/friends/{email}` (FR46)
**And** success: toast "Friend added ✓", list refreshes
**And** error (not found): toast "No account with that email" (red)
**And** error (already friends): toast "Already connected" (amber)

**Given** the "Remove" button on a friend row
**When** clicked
**Then** confirmation dialog: "Remove {name} from friends?"
**And** confirmed: `DELETE /api/friends/{id}`, toast "Friend removed", list refreshes (FR48)

**Given** no friends
**When** list is empty
**Then** empty state: "No friends yet" + "Add your first friend to compare savings rates later" + Add button CTA

**Given** Phase 2 note
**When** viewing friends page
**Then** a subtle info banner: "Savings rate comparison coming soon! Add friends now to be ready." (FR50)

**And** `data-testid`: `friends-list`, `friend-add-button`, `friend-add-input`, `friend-remove-button`
