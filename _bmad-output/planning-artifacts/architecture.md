---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-starter", "step-04-decisions", "step-05-patterns", "step-06-structure", "step-07-validation", "step-08-complete"]
inputDocuments: ["prd.md", "product-brief-BudgetX.md"]
workflowType: 'architecture'
project_name: 'BudgetX'
user_name: 'Itachi'
date: '2026-04-06'
lastStep: 8
status: 'complete'
completedAt: '2026-04-06'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (61 Total):**

BudgetX implements a fintech MVP organized across 9 capability areas:

- **Authentication & Account (FR1-FR6):** Email/password auth, JWT sessions (30-day expiry), password management. Stateless authentication model.
- **Transaction Logging (FR7-FR16):** Draft/publish state machine for expenses, income, and investments. Investment baseline tracking (FR9a-9d) with initial balances + additions/withdrawals — this is more than a simple type flag; it's a mini state machine within the transaction model (initial balance entry, additions, withdrawals, current value computation). Predefined + custom categories. 1-month grace period for published transaction edits.
- **Weekly Publishing (FR17-FR20):** Atomic finalization of all drafts in single action. Irreversible state transition (within grace period). Draft list resets post-publish.
- **Dashboard & Summary (FR21-FR24):** Lifetime aggregations (total income, expenses, invested). Current month category breakdowns. Quick-add FAB (<200ms open target requires pre-loaded category list — no API call on open).
- **Analytics & Insights (FR25-FR29a):** Savings rate = (Income - Expenses) / Income (investments excluded). Monthly trends, category breakdowns, month-over-month comparisons.
- **Gamification (FR30-FR36):** Daily logging streaks (1 day = any transaction on consecutive day). Streak resets Sunday after publish. Achievement badges for milestones. Dashboard-prominent display.
- **Alerts & Thresholds (FR37-FR45):** Per-category thresholds (₹X OR Y% of average, not both). Global monthly cap. Real-time monitoring + toast notifications + dismissible alerts.
- **Friend Management (FR46-FR50):** Add/remove friends by email. Stores relationships for Phase 2 leaderboard features. No savings rate sharing in MVP1.
- **Onboarding (FR51-FR53):** Guided registration → investment baseline entry (optional) → alert threshold setup.

**Non-Functional Requirements (Critical):**

- **Performance:** Dashboard <1s load (4G). Publish <500ms (atomic). FAB opens <200ms. Savings rate calc <500ms.
- **Security:** OWASP Top 10 2025 compliance. Bcrypt 12+ rounds. AES-256 encryption on amounts + names. HTTPS/TLS 1.2+. Rate limiting (5 attempts / 15 min). CORS, CSP, X-Frame-Options. Quarterly vulnerability scans, 30-day patch SLA.
- **Reliability:** 99.9% uptime (~43 min/month). Daily automated backups, 7-day PITR. Health checks every 30s with auto-restart. Graceful shutdown.
- **Browser Support:** Chrome priority (latest 2 versions). Responsive 768px+ (tablet minimum). Desktop-first for MVP1.

### Technical Stack (From PRD)

- **Frontend:** React (functional components + hooks), Tailwind CSS, shadcn/ui, Axios
- **Backend:** Spring Boot REST API (16+ endpoints), JWT authentication, Spring Security
- **Database:** PostgreSQL (ACID compliance, cloud-managed)
- **Infrastructure:** Docker containers, cloud deployment (AWS/GCP/Azure), GitHub Actions CI/CD
- **Security:** Server-side AES-256 encryption, cloud secrets management, bcrypt hashing

### Scale & Complexity Assessment

- **Project Type:** Full-stack web application, Fintech domain, Greenfield
- **Complexity Level:** Medium — financial data security is critical; domain is established; differentiation is UX + behavioral psychology
- **User Base:** 2-3 trusted friends + creator (Itachi) during MVP1; no paid acquisition
- **Estimated Architectural Components:** ~10 major systems
  1. Authentication & Authorization (JWT, rate limiting, session management)
  2. Transaction Logging (draft/publish state machine, investment sub-model, ACID compliance)
  3. Publishing Engine (atomic finalization, streak/badge trigger orchestration)
  4. Dashboard Data Service (aggregations, savings rate, category totals — depends on aggregation strategy decision)
  5. Analytics Service (trends, monthly breakdowns, comparisons)
  6. Gamification Service (streak tracking with IST timezone, badge logic)
  7. Alerts Service (per-category thresholds, global caps, toast notification delivery)
  8. Friends Management (add/remove, relationship storage — extensible for Phase 2 leaderboard)
  9. Onboarding Flow (guided setup, investment baseline)
  10. Security & Encryption Layer (AES-256, key management, input validation)

### Technical Constraints & Dependencies

**Atomicity Requirement:**
Publishing must atomically finalize all draft transactions in a single database transaction. If any transaction fails, entire publish rolls back. No partial publishes allowed.

**Aggregation Strategy (Architectural Fork):**
Transaction amounts and names are encrypted server-side (AES-256). Every read requires decryption, every write requires encryption. Dashboard aggregations cannot operate on encrypted data directly — must decrypt before summing. Two paths: (a) decrypt-per-read on every dashboard load (simple, slow at scale), or (b) maintain pre-computed unencrypted rollup tables (savings rate, category totals, lifetime sums) that update on publish/edit. This is a core architectural decision to resolve in Step 4.

**Performance Under Encryption:**
The <500ms publish and <1s dashboard SLAs are tight under encryption overhead. **Publish speed is the #1 protected metric** — it's the ritual moment and the retention driver. If we must choose between encryption elegance and publish speed, publish speed wins.

**Retroactive Recalculation on Published Edits:**
When a published transaction is edited within its 1-month grace period, every downstream aggregate (savings rate, category totals, streak implications if applicable) must be recalculated. This is a cascade concern that affects dashboard data service, analytics service, and potentially gamification service.

**Streak Logic & Timezone:**
Streak resets on Sunday after publish, not on transaction date. Requires separate tracking of "publish date" vs "transaction date." For MVP1, all timezone logic hardcoded to **IST (Indian Standard Time)** — all users are in India. Streak counter is cumulative daily logging, not weekly publishes. Edge cases: missed publishes, late publishes.

**Investment Model Complexity:**
PRD describes investments as a "transaction type flag" but FR9a-9d define a richer model: initial balances (entered during onboarding or later), additions, withdrawals, and current value = baseline + additions - withdrawals. This is a mini state machine within the transaction domain — not just a type enum. Architecture must model this explicitly to avoid conflating investment tracking with simple expense/income logging.

**MVP1 Scope Boundary:**
Friend leaderboard/comparison explicitly deferred to Phase 2. Friend management (add/remove/list) is in MVP1 but comparison features are not. Architecture should support the Phase 2 extension without rework but should NOT build leaderboard infrastructure in MVP1.

**FAB Category Pre-loading:**
Quick-add FAB must open in <200ms. This requires category list to be pre-loaded on the frontend (cached on login or dashboard load). If categories require an API call on FAB open, the 200ms target fails on slow connections.

### Cross-Cutting Concerns Identified

1. **Data Encryption:** Amounts + transaction names encrypted across all services. Encryption/decryption on every read/write adds latency. Must resolve aggregation strategy (decrypt-per-read vs. rollup tables) as core architectural decision.

2. **Atomic Publishing Orchestration:** Publish action triggers: state transitions, streak updates, badge checks, potentially rollup table updates. Single largest technical risk — must guarantee atomicity or risk data corruption.

3. **Performance SLAs (<500ms publish, <1s dashboard):** Tight constraints under encryption overhead + aggregation queries. Requires strategic indexing, potential materialized views or computed columns, and cache invalidation strategy. Publish speed is the #1 protected metric.

