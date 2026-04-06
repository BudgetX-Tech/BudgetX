---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain-skipped", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["product-brief-BudgetX.md"]
workflowType: "prd"
classification:
  projectType: "Web Application (React + Spring Boot)"
  domain: "Fintech / Personal Finance"
  complexity: "Medium"
  projectContext: "Greenfield"
partyModeInsights:
  loggingBehavior: "Weekly ritual as priority with daily draft logging option; draft/publish model for transactions"
  retentionDriver: "Gamification (streaks, badges) + thoughtful UI design"
  securityScope: "Encrypt transaction amount and name; server-side key management for MVP1"
  marketPositioning: "Indian salaried professionals (₹8L–₹1.5Cr annual income); future expansion possible"
  businessModel: "Personal project for MVP1; validates model before monetization consideration"
  keyFeature: "Draft/publish transaction model enables daily logging freedom while maintaining weekly ritual ownership"
vision:
  problemDeeperLayer: "Lack of control over spending; need for achievement and financial progress"
  differentiatorMoments: 
    - "Weekly savings rate visibility creates data-driven motivation"
    - "Friend comparison creates healthy accountability and peer motivation"
  visionStatement: "BudgetX transforms reactive 'doomspending' into intentional financial planning through weekly clarity, visible progress, and peer motivation"
  transformation: "From reactive spending patterns → awareness → intentional planning"
---

# Product Requirements Document - BudgetX

**Author:** Itachi
**Date:** 2026-04-05

## Executive Summary

BudgetX is a personal finance tracker built for Indian salaried professionals who struggle with reactive spending and want to feel financial control. It transforms "doomspending" (spending without awareness of consequences) into intentional financial planning through weekly clarity, visible progress, and peer accountability.

Today's salaried professionals track income, expenses, and investments across fragmented tools (Notion, Excel, multiple apps). They lack visibility into spending patterns and struggle to answer: "Where is my money actually going?" BudgetX solves this with a single, unified platform where users log daily transactions (in draft state), publish their weekly snapshot on Sunday, and immediately see:
- **Weekly savings rate** (income - all expenses, displayed as %)
- **Category breakdown** (where money is flowing)
- **Spending streaks** (consistent logging engagement)
- **Friend leaderboards** (informal peer comparison on savings rates)

The weekly ritual + gamification model creates two retention drivers: (1) the psychological reward of publishing a "complete week," and (2) achievement visibility through streaks and badges that motivate continued engagement.

**MVP1 scope:** Web-only, single-user, personal validation project. Not aimed at scale; focused on proving the weekly ritual + gamification model works for financial behavior change. Q3 2026 brings mobile companion. Business model is personal use; freemium expansion is future consideration.

### What Makes This Special

**Dual-entry model:** Most financial apps force daily micro-entry or weekly forced ritual. BudgetX lets users log daily (in draft state) for immediate relief, then *publish* the week on Sunday as a deliberate ritual moment. This eliminates the "daily burden" while preserving "weekly ownership."

**Gamification for financial behavior:** Streaks, badges, and friend leaderboards are not gimmicks—they're the retention mechanism. The user is betting that visibility + achievement signals will do what traditional budgeting apps fail to do: keep people engaged month after month.

**India-specific:** Categories (EMI, rent, credit cards), investment types (PPF, mutual funds, stocks), and expense patterns are calibrated for Indian salaried professionals. Not generic US financial planning templates.

**Self-contained data:** No bank linking, no aggregation, no privacy concerns. Users maintain complete control of their financial data. Server-side encrypted (amounts + transaction names), reducing the attack surface fintech apps typically expose.

### Project Classification

| Dimension | Value |
|-----------|-------|
| **Project Type** | Web Application (React frontend + Spring Boot backend) |
| **Domain** | Fintech / Personal Finance |
| **Complexity** | Medium (financial data security critical; domain established; differentiation is UX + behavior) |
| **Project Context** | Greenfield (new product, no existing system integration) |
| **Target Users** | Indian salaried professionals (₹8L–₹1.5Cr annual income) |
| **Business Model (MVP1)** | Personal project; validates model before monetization consideration |

## Success Criteria

### User Success

