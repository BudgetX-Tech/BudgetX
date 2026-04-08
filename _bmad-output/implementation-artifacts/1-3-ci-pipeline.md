# Story 1.3: CI Pipeline

Status: done

## Story

As a **developer**,
I want automated build and test pipelines,
So that every push is validated before deployment.

## Acceptance Criteria

1. **Given** a push to main branch, **When** GitHub Actions CI workflow triggers, **Then** it builds Spring Boot JAR (Gradle `build`) and Next.js production bundle (`npm run build`).

2. **Given** the CI pipeline, **When** it runs, **Then** it executes backend unit tests (JUnit5) and frontend linting + type checking.

3. **Given** any step in the pipeline, **When** that step fails, **Then** the pipeline fails fast and stops subsequent steps.

4. **Given** a Pull Request, **When** CI checks pass, **Then** it satisfies the status check requirement for merging (Story 1.4 CD triggers on merge to main).

## Tasks / Subtasks

- [x] Task 1: Create GitHub Actions workflow file
  - [x] Create `.github/workflows/ci.yml` in the project root
  - [x] Define `on: [push, pull_request]` triggers for `main` branch

- [x] Task 2: Configure Backend CI Job
  - [x] Use `ubuntu-latest` runner
  - [x] Set up Java 25 (LTS) using `actions/setup-java`
  - [x] Implement Gradle dependency caching
  - [x] Run `./gradlew build` in `budgetx-backend` directory
  - [x] Ensure tests are executed as part of the build

- [x] Task 3: Configure Frontend CI Job
  - [x] Use `ubuntu-latest` runner
  - [x] Set up Node.js 22 (LTS) using `actions/setup-node`
  - [x] Implement npm dependency caching
  - [x] Run `npm ci` in `budgetx-frontend`
  - [x] Run `npm run lint` and `npm run type-check` (if configured)
  - [x] Run `npm run build` to verify production bundle

- [x] Task 4: Pipeline Optimization & Fail Fast
  - [x] Ensure `jobs` run in parallel where possible (Backend and Frontend can be separate jobs)
  - [x] Verify that a failure in either job marks the workflow as failed

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Pro)

### Implementation Notes

- **Parallelization**: Implement separate jobs (`backend-ci` and `frontend-ci`) to allow for maximum speed and clearer failure isolation.
- **Caching**: Applied Gradle and npm caching to significantly reduce build times for subsequent runs.
- **Fail-Fast**: Configured the workflow to trigger on both `push` and `pull_request` to ensure every codebase change is validated.
- **Consistency**: Used exactly Java 25 (LTS) and Node 22 (LTS) to match the project's architectural standards.

### File List

- `.github/workflows/ci.yml` (New)

### Change Log

- 2026-04-06: Created initial CI workflow.

### Status: review

### Architecture Compliance

**CI/CD Pipeline:** GitHub Actions (build → test → deploy).
[Source: architecture.md#AR12]

**Testing Frameworks:**
- Backend: JUnit 5
- Frontend: Linting + Build check (Playwright/Jest tests added in Story 1.6)
[Source: architecture.md#AR14]

### Technical Specifics

- **Java Version:** 25 LTS (Released Sept 2025). Ensure the action uses exactly this version.
- **Node Version:** 22.x LTS recommended for Next.js 16.
- **Gradle Wrapper:** Always use `./gradlew` from the backend directory to ensure version consistency.
- **Next.js Build:** Turbopack is the default for Next.js 16 development, but production build (`npm run build`) uses the standard optimized compiler.

### Workflow File Structure (`.github/workflows/ci.yml`)

```yaml
name: BudgetX CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: budgetx-backend
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 25
        uses: actions/setup-java@v4
        with:
          java-version: '25'
          distribution: 'temurin'
          cache: 'gradle'
      - name: Build with Gradle
        run: ./gradlew build

  frontend-ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: budgetx-frontend
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: budgetx-frontend/package-lock.json
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
```

### Anti-Patterns to Avoid

1. **Do NOT skip tests in CI.** Never use `-x test` in the gradle command.
2. **Do NOT use `npm install`.** Use `npm ci` for deterministic builds in CI environments.
3. **Do NOT hardcode secrets.** Use GitHub Actions Secrets for any sensitive values (though CI usually doesn't need them yet).
4. **Do NOT combine BE and FE into a single serial job.** Running them in parallel jobs is faster and provides clearer failure reporting.

### Testing Requirements

- Verify workflow triggers on push/PR.
- Verify Backend job passes with green tests.
- Verify Frontend job passes linting and build.
- Verify that a syntax error in either repo fails the pipeline.

### References

- [Source: architecture.md#AR12] — GitHub Actions CI/CD requirement
- [Source: epics.md#Story 1.3] — Acceptance criteria for CI
- [Source: architecture.md#Starter Template Selection] — Java 25 and Next.js 16 versions

### Review Findings

- [x] [Review][Patch] Missing Build Artifact Upload [.github/workflows/ci.yml:25]
- [x] [Review][Patch] Missing Test Report Visibility [.github/workflows/ci.yml:25]
- [x] [Review][Patch] Missing Concurrency Control [.github/workflows/ci.yml:1]
- [x] [Review][Patch] Missing Next.js Build Cache [.github/workflows/ci.yml:45]
- [x] [Review][Patch] Uncertain `type-check` Script [.github/workflows/ci.yml:50]
- [x] [Review][Defer] Hardcoded Working Directories [.github/workflows/ci.yml:12] — deferred, structural change