4. **Toast Notification Infrastructure:** FR43-44 require real-time notifications when alert thresholds are exceeded. After every transaction creation, backend checks thresholds. If exceeded, notification must reach the frontend. Requires architectural decision: WebSocket, server-sent events, or polling? Notification state management needed (created → displayed → dismissed).

5. **Retroactive Recalculation:** Published transaction edits (within 1-month grace) cascade to all downstream aggregates — savings rate, category totals, analytics. Must define recalculation strategy and which services are affected.

6. **Security Posture:** OWASP Top 10 compliance spans every layer — input validation, auth, encryption, headers, error handling. Not a component but a cross-cutting concern baked into every service.

7. **State Machine Consistency:** Transactions have states (Draft → Published). Investments have a sub-model (baseline + additions/withdrawals). Streaks and badges depend on published state. Grace period edits add complexity to "finalized" semantics.

8. **Audit Trail:** Financial data integrity requires timestamp tracking on all changes. Required for grace period enforcement, streak date tracking, and data integrity verification.

---

## Starter Template Selection

### Primary Technology Domain

Full-stack web application with fintech security requirements. **Next.js (React) + Spring Boot** stack selected based on PRD specification and user preferences.

### Selected Starters: Next.js 16.2.2 + Spring Boot 4.0.5

#### Frontend: Next.js 16.2.2

**Initialization Command:**
```bash
npx create-next-app@latest budgetx-frontend --yes --use-npm
```

Uses `--yes` flag for recommended defaults: TypeScript, Tailwind CSS, ESLint, App Router, Turbopack.

**Rationale for Selection:**

Next.js 16 is the production standard for React applications in 2026. Key advantages for BudgetX:

1. **App Router + React Server Components:** Server-side rendering reduces JavaScript sent to the browser. Dashboard <1s load target is achievable with RSC pre-rendering aggregation data server-side.
2. **Turbopack (Rust-based bundler):** Built-in, fastest bundler available. Near-instant hot module reloading during development.
3. **File-based routing:** Route organization maps naturally to BudgetX's page structure (dashboard, transactions, analytics, alerts, friends, settings).
4. **Built-in API routes:** `route.ts` files can serve as a lightweight BFF (Backend-For-Frontend) proxy layer to Spring Boot, enabling auth token management and request aggregation on the server side.

**Post-Setup Integration:**
```bash
# shadcn/ui component library (polished, accessible UI components)
npx shadcn@latest init

# State management (lightweight, hooks-first — ideal for MVP1 scale)
npm install zustand

# HTTP client for Spring Boot API calls
npm install axios

# Date utilities for transaction timestamps
npm install date-fns

# Chart library for analytics visualization
npm install recharts
```

**Architectural Decisions Made by Starter:**

- **Language & Runtime:** TypeScript (strict mode), Node.js runtime
- **Styling:** Tailwind CSS (utility-first, pre-configured)
- **Build Tooling:** Turbopack (incremental Rust bundler), automatic code splitting, minification
- **Code Organization:**
  - `/app` — pages, routes, layouts (App Router)
  - `/components` — reusable React components (+ `/components/ui` for shadcn)
  - `/lib` — utilities, API client, helpers
  - `/hooks` — shared custom React hooks
  - `/public` — static assets
- **Development Experience:** File-based routing, instant HMR, TypeScript first-class support
- **Environment Configuration:** `.env.local`, `.env.production` for secrets

**State Management Decision: Zustand**

Zustand selected over Redux Toolkit for MVP1:
- ~1.2KB bundle (vs ~10KB RTK) — performance matters for <1s dashboard loads
- Near-zero boilerplate — faster implementation
- BudgetX is a small-scale app (2-3 users) — RTK's enterprise patterns are overkill
- Pairs well with server-side data fetching via Next.js RSC — Zustand handles only client-side UI state (modals, toast notifications, FAB state)
- Easy to scale or migrate if complexity grows post-MVP1

#### Backend: Spring Boot 4.0.5