User success = behavior change moments where BudgetX insights trigger spending awareness and intentional planning.

**Behavior change indicators:**
- **Spending pattern awareness:** Identifies category trends ("₹12K groceries 2nd week") and adjusts plans accordingly
- **Proactive planning:** Makes conscious spending decisions based on published savings rate or category warnings
- **Consistent engagement:** Maintains 12+ week logging streak without app abandonment (gamification works)
- **Streak motivation:** Actively preserves streak by logging even on busy days
- **Social accountability:** Compares savings rate with friends and maintains or improves position

**Success benchmark:** Can articulate specific behavior changes, uses app consistently for 12+ weeks

### Business Success

Business success = validating the hypothesis: **"Weekly ritual + gamification sustains user engagement and drives behavior change."**

**6-month validation metrics:**
- **Logging consistency:** 3+ entries per week per user (daily drafts + weekly publish)
- **Publish engagement:** 80%+ weekly publish completion (sustained ritual)
- **Streak maintenance:** 1000+ cumulative streak days across all users
- **Behavior change:** All users report at least one spending behavior change triggered by app insights
- **Zero churn:** All initial users (2-3 friends) still active and engaged at Month 6

**Success benchmark:** After 6 months, behavior validation proves the model works—users engaged with measurable spending changes and app integrated into financial routine.

### Technical Success

BudgetX is a fintech app; data security and performance are table stakes. Beyond that, **UI/UX quality and performance** are the differentiators that keep users coming back.

**Data security & reliability (table stakes):**
- Zero data breaches or security incidents
- 99.9% uptime for transaction logging and dashboard
- All transactions persist correctly (no data loss)
- Encrypted fields (amounts + transaction names) remain encrypted and intact

**UI/UX excellence (differentiation):**
- Dashboard loads in <1 second (not waiting frustrates users during their weekly ritual)
- Weekly publish completes smoothly in <500ms (rituals must feel fast)
- Transaction entry (draft creation) requires <3 taps/clicks maximum
- All gamification elements (streaks, badges, leaderboards) render without latency
- UI is intuitive enough that new user onboarding requires zero guidance
- Mobile-ready responsive design (even though mobile is Q3 2026, web should feel mobile-friendly)

**Performance & reliability:**
- Page load times consistently <1 second across all features
- No visible lag when toggling between views or publishing
- Responsive on all screen sizes (1024px minimum width during MVP1)

**Success benchmark:** 6 months of consistent use with zero crashes, slowdowns, or UX friction interrupting weekly ritual.

## Product Scope

### MVP1 - Minimum Viable Product (Web-Only)

**Essential to prove the concept:**
- Flexible logging: Daily draft entries + weekly publish ritual
- Categories: Predefined expense (rent, EMI, credit cards, groceries, utilities, misc.) + investment types (PPF, mutual funds, stocks) + custom categories
- Dashboard: Lifetime summary + current month breakdown + quick-add FAB
- Analysis: Weekly savings rate (income - all expenses), monthly trends, category breakdowns, spend vs. income visualization
- Gamification: Daily spending streaks, achievement badges, friend leaderboards (savings rates only, no amounts)
- Alerts: Per-category thresholds + global monthly spend cap (user-defined during onboarding)
- Onboarding: Alert threshold setup (₹X or Y% of average per category)
- Data security: Server-side encryption of amounts + transaction names
- UI/UX: Polished, intuitive, zero guidance required

**NOT in MVP1:**
- Mobile app (Q3 2026)
- Multi-user accounts or family sharing
- Budget forecasting
- Tax reporting or deduction tracking
- Data export / bulk reporting
- Bank account aggregation
- Automated transaction imports
- AI-powered spending analysis or recommendations

### Growth Features (Post-MVP, Phase 2-3)

Once MVP1 proves the model, add:
- **Forecasting:** "If you keep saving like this, you'll hit ₹10L by Month X"
- **Goal tracking:** Set and track savings goals (house down payment, vacation, PPF target)
- **Recurring transactions:** Auto-create recurring expenses (rent, EMI) to reduce logging friction
- **Analytics:** Spending trends over 3/6/12 months, year-over-year comparisons
- **Tax reporting:** Export investment summaries for ITR reporting
- **Premium features:** Advanced analytics, bulk export, priority support (freemium model validation)

