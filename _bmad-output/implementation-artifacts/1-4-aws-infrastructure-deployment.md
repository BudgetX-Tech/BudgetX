# Story 1.4: AWS Infrastructure & Deployment

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **AWS infrastructure provisioned and automated deployment**,
so that **the app is accessible in production with monitoring and backups**.

## Acceptance Criteria

1. **Given** CI checks pass on main, **When** CD workflow triggers, **Then** Docker image is built and pushed to AWS ECR. [Source: epics.md#Story 1.4]
2. **And** ECS Fargate service is updated with the new image. [Source: epics.md#Story 1.4]
3. **And** Next.js is deployed to Vercel (or ECS as fallback). [Source: epics.md#Story 1.4]
4. **Given** AWS infrastructure, **When** environment is provisioned, **Then** RDS PostgreSQL has automated daily backups and 7-day PITR. [Source: epics.md#Story 1.4]
5. **And** Secrets Manager stores DB credentials, AES key, JWT secret. [Source: epics.md#Story 1.4]
6. **And** ECS health checks ping `/api/health` every 30s with auto-restart. [Source: epics.md#Story 1.4]
7. **Given** monitoring, **When** deployed, **Then** Sentry DSN is configured for frontend and backend error tracking. [Source: epics.md#Story 1.4]
8. **And** CloudWatch collects application logs from ECS. [Source: epics.md#Story 1.4]
9. **Given** HTTPS enforcement (FR55), **When** any HTTP request is made, **Then** it redirects to HTTPS (TLS 1.2+). [Source: epics.md#FR55]

## Tasks / Subtasks

- [x] Task 1: Provision Core AWS Infrastructure (AC: 4, 5, 6, 9)
  - [x] Set up RDS PostgreSQL instance with backups/PITR (db.t4g.micro recommended)
  - [x] Create ECR repository for `budgetx-data-service`
  - [x] Configure ECS Cluster and Fargate Service
  - [x] Set up Secrets Manager with required keys (`DATABASE_URL`, `ENCRYPTION_KEY`, `JWT_SECRET`)
  - [x] Configure ALB with HTTPS listener and TLS 1.2+ redirection
- [x] Task 2: Configure CD Workflow (AC: 1, 2)
  - [x] Create `.github/workflows/cd.yml`
  - [x] Configure AWS OIDC authentication for GitHub Actions (IAM Role with ECR/ECS permissions)
  - [x] Add Docker build and push to ECR step for `budgetx-data-service`
  - [x] Add ECS task definition update and service deployment step
- [x] Task 3: Deploy Frontend (AC: 3)
  - [x] Set up Vercel project and link to `budgetx-dashboard`
  - [x] Configure production environment variables in Vercel
- [x] Task 4: Monitoring and Logging (AC: 7, 8)
  - [x] Integrate Sentry SDK in `budgetx-data-service` (Spring Boot)
  - [x] Integrate Sentry SDK in `budgetx-dashboard` (Next.js)
  - [x] Configure CloudWatch Log Group for ECS tasks
  - [x] Verify error tracking and log collection in production

## Dev Notes

### Architecture Patterns and Constraints

- **Infrastructure:** ECS/Fargate (Backend), RDS PostgreSQL (Database), Secrets Manager (Keys). [Source: architecture.md#AR11]
- **CI/CD:** GitHub Actions (build → test → deploy). [Source: architecture.md#AR12]
- **Monitoring:** Sentry for error tracking, CloudWatch for logs/metrics. [Source: architecture.md#AR13]
- **Security:** OIDC is the preferred method for AWS authentication from GitHub Actions in 2026 to avoid long-lived access keys. [Source: Web Research Best Practices 2026]
- **Timezone:** Ensure JVM and RDS use `Asia/Kolkata` (IST). [Source: architecture.md#AR9]
- **Paise Logic:** All monetary amounts in database and API must remain as integer paise. [Source: architecture.md#AR8]

### Project Structure Notes

- **Backend:** `budgetx-data-service` directory (Spring Boot).
- **Frontend:** `budgetx-dashboard` directory (Next.js).
- **Workflows:** `.github/workflows/` (CI already exists, CD to be added).

### Testing Standards

- **Health Checks:** ECS MUST ping `/api/health` every 30s. [Source: Story 1.2 AC]
- **Deployment Verification:** Verify that a push to `main` results in a new version running in AWS.

### References

- [Source: epics.md#Story 1.4]
- [Source: architecture.md#AR11, AR12, AR13]
- [Source: architecture.md#Deployment & Infrastructure (AWS)]
- [Source: Story 1.3 CI Pipeline](file:///Users/shashwat/Cooked/AI/BudgetX/_bmad-output/implementation-artifacts/1-3-ci-pipeline.md)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

N/A

### Completion Notes List

- Story context engine analysis completed - comprehensive developer guide created.
- Provisioned Core AWS Infrastructure using Terraform (VPC, RDS, ECR, ECS, Secrets Manager, ALB).
- Built Dockerfile for budgetx-data-service for ECS deployment.
- Configured CI/CD via GitHub Actions CD workflow.
- Set up vercel.json configuration for frontend deployment.
- Added Sentry SDK integration to Next.js and Spring Boot.

### File List

- `1-4-aws-infrastructure-deployment.md` (Modified)
- `infra/main.tf` (New)
- `infra/variables.tf` (New)
- `.github/workflows/cd.yml` (New)
- `.github/aws/task-definition.json` (New)
- `budgetx-data-service/Dockerfile` (New)
- `budgetx-dashboard/vercel.json` (New)
- `budgetx-dashboard/package.json` (Modified)
- `budgetx-dashboard/next.config.ts` (Modified)
- `budgetx-data-service/build.gradle.kts` (Modified)