**Initialization via Spring Initializr:** [https://start.spring.io](https://start.spring.io)

**Configuration:**
- **Project:** Gradle (Kotlin DSL)
- **Language:** Java
- **Spring Boot:** 4.0.5 (latest stable, built on Spring Framework 7)
- **Java Version:** 25 (latest LTS, released September 2025)
- **Packaging:** JAR

**Dependencies:**

| Dependency | Purpose |
|-----------|--------|
| Spring Web | REST API framework (Spring MVC) |
| Spring Security | JWT authentication, rate limiting, security filters |
| Spring Data JPA | Database queries with PostgreSQL |
| PostgreSQL Driver | JDBC connection |
| Spring Validation | Input validation, constraint annotations |
| Spring Boot DevTools | Hot reload during development |
| Lombok | Boilerplate reduction (getters/setters/builders) |
| JJWT (io.jsonwebtoken) 0.12.6 | JWT token generation, parsing, validation |

**Architectural Structure:**

```
com.budgetx
├── config/                    # Cross-cutting configuration
│   ├── SecurityConfig.java    # Spring Security + JWT filter chain
│   ├── CorsConfig.java        # Frontend origin allowlisting
│   ├── EncryptionConfig.java  # AES-256 key management
│   └── DatabaseConfig.java   # PostgreSQL connection pooling
├── auth/                      # Authentication domain
│   ├── AuthController.java
│   ├── AuthService.java
│   ├── JwtTokenProvider.java
│   └── JwtAuthFilter.java
├── transaction/               # Transaction logging domain
│   ├── TransactionController.java
│   ├── TransactionService.java
│   ├── TransactionRepository.java
│   └── TransactionEntity.java
├── publishing/                # Weekly publish domain
│   ├── PublishController.java
│   └── PublishService.java    # Atomic publish + streak/badge orchestration
├── dashboard/                 # Dashboard aggregations
│   ├── DashboardController.java
│   └── DashboardService.java
├── analytics/                 # Analytics & trends
│   ├── AnalyticsController.java
│   └── AnalyticsService.java
├── gamification/              # Streaks & badges
│   ├── StreakService.java
│   ├── BadgeService.java
│   └── GamificationController.java
├── alert/                     # Alerts & thresholds
│   ├── AlertController.java
│   ├── AlertService.java
│   └── AlertNotificationService.java
├── friend/                    # Friend management
│   ├── FriendController.java
│   └── FriendService.java
├── onboarding/                # Onboarding flow
│   ├── OnboardingController.java
│   └── OnboardingService.java
└── shared/                    # Shared domain objects
    ├── entity/                # JPA entities
    ├── dto/                   # Data transfer objects
    ├── exception/             # Global exception handling
    └── encryption/            # Encryption/decryption utilities
```

**Database Schema Foundation (PostgreSQL):**

Spring Data JPA generates tables from entities. Core tables:
- `users` — authentication, profile, preferences
- `transactions` — state: DRAFT/PUBLISHED; type: EXPENSE/INCOME/INVESTMENT; encrypted amounts + names
- `investment_baselines` — initial investment balances (per type)
- `categories` — predefined + user-custom categories
- `alerts` — per-category thresholds (₹X or Y% of average)
- `streaks` — daily logging counter, publish dates, reset tracking
- `badges` — earned achievements with timestamps
- `friends` — user relationships (extensible for Phase 2 leaderboard)
- `alert_history` — notification log with read/dismissed state

### Frontend/Backend Integration

**Architecture:** REST API over HTTPS. Next.js App Router acts as BFF (Backend-For-Frontend) — server components call Spring Boot directly, client components use Axios through API routes.

**API Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### Deployment & Infrastructure (AWS)

- **Frontend:** Vercel (native Next.js support, preview deployments, edge caching) OR AWS ECS
- **Backend:** AWS ECS (Fargate) — managed containers, no server management
- **Database:** AWS RDS PostgreSQL (managed, automated backups, PITR)
- **Secrets:** AWS Secrets Manager (encryption keys, JWT secrets, database credentials)
- **CI/CD:** GitHub Actions → build → test → deploy
- **Monitoring:** AWS CloudWatch (logs, metrics), Sentry (error tracking)

---

## Core Architectural Decisions

### Decision Summary

| # | Decision | Choice | Priority |
|---|----------|--------|----------|
| 1 | Aggregation Strategy | Rollup tables (pre-computed, unencrypted) | Critical |
| 2 | Notification Delivery | Polling (check on page load + post-transaction) | Critical |
| 3 | Database Migration Tool | Flyway (SQL-based) | Important |
| 4 | Testing Stack | Jest+RTL+Playwright (FE) / JUnit5+Mockito+TestContainers (BE) | Important |
| 5 | API Documentation | SpringDoc OpenAPI (auto-generated Swagger UI) | Important |
| 6 | Build Tool (Backend) | Gradle (Kotlin DSL) | Important |

### Data Architecture

**Aggregation Strategy: Rollup Tables**

Encrypted transaction data (AES-256 on amounts + names) makes real-time aggregation expensive. BudgetX uses **pre-computed rollup tables** that store unencrypted aggregate values.

**Rollup Tables:**
- `monthly_summaries` — total income, total expenses, total invested, savings rate per user per month
- `category_totals` — spending total per category per user per month
- `lifetime_summaries` — **derived as SUM across all `monthly_summaries` rows** (not independently maintained). This eliminates stale-data bugs — lifetime is always consistent with monthly data.

**Update Triggers:**
- **On Publish:** Atomic transaction updates rollup tables in the same database transaction as draft→published state change. Single transaction guarantees consistency.
- **On Grace Period Edit:** When a published transaction is edited (within 1-month window), affected rollup rows are recalculated. Recalculation scoped to the transaction's month only — not full history. Lifetime summary is automatically correct because it derives from monthly rows.
- **On Transaction Delete:** Corresponding rollup rows decremented/recalculated.

**Recalculation Trigger Mechanism:**
Direct service call from `TransactionService` / `PublishService` to `RollupService` within the same `@Transactional` boundary. No event-driven architecture for MVP1 — keep it explicit and in the same transaction. If rollup update fails, the entire operation rolls back.

**Consistency Guarantee:**
Rollup updates are part of the same `@Transactional` boundary as the source operation. Strong consistency via database transactions — no eventual consistency.

**Trade-off Accepted:** Two representations of financial data exist (encrypted transactions + unencrypted rollups). Rollup tables contain aggregate amounts only — no transaction names, no individual amounts. Acceptable security posture: aggregate totals (e.g., "₹4,200 groceries this month") are less sensitive than individual transaction details.

**Developer Constraint:** No repository queries may filter, sort, or aggregate on encrypted fields (`amount`, `name`). All aggregation reads from rollup tables. This must be enforced during code review.

**Database Migration Tool: Flyway**

SQL-based migration files in `src/main/resources/db/migration/`. Naming: `V1__create_users_table.sql`, `V2__create_transactions_table.sql`, etc. Simple, readable, version-controlled schema evolution.

### Authentication & Security

**JWT Authentication Flow:**
1. User registers/logs in → Spring Security validates credentials → JJWT generates signed token (30-day expiry)
2. Frontend stores JWT in **httpOnly cookie** (not localStorage — XSS protection)
3. Every API request includes JWT via cookie (extracted by JwtAuthFilter)
4. JwtAuthFilter validates token, sets SecurityContext, request proceeds
5. Token refresh: frontend requests new token before expiry via `/api/auth/refresh`

**CSRF Protection (Required with httpOnly Cookies):**
Using httpOnly cookies for JWT creates a CSRF attack surface. BudgetX uses the **double-submit cookie pattern:**
- On login, backend sets a CSRF token in a readable (non-httpOnly) cookie
- Frontend reads the CSRF cookie and sends it in a custom header (`X-CSRF-TOKEN`) with every state-changing request (POST, PUT, DELETE)
- Backend verifies that the header value matches the cookie value
- This is stateless (no server-side CSRF token store) and works with JWT's stateless auth model

**Rate Limiting:**
- Authentication endpoints: 5 failed attempts per 15 minutes per IP → 15-minute lockout
- Implemented via Spring Security filter (custom `RateLimitingFilter`)
- In-memory rate tracking for MVP1 (single-instance deployment)
- **Known Limitation:** Rate limit counters reset on container restart (ECS deployment, health check restart). Acceptable for MVP1 (2-3 trusted users). **Upgrade path:** Redis-backed rate limiting when scaling beyond MVP1.

**Encryption Strategy:**
- AES-256 encryption for transaction amounts and names
- Single encryption key stored in AWS Secrets Manager
- Encryption/decryption handled in `shared/encryption/` utility layer
- JPA `@Converter` on entity fields for transparent encrypt-on-write, decrypt-on-read
- Rollup tables store **unencrypted aggregates** (acceptable: aggregate totals, not individual records)
- **Constraint:** Encrypted fields cannot be used in WHERE, ORDER BY, or aggregate SQL clauses. All such operations use rollup tables.

**Security Headers (OWASP):**
- CORS: allowlist frontend domain only
- CSP: restrict script/style sources
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: enforce HTTPS

### API & Communication Patterns

**REST API Design:**
- RESTful endpoints following resource-based URL patterns
- Consistent response envelope: `{ success, data, error, timestamp }`
- HTTP status codes: 200 (success), 201 (created), 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- Input validation via Spring Validation `@Valid` annotations on DTOs

**Notification Delivery: Polling**
- Frontend polls `/api/alerts/check` on:
  - Dashboard page load
  - **Immediately after every transaction save/edit/delete** (synchronous UX flow — user must see alert instantly if threshold exceeded)
  - After publish action
- Response includes array of triggered alerts (new since last check)
- Alert state managed in `alert_history` table: CREATED → DISPLAYED → DISMISSED
- No WebSocket/SSE infrastructure needed for MVP1
- **Upgrade path:** SSE in Phase 2 if real-time push becomes a user need

**Error Handling Standard:**
- Global `@ControllerAdvice` exception handler
- Business exceptions mapped to appropriate HTTP status codes
- Validation errors return field-level error details
- No stack traces in production responses
- All errors logged with correlation ID for debugging

**API Documentation: SpringDoc OpenAPI**
- Auto-generated from controller annotations
- Swagger UI available at `/swagger-ui.html` (dev/staging only, disabled in production)
- Zero maintenance — stays in sync with code

### Frontend Architecture

**Component Architecture:**
- shadcn/ui as the component foundation (accessible, customizable)
- Feature-based organization within App Router:
  - `/app/(auth)/` — login, register pages
  - `/app/(main)/dashboard/` — dashboard page
  - `/app/(main)/transactions/` — transaction history
  - `/app/(main)/analytics/` — trends, breakdowns
  - `/app/(main)/alerts/` — alert configuration
  - `/app/(main)/friends/` — friend management
  - `/app/(main)/settings/` — account settings
- Client components marked with `"use client"` only when needed (interactivity, hooks)
- Server components used by default for data fetching

**State Management (Zustand):**
- Store slices: `useAuthStore`, `useAlertStore`, `useUIStore`
- Server data fetched via RSC or API routes — NOT stored in Zustand
- Zustand reserved for client-side UI state only (modals, toast queue, FAB state, sidebar toggle)
- **Toast Queue Pattern:** `useAlertStore` implements a sequential toast queue — one toast displayed at a time, auto-dismiss after 5 seconds, user can click/swipe to dismiss faster, next queued toast appears after current dismisses. Prevents toast stacking when multiple alerts trigger in rapid succession (e.g., bulk transaction logging).

**Performance Optimization:**
- React Server Components for dashboard data (server-rendered, zero client JS)
- Category list pre-loaded on auth/dashboard load (cached in Zustand for FAB <200ms)
- Dynamic imports for heavy components (Recharts for analytics)
- Next.js Image optimization for any assets
- Turbopack for fast builds and code splitting

### Infrastructure & Deployment

**Environment Strategy:**
- `development` — local Docker Compose (PostgreSQL + Spring Boot + Next.js)
- `staging` — AWS ECS (mirrors production, preview deployments)
- `production` — AWS ECS (Fargate) + RDS + Secrets Manager

**CI/CD Pipeline (GitHub Actions):**
1. On PR: lint + unit tests + build check
2. On merge to main: full test suite → build Docker images → deploy to staging
3. On release tag: deploy staging → production

**Monitoring & Observability:**
- AWS CloudWatch for application logs and metrics
- Sentry for frontend + backend error tracking
- Health check endpoint: `/actuator/health` (Spring Boot Actuator)
- Uptime monitoring: AWS CloudWatch synthetic canary or external ping service

### Testing Strategy

**Frontend:**
- Jest + React Testing Library — unit/component tests
- Playwright — E2E tests
- **Test data seeding:** `/api/test/seed` endpoint available only in test environment profile for Playwright fixtures to set up predictable state

**Backend:**
- JUnit 5 + Mockito — unit tests
- TestContainers — integration tests with real PostgreSQL
- **Rollup consistency tests (critical):** Integration tests that verify: (1) create transactions → (2) publish → (3) verify rollup tables match expected values → (4) edit published transaction → (5) verify rollups recalculated correctly. This is the highest-risk data path.

### Decision Impact Analysis

**Implementation Sequence:**
1. Database schema + Flyway migrations (foundation)
2. Authentication & security layer + CSRF protection (gate for all features)
3. Transaction CRUD + encryption + JPA converters (core domain)
4. Publishing engine + rollup table updates (ritual moment)
5. Dashboard + analytics (reads from rollup tables — fast)
6. Gamification (streaks + badges, triggered by publish)
7. Alerts + polling infrastructure
8. Friend management + onboarding
9. Frontend pages (parallel with backend development)

**Cross-Component Dependencies:**
- Publishing depends on: transactions, gamification, rollup tables, alerts
- Dashboard depends on: rollup tables (NOT raw transactions)
- Analytics depends on: rollup tables
- Gamification depends on: publishing engine
- Alerts depends on: transaction creation + rollup table data
- CSRF protection depends on: auth layer (must be implemented together)

---

## Implementation Patterns & Consistency Rules

### Critical Domain Pattern: Currency Handling

**All monetary amounts stored and transmitted as integer paise (1/100 of a rupee).**

| Layer | Representation | Example (₹42.50) |
|-------|---------------|-------------------|
| Database | `BIGINT` (paise) | `4250` |
| API JSON | `integer` (paise) | `"amount": 4250` |
| Backend Java | `long` (paise) | `long amount = 4250L;` |
| Frontend display | Formatted string | `"₹42.50"` |
| Rollup tables | `BIGINT` (paise) | `4250` |

**Conversion rules:**
- Backend NEVER converts — always works in paise
- Frontend converts paise → rupees for display ONLY: `const rupees = amount / 100`
- Frontend converts rupees → paise on form submission ONLY: `const paise = Math.round(rupees * 100)`
- Use `Math.round()` to avoid floating point drift

This is fintech standard practice. Prevents floating point arithmetic errors (e.g., `0.1 + 0.2 !== 0.3`).

### Naming Patterns

**Database Naming:**

| Pattern | Convention | Example |
|---------|-----------|--------|
| Tables | snake_case, plural | `users`, `transactions`, `monthly_summaries` |
| Columns | snake_case | `user_id`, `created_at`, `savings_rate` |
| Foreign keys | `{referenced_table_singular}_id` | `user_id`, `category_id` |
| Indexes | `idx_{table}_{columns}` | `idx_transactions_user_id`, `idx_transactions_status` |
| Constraints | `{type}_{table}_{column}` | `uq_users_email`, `fk_transactions_user_id` |
| Enums (in DB) | UPPER_SNAKE_CASE values | `DRAFT`, `PUBLISHED`, `EXPENSE`, `INCOME`, `INVESTMENT` |

**API Naming:**

| Pattern | Convention | Example |
|---------|-----------|--------|
| Endpoints | plural nouns, kebab-case | `/api/transactions`, `/api/alerts/check` |
| Path params | `{id}` format | `/api/transactions/{id}` |
| Query params | camelCase | `?status=DRAFT&sortBy=createdAt` |
| Custom headers | `X-` prefix | `X-CSRF-TOKEN`, `X-Correlation-ID` |

**API Versioning Convention:**
MVP1 uses `/api/` without version prefix. When the first breaking change occurs (Phase 2+), adopt URL-based versioning: existing endpoints move to `/api/v1/`, new breaking version exposed at `/api/v2/`. Non-breaking additions do not trigger a version bump.

**Java Code Naming (Backend):**

| Pattern | Convention | Example |
|---------|-----------|--------|
| Classes | PascalCase | `TransactionService`, `JwtAuthFilter` |
| Methods | camelCase, verb-first | `createTransaction()`, `findByUserId()` |
| Variables | camelCase | `savingsRate`, `transactionId` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS`, `JWT_EXPIRY_DAYS` |
| Packages | lowercase | `com.budgetx.transaction`, `com.budgetx.shared.encryption` |
| Entity classes | Singular PascalCase | `Transaction`, `User`, `Badge` |
| DTOs | `{Entity}Request` / `{Entity}Response` | `TransactionRequest`, `TransactionResponse`, `TransactionSummaryResponse` |
| Repositories | `{Entity}Repository` | `TransactionRepository`, `UserRepository` |
| Services | `{Domain}Service` | `TransactionService`, `RollupService` |
| Controllers | `{Domain}Controller` | `TransactionController`, `AuthController` |

**DTO Pattern:** Use `Request`/`Response` naming (not Create/Update). Single `TransactionRequest` handles both create and update — use `@Valid` groups or `@Nullable` fields to differentiate. Reduces DTO proliferation.

**TypeScript Code Naming (Frontend):**

| Pattern | Convention | Example |
|---------|-----------|--------|
| Components | PascalCase | `TransactionCard`, `DashboardSummary` |
| Files (components) | kebab-case | `transaction-card.tsx`, `dashboard-summary.tsx` |
| Files (utils/hooks) | kebab-case | `use-auth-store.ts`, `api-client.ts` |
| Functions | camelCase | `formatCurrency()`, `calculateSavingsRate()` |
| Types/Interfaces | PascalCase, NO prefix | `Transaction`, `AlertConfig`, `ToastItem` |
| Zustand stores | `use{Domain}Store` | `useAuthStore`, `useAlertStore`, `useUIStore` |
| API route files | `route.ts` | `app/api/transactions/route.ts` |

**Import Ordering:**

```java
// Java: stdlib → spring → third-party → project
import java.util.*;
import org.springframework.*;
import io.jsonwebtoken.*;
import com.budgetx.*;
```

```typescript
// TypeScript: react → next → third-party → project aliases → relative
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TransactionCard } from './transaction-card';
```

### Structure Patterns

**Backend Service Layer Pattern:**

Every domain module follows the same structure:
```
{domain}/
├── {Domain}Controller.java    # HTTP layer — validation, auth, response mapping
├── {Domain}Service.java       # Business logic — orchestration, rules
├── {Domain}Repository.java    # Data access — JPA queries only
└── dto/
    ├── {Domain}Request.java   # Input (create + update)
    └── {Domain}Response.java  # Output