### Vision (Year 2-3)

If MVP1 succeeds and you expand beyond personal + friends:
- Mobile companion app (on-the-go logging at point-of-transaction)
- Multi-user family accounts (shared visibility, collaborative budget planning)
- Real-time notifications and alerts
- Integration with Indian fintech ecosystem (mutual fund APIs, PPF tracking APIs)
- AI-powered spending insights ("You're spending 15% more on groceries this month—here's why")
- Community features (anonymized spending benchmarks, spending challenges)
- Freemium monetization maturity

## User Journeys

### Journey 1: Itachi's Weekly Ritual (Primary User - Success Path)

**Persona:** Itachi, 28, software engineer, ₹18L annual salary, Bangalore. Currently uses Notion (chaotic).

**Monday:** Paycheck hits. Logs 3 forgotten weekend transactions (₹450 coffee, ₹2,100 grocery, ₹800 entertainment) as drafts. No pressure to finalize.

**Tuesday-Saturday:** Daily logging of expenses (credit cards, ATM, digital payments) as drafts. By Friday, 8 transactions logged pending finalization.

**Sunday Evening (Ritual Moment):** Sits with chai, opens BudgetX, reviews drafts, hits "Publish Week."
- All drafts → published/final
- Savings rate calculated: **32%** (income - all expenses)
- Category breakdown: Rent ₹30K, Groceries ₹4.2K, Entertainment ₹2.8K, Others ₹3K
- Streak counter: **8-day logging streak maintained**
- Badge earned: **"Weekly Champion"** (3 consistent weeks)
- Leaderboard: Itachi 32%, Friend A 28%, Friend B 26%

**Emotional outcome:** Feels in control and clear about spending. Motivated for next week: "Cut groceries by ₹500."

### Journey 2: Itachi's Missed Publish (Edge Case - Life Happens)

**Scenario:** Week 3 gets crazy. Itachi logs daily but doesn't publish Sunday. Drafts pile up. Anxious: "Did I break my streak?"

**App Response:** Shows 11 pending transactions and reassures:
- **Current streak: 14 days** (counts logging, not publishing)
- **Gentle reminder:** "Your week is ready to publish. Tap to finalize."

**Outcome:** When he finds time to publish later, streak stays alive + savings rate updates. System proved: logging consistency (drafts) matters more than rigid publishing deadline.

**Requirement revealed:** Streaks track daily logging, not publishing. Publishing is the ritual, not the streak requirement. Keeps users engaged when life disrupts Sunday ritual.

### Journey 3: Friend A Joins (Peer User - Leaderboard Effect)

**Signup:** Itachi invites friend to compare savings rates. Friend A signs up, sets alert thresholds, logs first week.

**Week 1 Publish:** Friend A saves 28% vs. Itachi's 32%. Sees leaderboard and feels mix of achievement + motivation (not jealousy). Healthy competition.

**Weeks 2-5:** Friend A's savings rate climbs: 28% → 30% → 31% → 33%. Surpasses Itachi. Friendly competition keeps both engaged and pushing.

**Outcome:** Peer comparison on savings rates (only) drives sustained engagement. Private data remains hidden (no amounts/categories visible).

**Requirement revealed:** Friend leaderboard (savings rates only) creates motivation without privacy violation.

### Journey Requirements Summary

| Capability | Journey(s) | Key Requirement |
|-----------|-----------|-----------------|
| **Daily draft logging** | Journey 1, 2 | Log without immediate finalization |
| **Weekly publish ritual** | Journey 1 | One-action finalization of all drafts |
| **Savings rate calculation** | Journey 1 | (Income - All Expenses) / Income, real-time display |
| **Category breakdown** | Journey 1 | Visualization of spending by category |
| **Streak tracking** | Journey 1, 2 | Daily logging streaks persist through publish |
| **Achievement badges** | Journey 1 | Badges for milestones ("Weekly Champion," "30-day streak", etc.) |
| **Friend leaderboard** | Journey 3 | Compare savings rates only; amounts/details hidden |
| **Graceful skipping** | Journey 2 | Handle missed publish without breaking streak |
| **Onboarding flow** | Journey 3 | Alert threshold setup (per-category + global) |
| **Data persistence** | All | Reliable transaction storage (draft + published) |