```

**Controller rules:** Controllers NEVER contain business logic. They validate input, call service, map response. One-liner methods preferred.

**Service rules:** Services own all business logic. Services may call other services (e.g., `PublishService` calls `RollupService`). Services are `@Transactional` where needed.

**Repository rules:** Repositories NEVER called directly from controllers. Only from services.

**Frontend Component Pattern:**
```
components/
├── ui/                        # shadcn/ui components (auto-generated)
├── layout/                    # Layout components (sidebar, header, footer)
├── forms/                     # Form components (transaction-form, alert-form)
└── shared/                    # Shared components (currency-display, date-picker)

app/(main)/dashboard/
├── page.tsx                   # Server component — data fetching
├── _components/               # Dashboard-specific client components
│   ├── summary-card.tsx
│   ├── category-breakdown.tsx
│   └── quick-add-fab.tsx
└── loading.tsx                # Loading skeleton
```

**Responsive Breakpoint Convention:**
- Design for `lg` (1024px+) as primary viewport
- Support `md` (768px+) as minimum supported width
- Below `md` (768px): show a "Please use a desktop browser" message — no mobile layout effort in MVP1
- Use Tailwind breakpoints only (`md:`, `lg:`) — no custom breakpoints

**Tests co-located with source (backend):**
```
src/test/java/com/budgetx/transaction/
├── TransactionServiceTest.java        # Unit test
├── TransactionControllerTest.java     # Controller test
└── TransactionIntegrationTest.java    # Integration test (TestContainers)
```

**Tests co-located with source (frontend):**
```
components/forms/
├── transaction-form.tsx
└── transaction-form.test.tsx