## Innovation & Novel Patterns

### Core Innovation: Friction as Behavior Enabler

BudgetX inverts the fintech assumption: maximal automation = minimal friction = engagement failure.

**The insight:** Automated systems (auto-aggregation, auto-categorization, AI) create passive observers, not active decision-makers. Users ignore dashboards until something breaks.

**BudgetX approach:** Manual logging + weekly ritual = **forced awareness**. Logging a ₹450 coffee expense creates feeling → pattern visibility → intentional decisions → engagement (not avoidance).

**Evidence:** Itachi's use case proves it. Notion/Excel require discipline, but that discipline creates awareness. Automated fintech creates complacency.

### Behavioral Psychology Leverage

**Ritual over habit:** Daily micro-habits fade. Weekly rituals stick. Sunday evening tea ritual = human-protected moment. Gamification rewards ritual, not friction.

**Non-toxic social comparison:** Financial leaderboards create shame ("Why is Friend A saving more?"). BudgetX shows only savings rates (no amounts/categories). Result: game motivation, not judgment. Healthy competition without privacy violation.

### Validation Approach

**Hypothesis:** Manual logging + weekly ritual + gamification = faster behavior change than automated apps.

**MVP1 validation (6 months):** Zero churn, 80%+ weekly streaks, users articulate specific behavior changes from visible savings rates.

**Falsifiable:** Churn before 6 months = hypothesis fails. Clear, testable, provable.

### Risk & Fallback

**Risk:** Manual logging creates too much friction, users abandon.

**Mitigation:** If 3-4 months show low engagement, accelerate mobile launch (point-of-transaction logging reduces friction) or add optional import (CSV/lite aggregation).

**The bet:** Manual logging = awareness. Testing if true.

## Web Application Technical Requirements

BudgetX = React frontend + Spring Boot backend. MVP1 prioritizes simplicity, security, reliability (not scale). Quick deployment + maintainability.

### Cloud-Native Architecture

**Deployment:** Cloud-native, not self-hosted. Containerized (Docker), deployed to AWS/GCP/Azure.
- Managed cloud services (no server management)
- Auto-scaling disabled for MVP1 (single-instance)
- Built-in monitoring, logging, secrets management
- Easy to scale later if needed
- Cost-optimized via free/cheap tiers

### Database & Persistence

**Primary database:** PostgreSQL (cloud-managed: AWS RDS, Google Cloud SQL, or Azure Database)

**Why PostgreSQL:**
- ACID compliance (non-negotiable for financial transactions)
- Strong data integrity guarantees
- Mature ecosystem, excellent for relational data
- Transaction support for multi-step operations (e.g., publish week atomically updates multiple tables)

**Data schema approach:**
- Normalized schema: Users table, Income table, Expense table, Investment table, Categories table, Alerts table
- Transaction-based design: Publishing a week is an atomic operation (all drafts → published in one transaction)
- Audit trail: All changes logged with timestamps for financial data integrity

**Backup & disaster recovery:**
- Cloud database automated backups (enabled by default)
- Point-in-time recovery capability (for MVP1, automated daily backups are sufficient)

### Authentication & Security

**User authentication:** Email + password with HTTPS (simple, adequate for MVP1)

**Authentication flow:**
- User registers with email + password
- Password hashed with bcrypt (never stored in plaintext)
- Login returns JWT token (stateless authentication)
- All API calls require valid JWT in Authorization header
- HTTPS enforced everywhere (no HTTP)

**Session management:**
- Stateless (JWT-based, no server-side session store)
- Token expiry: 30 days (long enough for weekly ritual users, requires re-login if expired)
- Refresh token pattern (optional for MVP1, can add later)

**Data encryption:**
- Encrypted fields: Transaction amounts, transaction names (using Spring crypto)
- Server-side encryption (app encrypts/decrypts, not database)
- Encryption key stored securely in cloud secrets manager (AWS Secrets Manager, GCP Secret Manager, etc.)