app/(main)/dashboard/
├── page.tsx
└── __tests__/
    └── dashboard.test.tsx
```

**Test Naming Conventions:**

Java (JUnit 5): `methodName_condition_expectedResult`
```java
@Test void publishWeek_withDrafts_updatesRollupTables() { }
@Test void createTransaction_invalidAmount_throwsValidationException() { }
@Test void editPublishedTransaction_beyondGracePeriod_throwsForbidden() { }
```

TypeScript (Jest): descriptive strings
```typescript
test('renders savings rate as percentage after publish', () => { });
test('shows error toast when transaction save fails', () => { });
test('disables FAB while transaction is submitting', () => { });
```

**Standard Test Fixtures:**
- Test user: `test@budgetx.com` / password: `Test1234!`
- Test amounts: round numbers in paise (100000 = ₹1,000, 250000 = ₹2,500, 500000 = ₹5,000)
- Test categories: use predefined categories only (rent, groceries, utilities)
- Test dates: use fixed dates, never `new Date()` in assertions

### Format Patterns

**API Response Envelope:**
```json
// Success
{
  "success": true,
  "data": { "id": 1, "amount": 4250, "category": "groceries" },
  "error": null,
  "timestamp": "2026-04-06T10:30:00Z"
}

// Error
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must be positive",
    "fields": { "amount": "Must be greater than 0" }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}

// List
{
  "success": true,
  "data": {
    "items": [...],
    "total": 42,
    "page": 1,
    "pageSize": 20
  },
  "error": null,
  "timestamp": "2026-04-06T10:30:00Z"
}
```

**Date/Time Formats:**
- API JSON: ISO 8601 strings (`"2026-04-06T10:30:00Z"`)
- Database: `TIMESTAMP WITH TIME ZONE`
- Frontend display: Locale-aware via `date-fns` (`format(date, 'dd MMM yyyy')`)
- Timezone: All server-side operations in **UTC**. Streak logic converts to **IST** for Sunday boundary checks.

**JSON Field Naming:**
- API request/response bodies: **camelCase** (`savingsRate`, `createdAt`, `transactionId`)
- Spring Boot `@JsonProperty` with `PropertyNamingStrategies.LOWER_CAMEL_CASE` (default)

### Communication Patterns

**State Management (Zustand) Patterns:**
```typescript
// Store structure — always follow this shape
interface AlertStore {
  // State (noun properties)
  alerts: Alert[];
  toastQueue: ToastItem[];
  currentToast: ToastItem | null;

  // Actions (verb-first naming)
  fetchAlerts: () => Promise<void>;
  dismissAlert: (id: string) => void;
  enqueueToast: (toast: ToastItem) => void;
  dequeueToast: () => void;
}
```
- State: noun properties
- Actions: verb-first method names
- Async actions return `Promise<void>`
- No nested state deeper than 2 levels

**Logging Pattern (Backend):**
```java
// Use SLF4J with structured logging
private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

// INFO: business events
log.info("Transaction published userId={} count={}", userId, count);

// WARN: recoverable issues
log.warn("Rate limit approaching userId={} attempts={}", userId, attempts);

// ERROR: failures with correlation
log.error("Publish failed userId={} correlationId={}", userId, corrId, exception);
```
- Never log sensitive data (amounts, names, passwords, tokens)
- Always include userId and correlationId for traceability
- Log business events at INFO, not DEBUG

### Documentation Patterns

**JavaDoc Convention (Backend):**
- All public service methods: JavaDoc with `@param` and `@return`
- Controllers: SpringDoc annotations (`@Operation`, `@ApiResponse`) instead of JavaDoc
- Private methods: comment only when the *why* isn't obvious from the code
- Entity fields: brief `/** */` comment for non-obvious fields

```java
/**
 * Atomically publishes all draft transactions for the user's current week.
 * Updates rollup tables and triggers streak/badge calculations.
 *
 * @param userId the authenticated user's ID
 * @return PublishResponse containing updated savings rate and streak count
 * @throws NoDraftsException if no draft transactions exist to publish
 */
public PublishResponse publishWeek(Long userId) { }
```

**TypeScript JSDoc Convention (Frontend):**
- Exported components: JSDoc with props description
- Utility functions: JSDoc with `@param` and `@returns`
- Zustand stores: JSDoc on store definition describing purpose
- Internal/private functions: no JSDoc unless non-obvious

```typescript
/**
 * Formats a paise amount to a display-ready INR string.
 * @param paise - Amount in paise (integer)
 * @returns Formatted string like "₹1,234.50"
 */
export function formatCurrency(paise: number): string { }
```

### Process Patterns

**Error Handling (Backend):**
```java
// Custom business exceptions extend BaseException
public class TransactionNotFoundException extends BaseException {
    public TransactionNotFoundException(Long id) {
        super("TRANSACTION_NOT_FOUND", "Transaction not found: " + id, HttpStatus.NOT_FOUND);
    }
}

// Global handler maps to API response envelope
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<?>> handleBusinessException(BaseException ex) {
        return ResponseEntity.status(ex.getStatus())
            .body(ApiResponse.error(ex.getCode(), ex.getMessage()));
    }
}
```

**Error Handling (Frontend):**
- API errors caught in API client layer (Axios interceptor)
- 401 → redirect to login
- 400 → display field-level errors on form
- 500 → show generic error toast
- Network error → show "Connection lost" toast

**Loading States:**
- Server components: use `loading.tsx` (Next.js Suspense)
- Client components: `isLoading` boolean in component state
- Forms: `isSubmitting` boolean, disable submit button during API call
- Skeleton UI preferred over spinners for dashboard/list views

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions exactly — no variations
2. Use the service layer pattern (Controller → Service → Repository)
3. Never query encrypted fields directly — use rollup tables for aggregation
4. Include correlationId in all error logs
5. Return the standard API response envelope for every endpoint
6. Co-locate tests with source files
7. Use `"use client"` directive only when client interactivity is required
8. Use camelCase in all JSON API payloads
9. Store and transmit all monetary amounts as integer paise
10. Follow import ordering conventions (stdlib → framework → third-party → project)
11. Document all public service methods with JavaDoc / JSDoc
12. Use `Request`/`Response` DTO naming (not Create/Update)

**Anti-Patterns (Never Do):**
- ❌ `float` or `double` for monetary amounts
- ❌ Business logic in controllers
- ❌ Direct repository calls from controllers
- ❌ `WHERE amount > ?` on encrypted columns
- ❌ `I` prefix on TypeScript interfaces
- ❌ Logging sensitive data (amounts, names, passwords, JWT tokens)
- ❌ Custom CSS breakpoints (use Tailwind `md:` and `lg:` only)
- ❌ `new Date()` in test assertions

---

## Project Structure & Boundaries

### Complete Project Directory Structure

**Monorepo Root:**
```
budgetx/
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci-frontend.yml
│       ├── ci-backend.yml
│       └── deploy.yml
├── docker-compose.yml              # Local dev: PostgreSQL + backend + frontend
├── docker-compose.test.yml         # Test environment with TestContainers
├── frontend/                       # Next.js 16 application
└── backend/                        # Spring Boot 4.0.5 application
```

**Frontend (`frontend/`):**
```
frontend/
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                  # shadcn/ui configuration
├── .env.local                       # Local dev secrets
├── .env.example                     # Template for environment vars
├── .eslintrc.json
├── Dockerfile
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── app/
│   ├── globals.css                  # Tailwind base + global styles
│   ├── layout.tsx                   # Root layout (fonts, providers)
│   ├── page.tsx                     # Landing / redirect to dashboard
│   ├── not-found.tsx                # 404 page
│   ├── (auth)/
│   │   ├── layout.tsx               # Auth-specific layout (no sidebar)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx               # Main app layout (sidebar, header)
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Server component — fetches summary data
│   │   │   ├── loading.tsx          # Skeleton loader
│   │   │   └── _components/
│   │   │       ├── summary-card.tsx
│   │   │       ├── monthly-breakdown.tsx
│   │   │       ├── category-chart.tsx
│   │   │       ├── streak-badge-display.tsx
│   │   │       └── quick-add-fab.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx             # Transaction list with filters
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── transaction-list.tsx
│   │   │       ├── transaction-filters.tsx
│   │   │       └── publish-week-button.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx             # Trends, category breakdowns
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── trends-chart.tsx
│   │   │       ├── category-breakdown.tsx
│   │   │       └── savings-rate-card.tsx
│   │   ├── alerts/
│   │   │   ├── page.tsx             # Alert configuration
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── alert-config-form.tsx
│   │   │       └── alert-history-list.tsx
│   │   ├── friends/
│   │   │   ├── page.tsx             # Friend list
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── friend-list.tsx
│   │   │       └── add-friend-form.tsx
│   │   └── settings/
│   │       ├── page.tsx             # Account settings
│   │       └── _components/
│   │           ├── profile-form.tsx
│   │           └── password-change-form.tsx
│   ├── onboarding/
│   │   ├── page.tsx                 # Guided onboarding flow
│   │   └── _components/
│   │       ├── threshold-setup.tsx
│   │       └── investment-baseline.tsx
│   └── api/                         # BFF API routes (proxy to Spring Boot)
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── refresh/route.ts
│       └── proxy/
│           └── [...path]/route.ts   # Catch-all proxy to Spring Boot
├── components/
│   ├── ui/                          # shadcn/ui auto-generated
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── mobile-gate.tsx          # "Use desktop" message for <768px
│   ├── forms/
│   │   ├── transaction-form.tsx
│   │   ├── transaction-form.test.tsx
│   │   ├── alert-config-form.tsx
│   │   └── alert-config-form.test.tsx
│   └── shared/
│       ├── currency-display.tsx
│       ├── currency-display.test.tsx
│       ├── date-display.tsx
│       ├── loading-skeleton.tsx
│       └── error-boundary.tsx
├── lib/
│   ├── api-client.ts                # Axios instance + interceptors
│   ├── auth.ts                      # JWT cookie handling, CSRF token
│   ├── utils.ts                     # cn() helper, general utils
│   ├── currency.ts                  # paise ↔ rupees conversion
│   ├── currency.test.ts
│   ├── date-utils.ts                # date-fns wrappers
│   └── constants.ts                 # App-wide constants
├── hooks/
│   ├── use-auth.ts                  # Auth state + login/logout actions
│   └── use-debounce.ts
├── stores/
│   ├── use-auth-store.ts            # Zustand: auth state
│   ├── use-alert-store.ts           # Zustand: alerts + toast queue
│   └── use-ui-store.ts              # Zustand: sidebar, FAB, modals
├── types/
│   ├── transaction.ts               # Transaction, TransactionRequest, etc.
│   ├── user.ts                      # User, LoginRequest, etc.
│   ├── alert.ts                     # Alert, AlertConfig, ToastItem
│   ├── analytics.ts                 # SavingsRate, CategoryBreakdown, etc.
│   └── api.ts                       # ApiResponse<T> envelope type
└── e2e/
    ├── playwright.config.ts
    ├── fixtures/
    │   └── test-data.ts             # Seed data helpers
    ├── dashboard.spec.ts
    ├── transactions.spec.ts
    ├── publish.spec.ts
    └── auth.spec.ts