**Security posture:**
- HTTPS for all communication (TLS 1.2+)
- Input validation on all API endpoints
- SQL injection prevention (using prepared statements in Spring)
- CORS configured to allow only frontend domain
- Rate limiting on authentication endpoints (prevent brute-force)

### API Design

**Architecture:** RESTful API (HTTP + JSON)

**Endpoints (MVP1):**

| Resource | HTTP Method | Endpoint | Purpose |
|----------|-------------|----------|---------|
| **Authentication** | POST | `/api/auth/register` | Create new user account |
| | POST | `/api/auth/login` | Login and get JWT token |
| **Transactions** | POST | `/api/transactions` | Create draft or published transaction |
| | GET | `/api/transactions` | List all transactions (with filters: status=draft/published) |
| | PUT | `/api/transactions/{id}` | Update draft transaction |
| | DELETE | `/api/transactions/{id}` | Delete draft transaction |
| **Weekly Publish** | POST | `/api/transactions/publish-week` | Publish all draft transactions for the week |
| **Dashboard** | GET | `/api/dashboard/summary` | Get lifetime summary (total income, spend, invested) |
| | GET | `/api/dashboard/month/{month}` | Get current month breakdown |
| **Analytics** | GET | `/api/analytics/savings-rate` | Get weekly savings rate |
| | GET | `/api/analytics/category-breakdown` | Get spending by category |
| | GET | `/api/analytics/trends` | Get monthly trends |
| **Alerts** | POST | `/api/alerts/config` | Set per-category and global alert thresholds |
| | GET | `/api/alerts/config` | Get user's alert configuration |
| | GET | `/api/alerts/check` | Check if any alerts are triggered |
| **Friends** | GET | `/api/friends` | List friend connections |
| | POST | `/api/friends/{friend-id}/connect` | Add a friend |
| | DELETE | `/api/friends/{friend-id}` | Remove a friend |
| **Leaderboard** | GET | `/api/leaderboard` | Get savings rate leaderboard with friends |

**API Response format:** JSON with consistent error handling
- Success: `{ "status": "success", "data": {...} }`
- Error: `{ "status": "error", "message": "..." }`

**Versioning:** Not needed for MVP1 (single version, no backwards compatibility concern)

### Frontend (React) Considerations

**Technology stack:**
- React with hooks (functional components)
- State management: Context API or Redux (start simple; consider upgrade if complexity grows)
- HTTP client: Axios for API calls
- Styling: Tailwind CSS (rapid UI development, consistent design)
- UI components: shadcn/ui or Material-UI (pre-built components for polish)

**Desktop-only for MVP1:** Responsive design for 1024px+ (mobile browser-friendly, but not optimized for mobile UX until Q3 2026)

**Pages:**
- Login / Register page
- Dashboard (home page, showing summary + current month + quick-add FAB)
- Transaction history page
- Weekly publish ritual page
- Analytics page (trends, category breakdown, savings rate)
- Alerts configuration page
- Friend leaderboard page
- Settings page (alert thresholds, account settings)

### Testing & Deployment

**Testing approach:**
- Unit tests: Spring Boot backend business logic (JUnit 5 + Mockito)
- Integration tests: API endpoints with test database (TestContainers + PostgreSQL)
- Frontend tests: React component tests (Jest + React Testing Library)
- Manual QA: Deploy to staging before production

**CI/CD Pipeline (GitHub Actions):**

1. **On push to main branch:**
   - Build Spring Boot JAR
   - Build React static files
   - Run unit + integration tests
   - Build Docker image
   - Push to container registry (Docker Hub or cloud registry)
   - Deploy to production cloud environment

2. **Deployment steps:**
   - Pull latest Docker image
   - Stop old container
   - Start new container with updated image
   - Run database migrations (if needed)
   - Health check (verify API is responsive)

**Database migrations:** Flyway or Liquibase (version control for schema changes)

**Monitoring:**
- Application logs: Cloud logging (CloudWatch, Stackdriver, etc.)
- Performance monitoring: Cloud APM (Application Performance Monitoring)
- Error tracking: Sentry or similar (catch exceptions in production)
- Uptime monitoring: Ping monitoring service

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approach:** Behavioral validation MVP testing hypothesis: manual logging + weekly ritual + gamification = sustained engagement + behavior change.