```

**Backend (`backend/`):**
```
backend/
├── build.gradle.kts                 # Gradle Kotlin DSL
├── settings.gradle.kts
├── gradlew / gradlew.bat
├── gradle/
│   └── wrapper/
├── Dockerfile
├── .env.example
├── src/
│   ├── main/
│   │   ├── java/com/budgetx/
│   │   │   ├── BudgetxApplication.java          # Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java          # Spring Security + JWT filter chain
│   │   │   │   ├── CorsConfig.java              # Frontend origin allowlist
│   │   │   │   ├── EncryptionConfig.java        # AES-256 key management
│   │   │   │   ├── DatabaseConfig.java          # Connection pooling
│   │   │   │   ├── OpenApiConfig.java           # SpringDoc configuration
│   │   │   │   └── WebConfig.java               # General web config
│   │   │   ├── auth/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   ├── RateLimitingFilter.java
│   │   │   │   └── dto/
│   │   │   │       ├── LoginRequest.java
│   │   │   │       ├── RegisterRequest.java
│   │   │   │       └── AuthResponse.java
│   │   │   ├── transaction/
│   │   │   │   ├── TransactionController.java
│   │   │   │   ├── TransactionService.java
│   │   │   │   ├── TransactionRepository.java
│   │   │   │   └── dto/
│   │   │   │       ├── TransactionRequest.java
│   │   │   │       ├── TransactionResponse.java
│   │   │   │       └── TransactionSummaryResponse.java
│   │   │   ├── publishing/
│   │   │   │   ├── PublishController.java
│   │   │   │   ├── PublishService.java
│   │   │   │   └── dto/
│   │   │   │       └── PublishResponse.java
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardController.java
│   │   │   │   ├── DashboardService.java
│   │   │   │   └── dto/
│   │   │   │       ├── DashboardSummaryResponse.java
│   │   │   │       └── MonthlyBreakdownResponse.java
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsController.java
│   │   │   │   ├── AnalyticsService.java
│   │   │   │   └── dto/
│   │   │   │       ├── SavingsRateResponse.java
│   │   │   │       ├── CategoryBreakdownResponse.java
│   │   │   │       └── TrendResponse.java
│   │   │   ├── gamification/
│   │   │   │   ├── GamificationController.java
│   │   │   │   ├── StreakService.java
│   │   │   │   ├── BadgeService.java
│   │   │   │   └── dto/
│   │   │   │       ├── StreakResponse.java
│   │   │   │       └── BadgeResponse.java
│   │   │   ├── alert/
│   │   │   │   ├── AlertController.java
│   │   │   │   ├── AlertService.java
│   │   │   │   ├── AlertCheckService.java
│   │   │   │   └── dto/
│   │   │   │       ├── AlertConfigRequest.java
│   │   │   │       ├── AlertConfigResponse.java
│   │   │   │       └── AlertCheckResponse.java
│   │   │   ├── friend/
│   │   │   │   ├── FriendController.java
│   │   │   │   ├── FriendService.java
│   │   │   │   └── dto/
│   │   │   │       ├── FriendRequest.java
│   │   │   │       └── FriendResponse.java
│   │   │   ├── onboarding/
│   │   │   │   ├── OnboardingController.java
│   │   │   │   ├── OnboardingService.java
│   │   │   │   └── dto/
│   │   │   │       └── OnboardingRequest.java
│   │   │   ├── rollup/
│   │   │   │   ├── RollupService.java           # Rollup table management
│   │   │   │   └── RollupRepository.java
│   │   │   └── shared/
│   │   │       ├── entity/
│   │   │       │   ├── User.java
│   │   │       │   ├── Transaction.java
│   │   │       │   ├── Category.java
│   │   │       │   ├── InvestmentBaseline.java
│   │   │       │   ├── Alert.java
│   │   │       │   ├── AlertHistory.java
│   │   │       │   ├── Streak.java
│   │   │       │   ├── Badge.java
│   │   │       │   ├── Friend.java
│   │   │       │   ├── MonthlySummary.java       # Rollup table entity
│   │   │       │   └── CategoryTotal.java        # Rollup table entity
│   │   │       ├── enums/
│   │   │       │   ├── TransactionStatus.java    # DRAFT, PUBLISHED
│   │   │       │   ├── TransactionType.java      # EXPENSE, INCOME, INVESTMENT
│   │   │       │   └── AlertType.java            # FIXED_AMOUNT, PERCENTAGE
│   │   │       ├── dto/
│   │   │       │   └── ApiResponse.java          # Standard response envelope
│   │   │       ├── exception/
│   │   │       │   ├── BaseException.java
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── ResourceNotFoundException.java
│   │   │       │   ├── ValidationException.java
│   │   │       │   └── UnauthorizedException.java
│   │   │       └── encryption/
│   │   │           ├── EncryptionUtil.java
│   │   │           └── EncryptedStringConverter.java  # JPA @Converter
│   │   └── resources/
│   │       ├── application.yml                    # Default config
│   │       ├── application-dev.yml                # Dev overrides
│   │       ├── application-test.yml               # Test overrides
│   │       ├── application-prod.yml               # Production config
│   │       └── db/migration/
│   │           ├── V1__create_users_table.sql
│   │           ├── V2__create_categories_table.sql
│   │           ├── V3__create_transactions_table.sql
│   │           ├── V4__create_investment_baselines_table.sql
│   │           ├── V5__create_alerts_table.sql
│   │           ├── V6__create_streaks_badges_tables.sql
│   │           ├── V7__create_friends_table.sql
│   │           ├── V8__create_rollup_tables.sql
│   │           ├── V9__create_alert_history_table.sql
│   │           └── V10__seed_predefined_categories.sql
│   └── test/
│       └── java/com/budgetx/
│           ├── auth/
│           │   ├── AuthServiceTest.java
│           │   └── AuthControllerTest.java
│           ├── transaction/
│           │   ├── TransactionServiceTest.java
│           │   ├── TransactionControllerTest.java
│           │   └── TransactionIntegrationTest.java
│           ├── publishing/
│           │   ├── PublishServiceTest.java
│           │   └── PublishIntegrationTest.java     # Rollup consistency tests
│           ├── rollup/
│           │   └── RollupServiceTest.java
│           ├── gamification/
│           │   ├── StreakServiceTest.java
│           │   └── BadgeServiceTest.java
│           ├── alert/
│           │   └── AlertServiceTest.java
│           └── shared/
│               ├── encryption/
│               │   └── EncryptionUtilTest.java
│               └── TestFixtures.java               # Shared test data
```

### Requirements to Structure Mapping

| FR Category | Backend Package | Frontend Route | Key Files |
|-------------|----------------|---------------|----------|
| Auth (FR1-FR6) | `auth/` | `(auth)/login`, `(auth)/register` | `AuthService`, `JwtTokenProvider` |
| Transactions (FR7-FR16) | `transaction/` | `(main)/transactions` | `TransactionService`, `EncryptedStringConverter` |
| Publishing (FR17-FR20) | `publishing/` + `rollup/` | `(main)/transactions` (publish button) | `PublishService`, `RollupService` |
| Dashboard (FR21-FR24) | `dashboard/` | `(main)/dashboard` | `DashboardService` reads rollup tables |
| Analytics (FR25-FR29a) | `analytics/` | `(main)/analytics` | `AnalyticsService` reads rollup tables |
| Gamification (FR30-FR36) | `gamification/` | `(main)/dashboard` (streak/badge display) | `StreakService`, `BadgeService` |
| Alerts (FR37-FR45) | `alert/` | `(main)/alerts` | `AlertService`, `AlertCheckService` |
| Friends (FR46-FR50) | `friend/` | `(main)/friends` | `FriendService` |
| Onboarding (FR51-FR53) | `onboarding/` | `onboarding/` | `OnboardingService` |
| Security (FR54-FR59) | `config/` + `shared/encryption/` | `lib/auth.ts` | Cross-cutting |

### Architectural Boundaries

**Controller ↔ Service Boundary:** Controllers handle HTTP concerns only. Services handle business logic. No `HttpServletRequest` in service layer.

**Service ↔ Repository Boundary:** Repositories return entities only. Services map entities ↔ DTOs. No DTO classes in repository layer.

**Frontend ↔ Backend Boundary:** All communication via REST API through the BFF proxy (`app/api/proxy/`). Frontend never calls Spring Boot directly from client-side — always through Next.js server.

**Encryption Boundary:** `shared/encryption/` is the only code that touches encryption keys. JPA `@Converter` transparently handles encrypt/decrypt. No other package imports encryption utilities directly.

**Rollup Boundary:** Only `RollupService` writes to rollup tables. `DashboardService` and `AnalyticsService` read from rollup tables. `PublishService` and `TransactionService` call `RollupService` to trigger updates.

### Data Flow

```
User Action → Next.js Client Component → BFF API Route → Spring Boot Controller
→ Service (business logic + @Transactional) → Repository → PostgreSQL
→ Response DTO → API Response Envelope → Next.js → UI
```

**Publish Flow (most complex):**
```
Publish Button → /api/proxy/publish-week → PublishController → PublishService
→ [Atomic Transaction]:
   1. TransactionRepository: update all DRAFT → PUBLISHED
   2. RollupService: recalculate monthly_summaries + category_totals
   3. StreakService: update streak counter
   4. BadgeService: check and award badges