**Timeline:** 3-4 months (aggressive, vs. typical 6-month exploration).

**Team:** 1 backend engineer + 1 frontend engineer + 1 PM (part-time). No dedicated QA/design/DevOps (handled via CI/CD + cloud-managed services).

### MVP Feature Set (Phase 1)

Core capabilities validated through user journeys: draft/publish logging, savings rate, streaks, badges, alerts, onboarding, security.

**Logging & Data Management:**
- Daily draft + weekly publish workflow
- Predefined categories + custom creation
- Investment types: PPF, mutual funds, stocks

**Dashboard & Analytics:**
- Lifetime + month summaries (income, spend, invested)
- Savings rate calculation + visualization
- Monthly trends, category breakdown
- Quick-add FAB

**Gamification:**
- Daily logging streaks
- Achievement badges
- Dashboard prominence for engagement

**Alerts:**
- Per-category thresholds (₹X or %)
- Global monthly cap (₹X or %)
- Real-time notifications

**Onboarding:**
- Registration + alert setup + investment baseline entry
- Optional investment tracking

**User Management:**
- Email/password auth + JWT
- Account settings

**NOT in MVP1:** Friend leaderboard/comparison, recurring templates, forecasting, tax reporting, export, aggregation, mobile, multi-user.

### Post-MVP Features

**Phase 2 (Growth - Post-MVP, Timeline: Q3-Q4 2026):**
- Friend leaderboard (savings rates only, no amounts visible)
- Advanced friend comparison features
- Recurring transaction automation
- Forecasting ("If you save at this rate, you'll hit ₹X by month Y")
- Goal tracking (save ₹10L by date X)
- Advanced analytics (3/6/12 month trends, YoY comparison)
- Mobile companion app (on-the-go logging at point-of-transaction)
- CSV import for historical data
- Email notifications and reminders

**Phase 3 (Expansion & Monetization - 2027+):**
- Multi-user family accounts (shared visibility, collaborative planning)
- Tax deduction tracking and ITR-ready export
- Premium features (advanced analytics, bulk export, priority support)
- Freemium monetization model validation
- API and third-party integrations (mutual fund APIs, PPF tracking)
- Community features (spending benchmarks, challenges)
- AI-powered spending insights

### Risk Mitigation

**Manual logging friction → churn:** Optimize UX, emphasize ritual, accelerate mobile if needed by Month 3-4.

**Scope creep → delayed ship:** Lock features now, route requests to Phase 2/3.

**Validation timeline too long:** Measure engagement Month 2 + Month 4; adjust if needed.

**Security/compliance gaps:** Use cloud encryption, HTTPS + JWT, quarterly vulnerability scans.

**Team capacity exceeded:** Ruthless prioritization, use off-shelf components (Tailwind, shadcn/ui, Spring Data JPA), minimize custom code.

## Functional Requirements

### Authentication & Account Management

- **FR1:** Users can register a new account with email and password
- **FR2:** Users can login with email and password to access their account
- **FR3:** Users can view their account information and settings
- **FR4:** Users can change their password securely
- **FR5:** System automatically logs out inactive users after token expiry
- **FR6:** Users remain authenticated across multiple app sessions via JWT token

### Transaction Logging & Management

- **FR7:** Users can create a new expense transaction and save it as a draft
- **FR8:** Users can create a new income entry and save it as a draft
- **FR9:** Users can create an investment transaction and save it as a draft
- **FR9a:** Users can enter initial investment balances during onboarding for each investment type (PPF, mutual funds, stocks)
- **FR9b:** System displays current investment value (initial balance + additions - withdrawals) on the dashboard
- **FR9c:** System tracks investment transactions (additions/withdrawals) separately from initial balance to show growth
- **FR9d:** Users can add or update investment balances at any time after onboarding (not limited to onboarding flow)
- **FR10:** Users can select from predefined expense categories or create custom categories
- **FR11:** Users can categorize investment transactions by type (PPF, mutual funds, stocks)
- **FR12:** Users can view all their transactions (both draft and published)
- **FR13:** Users can edit a draft transaction before publishing
- **FR14:** Users can delete a draft transaction before publishing
- **FR15:** Users can edit or delete a published transaction within 1 month of the transaction entry date to correct genuine errors (amounts, category, notes)
- **FR16:** Users can view transaction amount, category, date, and notes for each entry

### Weekly Publishing Ritual

- **FR17:** Users can publish all drafted transactions for the current week in a single action
- **FR18:** System converts all transactions to permanent/final state upon publish
- **FR19:** System prevents editing transactions from more than 1 month ago after they've been published, to maintain historical accuracy for periods beyond the current month
- **FR20:** System resets draft transaction list after weekly publish for the next week's entries

### Dashboard & Financial Summary

- **FR21:** Users can view their lifetime financial summary (total income, total expenses, total invested)
- **FR22:** Users can view current month financial breakdown by expense category
- **FR23:** Users can view current month's total income, total expenses, and running savings rate
- **FR24:** Users can access a quick-add button to rapidly create new transactions

### Analytics & Insights

- **FR25:** System calculates weekly savings rate as (total income - total expenses) / total income for each week; investments are tracked separately and NOT included in savings rate calculation
- **FR26:** Users can view their savings rate displayed as a percentage each week after publishing
- **FR27:** Users can view monthly spending trends across previous months (visual graph)
- **FR28:** Users can see spending distribution broken down by category (current month)
- **FR29:** Users can view historical spending patterns to identify trends
- **FR29a:** System provides month-over-month spending pattern comparison showing category-level changes to help users identify behavior change trends

### Gamification & Engagement

- **FR30:** System automatically tracks daily transaction logging streaks (one day = consecutive day with at least one draft entry, regardless of transaction count)
- **FR31:** Users can view their current streak count on the dashboard
- **FR32:** System maintains streak count even if a week is not published (only logging consistency matters); streak resets weekly on Sunday after publish
- **FR33:** System awards achievement badges for milestones (e.g., "Weekly Champion," "30-day streak")
- **FR34:** Users can view their badge collection on the dashboard
- **FR35:** Users can see badge descriptions and unlock conditions
- **FR36:** System displays streak and badge count prominently on user dashboard

### Alerts & Budget Thresholds

- **FR37:** System prompts users during onboarding to set up alert thresholds
- **FR38:** Users can define per-category spending alert thresholds using EITHER a fixed amount (₹X) OR a percentage of average (Y%), but not both simultaneously
- **FR39:** Users can define a global monthly spending cap alert threshold using EITHER a fixed amount (₹X) OR a percentage of average income (Y%)
- **FR40:** Users can view their current alert configuration
- **FR41:** Users can modify alert thresholds after initial setup
- **FR42:** System monitors spending against configured alert thresholds in real-time
- **FR43:** System notifies users when a category-specific threshold is exceeded
- **FR44:** System notifies users when global monthly spending cap is exceeded
- **FR45:** Users can dismiss or clear alert notifications

### Friend Management

- **FR46:** Users can add a friend by entering their email address
- **FR47:** Users can view a list of their added friends
- **FR48:** Users can remove a friend from their friend list
- **FR49:** System displays friend name or identifier once connection is established
- **FR50:** System stores friend relationships to enable future leaderboard and comparison features (Phase 2)

### Onboarding & Setup

- **FR51:** System guides users through registration, investment balance entry, and alert threshold setup in a structured onboarding flow
- **FR52:** Users can skip optional investment balance entry if they don't invest
- **FR53:** System requires investment balance entry if user selects investment types

### Data Security & Persistence

- **FR54:** System encrypts sensitive transaction data (amounts and transaction names) at rest
- **FR55:** System enforces HTTPS for all user data transmission
- **FR56:** System validates all user inputs to prevent injection attacks
- **FR57:** System maintains data persistence and prevents loss during system failures
- **FR58:** Users cannot access other users' transaction data or account information
- **FR59:** System prevents unauthorized API access by requiring valid JWT authentication

---