→ PublishResponse (savings rate, streak, new badges)
→ Frontend: update dashboard + show toast
```

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices verified compatible:
- ✅ Next.js 16.2.2 + Tailwind CSS + shadcn/ui — native integration, no conflicts
- ✅ Spring Boot 4.0.5 + Java 25 LTS — first-class support confirmed
- ✅ Spring Security 7 + JJWT 0.12.6 — compatible with Jakarta EE 11
- ✅ Spring Data JPA + PostgreSQL + Flyway — standard, well-tested stack
- ✅ Zustand + Next.js App Router RSC — complementary (Zustand for client state, RSC for server data)
- ✅ Gradle Kotlin DSL — fully supported by Spring Boot 4.0

**Pattern Consistency:**
- ✅ Naming conventions internally consistent (snake_case DB → camelCase API → PascalCase Java classes)
- ✅ Service layer pattern aligns with Spring Boot conventions
- ✅ Frontend file naming (kebab-case) aligns with Next.js ecosystem
- ✅ Test co-location pattern works for both Jest and JUnit
- ✅ Currency (paise) pattern consistently applied across all layers

**Structure Alignment:**
- ✅ Monorepo structure cleanly separates frontend/backend concerns
- ✅ Domain-based package structure maps 1:1 to FR categories
- ✅ BFF proxy pattern enforces frontend↔backend boundary
- ✅ Rollup boundary isolates aggregation complexity

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (61 FRs):**

| FR Range | Coverage | Architectural Support |
|----------|---------|----------------------|
| FR1-FR6 (Auth) | ✅ Full | `auth/` package, JWT + bcrypt + rate limiting |
| FR7-FR16 (Transactions) | ✅ Full | `transaction/` + `shared/encryption/` + JPA @Converter |
| FR9a-FR9d (Investments) | ✅ Full | `InvestmentBaseline` entity, `TransactionType.INVESTMENT` enum |
| FR17-FR20 (Publishing) | ✅ Full | `publishing/` + `rollup/` atomic transaction |
| FR21-FR24 (Dashboard) | ✅ Full | `dashboard/` reads rollup tables, FAB category pre-load |
| FR25-FR29a (Analytics) | ✅ Full | `analytics/` reads rollup tables |
| FR30-FR36 (Gamification) | ✅ Full | `gamification/` streak + badge services, IST timezone |
| FR37-FR45 (Alerts) | ✅ Full | `alert/` + `AlertCheckService` + polling + toast queue |
| FR46-FR50 (Friends) | ✅ Full | `friend/` package, extensible for Phase 2 leaderboard |
| FR51-FR53 (Onboarding) | ✅ Full | `onboarding/` package, guided flow |

**Non-Functional Requirements Coverage:**

| NFR | Target | Architectural Solution | Status |
|-----|--------|----------------------|--------|
| Dashboard <1s | Load on 4G | RSC server rendering + rollup tables (no decrypt) | ✅ |
| Publish <500ms | Atomic ops | Single `@Transactional` + rollup update in same TX | ✅ |
| FAB <200ms | Open time | Category list pre-loaded in Zustand | ✅ |
| Savings rate <500ms | Calculation | Pre-computed in rollup tables | ✅ |
| AES-256 encryption | Amounts + names | JPA `@Converter` + AWS Secrets Manager | ✅ |
| Bcrypt 12+ rounds | Passwords | Spring Security default config | ✅ |
| OWASP Top 10 | Compliance | Security headers + CSRF + rate limiting + validation | ✅ |
| Rate limiting | 5/15min | `RateLimitingFilter` (in-memory, known limitation documented) | ✅ |
| 99.9% uptime | SLA | ECS Fargate + health checks + auto-restart | ✅ |
| Daily backups | 7-day PITR | AWS RDS automated backups | ✅ |
| Browser support | Chrome latest 2 | Next.js default browser targets | ✅ |
| Responsive 768px+ | Tablet minimum | Tailwind `md:` breakpoint, mobile-gate component | ✅ |

### Implementation Readiness Validation ✅

**Decision Completeness:** All 6 critical decisions documented with versions, rationale, and trade-offs. Every decision includes upgrade paths and known limitations.

**Structure Completeness:** Full file-level project tree for both frontend (~80 files) and backend (~70 files). Every FR category maps to specific packages and routes.

**Pattern Completeness:** 12 enforcement rules + 8 anti-patterns documented. Covers naming, structure, format, communication, documentation, and process patterns. Concrete code examples for each pattern.

### Gap Analysis

**No Critical Gaps Found.**

**Minor Gaps (non-blocking, documented for awareness):**

1. **Database connection pooling details.** `DatabaseConfig.java` is listed but pool size/timeouts not specified. Default HikariCP settings are fine for MVP1 (2-3 users). Tune in production config.

2. **Logging correlation ID propagation.** Patterns say "include correlationId" but propagation mechanism not specified. Recommendation: Spring Boot MDC filter generates UUID per request via `MDC.put("correlationId", uuid)`. Logback pattern includes it automatically.

3. **Frontend error boundary placement.** App Router `error.tsx` per route segment AND `ErrorBoundary` component should both be used: `error.tsx` for route-level, `ErrorBoundary` for component-level within a page.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (61 FRs, all NFRs)
- [x] Scale and complexity assessed (medium, 2-3 users)
- [x] Technical constraints identified (encryption overhead, atomic publish, timezone, investment model)
- [x] Cross-cutting concerns mapped (8 concerns including toast infra, retroactive recalc)

**✅ Architectural Decisions**
- [x] 6 critical decisions documented with versions
- [x] Technology stack fully specified (all versions verified via web search)
- [x] Integration patterns defined (BFF proxy, service calls, rollup boundaries)
- [x] Performance considerations addressed (rollup tables, RSC, category pre-load)
- [x] Security decisions documented (JWT cookies, CSRF double-submit, AES-256, rate limiting)

**✅ Implementation Patterns**
- [x] Naming conventions established (DB, API, Java, TypeScript)
- [x] Structure patterns defined (service layer, component organization)
- [x] Communication patterns specified (Zustand stores, logging, state management)
- [x] Process patterns documented (error handling, loading states)
- [x] Currency handling defined (integer paise throughout)
- [x] Documentation patterns defined (JavaDoc, JSDoc, SpringDoc)
- [x] Testing conventions defined (naming, fixtures, rollup consistency tests)

**✅ Project Structure**
- [x] Complete directory structure defined (frontend + backend + monorepo root)
- [x] Component boundaries established (5 explicit boundaries)
- [x] Integration points mapped (data flow, publish flow)
- [x] Requirements to structure mapping complete (all 10 FR categories)

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** HIGH

**Key Strengths:**
- Rollup table strategy elegantly solves the encryption ↔ performance tension
- Atomic publish design protects the critical ritual moment
- Clear boundaries (encryption, rollup, BFF) prevent agent confusion
- Currency-as-paise eliminates entire category of financial bugs
- Party mode reviews surfaced 19 improvements across 4 rounds

**Areas for Future Enhancement (Post-MVP1):**
- Redis-backed rate limiting (replace in-memory)
- SSE notifications (replace polling)
- API versioning (`/api/v1/`, `/api/v2/`)
- Mobile responsive layout (below 768px)
- Leaderboard infrastructure (Phase 2)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
# 1. Initialize frontend
npx create-next-app@latest budgetx-frontend --yes --use-npm
cd budgetx-frontend && npx shadcn@latest init

# 2. Initialize backend via start.spring.io
# Gradle (Kotlin DSL), Java 25, Spring Boot 4.0.5
# Dependencies: Web, Security, Data JPA, PostgreSQL, Validation, DevTools, Lombok

# 3. Set up Docker Compose for local development
# PostgreSQL + backend + frontend
```

---