**Functional Requirements Summary:**
- **Total FRs: 61** (validated through party mode review with Mary, Sally, Winston, John)
- **Status:** Locked. This is the binding capability contract for all downstream work—every feature in MVP1 must trace to these requirements.
- **Party Mode Refinements:** Incorporated feedback on behavioral change measurement, savings rate definition (excludes investments), streak logic clarity (1 day/day), alert threshold flexibility (either/or), and investment baseline tracking (MVP1).

## Non-Functional Requirements

### Performance

**Dashboard & Navigation:**
- Dashboard summary page loads completely within 1 second (measured from initial request to fully rendered, on 4G network conditions)
- Category breakdown visualization renders within 1 second
- Transaction history page loads within 1 second

**Critical Operations:**
- Weekly publish ritual completes within 500 milliseconds (all draft transactions finalized in one atomic operation)
- Quick-add FAB transaction creation form opens within 200 milliseconds
- Transaction editing and deletion operations complete within 500 milliseconds

**Analytics Rendering:**
- Monthly spending trends chart generates and displays within 1 second
- Savings rate calculations complete and display within 500 milliseconds

### Security

**OWASP Top 10 (2025) Compliance:**
- **Injection Prevention (A03:2025):** All user inputs validated and parametrized; prepared statements used for all database queries; no concatenated SQL
- **Authentication Security (A07:2025):** Passwords hashed with bcrypt (minimum 12 rounds); JWT tokens issued with 30-day expiry; authentication endpoints rate-limited (max 5 failed attempts per 15 minutes)
- **Sensitive Data Exposure (A02:2025):** Transaction amounts and names encrypted at rest using AES-256; encryption keys stored in cloud secrets manager, never in code; HTTPS (TLS 1.2+) enforced for all communication
- **Access Control (A01:2025):** Users can only access their own data; API endpoints validate user ownership of resources before returning or modifying data; no account enumeration attacks possible
- **Data Integrity & Encryption:** All encrypted fields remain encrypted end-to-end; encryption keys rotated yearly
- **Error Handling:** System logs errors securely without exposing sensitive information in error messages; stack traces never displayed to users
- **API Security:** CORS configured to allow only frontend domain; X-Frame-Options header prevents clickjacking; CSP headers configured; no secrets in logs

**Authentication Standards:**
- Password strength minimum: 8 characters
- Session expiry: Inactive users logged out after token expiry (30 days)
- Password reset via email with secure token (one-time use, 24-hour expiry)

**Third-Party Security:**
- Dependent libraries scanned for vulnerabilities quarterly
- Security patches applied within 30 days of disclosure

### Reliability & Availability

**Uptime & Availability:**
- System achieves 99.9% uptime over a rolling 30-day period (~43 minutes downtime/month acceptable)
- Planned maintenance windows scheduled outside peak usage hours (evening India time, 10 PM - 6 AM IST)
- Incident response target: Critical issues (data loss, auth failure) resolved within 4 hours

**Data Persistence & Backup:**
- All user transactions persist reliably without data loss
- Automated daily backups of PostgreSQL database (cloud-managed, default retention)
- Point-in-time recovery capability enabled (recover to any point within 7 days)
- Database redundancy via cloud provider failover (geo-replicated if available on selected cloud)

**System Recovery:**
- Deployed service health checks every 30 seconds; automatic restart if unhealthy
- Database connection pooling prevents connection exhaustion
- Graceful shutdown: in-flight transactions complete before shutdown
- Circuit breakers on external service calls (Phase 2+) to prevent cascade failures

### Browser & Device Support

**Primary Browser:**
- Chrome (latest 2 versions) fully supported
- Secondary support: Safari, Firefox (latest versions) on desktop
- Minimum screen resolution: 1024px width
- Mobile browser compatibility: Responsive design supports down to 768px width (tablet minimum)

**Network Conditions:**
- Tested on 4G connection speeds (minimum 5 Mbps)
- Graceful degradation on slower connections (no blocking assets; progressive enhancement)

---

**Non-Functional Requirements Summary:**
- **Total NFR Areas: 4** (Performance, Security, Reliability, Browser Support)
- **Status:** Locked. These NFRs specify how well the system must perform against the functional requirements.
- **OWASP Compliance:** Full Top 10 (2025) compliance for security posture
