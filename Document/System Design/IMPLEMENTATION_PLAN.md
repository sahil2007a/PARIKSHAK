# PARISHAK ("Practice. Prove. Protect.")
## Production Backend, MongoDB Database Layer & Full-Stack Integration Plan

---

## 1. Executive Summary & Audit Findings

### What Already Works
- **Monorepo Architecture**: Clean separation into `apps/mobile`, `apps/admin`, `backend`, and `shared`.
- **Shared Package**: TypeScript interfaces, enums (`USER_ROLES`, `SECTORS`, `USER_STATUS`), and localized schema seeds.
- **Backend API Structure**: Express 4 server with rate-limiting, Helmet security headers, CORS origin management, Vitest test suite, and crypto QR utilities.
- **Interactive Scenarios & Assessments Engine**: Full 5-module safety curriculum (Fire & Explosion, Gas Leak & Confined Space, LOTO, PPE, Emergency Evacuation).

### Identified Deficiencies & Required Refactoring
1. **User Registration Bypass**: Registration currently creates an `ACTIVE` User document immediately upon submission without pending verification or OTP checks.
2. **Missing Collections**: Needs dedicated `PendingRegistration`, `Session` (stateful refresh token rotation), `TrainingProgress`, and normalized indexes.
3. **API Routing & Versioning**: Endpoints must be strictly unified under `/api/v1/` routes.
4. **Database Connection Configuration**: Standardize multi-host non-SRV connection strings (`database.ts`) with robust reconnection logic, graceful shutdown, and zero secret logging.
5. **Role-Based Access Control**: Strict backend route guarding ensuring `WORKER` roles are rejected with `403 FORBIDDEN` when accessing any `/api/v1/admin/*` endpoint.
6. **Admin & Mobile Integration**: Connect frontend state directly to real MongoDB endpoints.

---

## 2. 16-Phase Implementation Roadmap

### Phase 1: Repository Audit & Architecture Baseline
- Complete audit of all files across `backend`, `apps/admin`, `apps/mobile`, and `shared`.
- Establish `docs/ARCHITECTURE.md` and `docs/IMPLEMENTATION_PLAN.md`.

### Phase 2: Environment & Robust MongoDB Connection (`backend/src/config/database.ts`)
- Mongoose singleton connection management.
- Multi-host standard non-SRV connection support.
- Connection event listeners (`connected`, `disconnected`, `error`, `reconnected`).
- Graceful shutdown handling (`SIGINT`, `SIGTERM`).
- Masked logging preventing URI credential leakage.

### Phase 3: Database Models & Indexes
- Models: `User`, `PendingRegistration`, `Organization`, `TrainingModule`, `Lesson`, `Assessment`, `AssessmentAttempt`, `TrainingProgress`, `TrainingSession`, `Certificate`, `Notification`, `AuditLog`, `Session`.
- Performance compound indexes:
  - `User`: `{ workerId: 1 }`, `{ email: 1 }`, `{ phone: 1 }`, `{ organizationId: 1, status: 1 }`
  - `PendingRegistration`: `{ workerId: 1 }`, `{ email: 1 }`, `{ phone: 1 }`, `{ otpExpiresAt: 1 }`
  - `TrainingProgress`: `{ userId: 1, moduleId: 1 }` (unique compound)
  - `AssessmentAttempt`: `{ userId: 1, moduleId: 1, createdAt: -1 }`, `{ idempotencyKey: 1 }`
  - `Certificate`: `{ certificateId: 1 }`, `{ verificationTokenHash: 1 }`
  - `Session`: `{ sessionId: 1 }`, `{ userId: 1, isRevoked: 1 }`

### Phase 4: PendingRegistration & Two-Step Verification Flow
- Cryptographic 6-digit OTP generation (`crypto.randomInt`).
- SHA-256 OTP hashing before storage.
- Rate limits on resend (60-second cooldown) and max attempt enforcement (3 attempts).
- `POST /api/v1/auth/register` -> Creates `PendingRegistration`, sends OTP, returns registration ID (NO User created).
- `POST /api/v1/auth/verify-registration` -> Validates OTP hash, creates active `User`, deletes `PendingRegistration`, generates `Session` and JWT tokens.
- `POST /api/v1/auth/resend-verification` -> Re-generates and re-dispatches OTP.

### Phase 5: Authentication & JWT Management
- Short-lived Access Token (15m) + Long-lived Refresh Token (7d).
- Dedicated `Session` collection storing `sessionId`, `refreshTokenHash`, `ipAddress`, `userAgent`.
- Refresh token rotation on `POST /api/v1/auth/refresh`.
- Token reuse detection: Invalidates all user sessions if a stale/compromised token is reused.
- `POST /api/v1/auth/logout` and `POST /api/v1/auth/logout-all`.

### Phase 6: User & Profile Management
- `GET /api/v1/users/me` & `PATCH /api/v1/users/me`.
- Strict data isolation ensuring workers cannot access or alter roles, status, or other workers' data.

### Phase 7: Training & Progress Engine
- `GET /api/v1/training/modules` & `GET /api/v1/training/modules/:id`.
- `POST /api/v1/training/progress` -> Record lesson completion, update progress percentage.

### Phase 8: Assessment & Server-Side Scoring
- `POST /api/v1/assessments/:id/submit` -> Server evaluates answers, calculates percentage, checks pass/fail mark (80%), calculates domain competency scores (`safetyCompliance`, `hazardRecognition`, `procedure`, `decisionMaking`).

### Phase 9: Dynamic Certificate Issuance & QR Verification
- Automatic certificate generation on passing assessment.
- Cryptographic certificate ID (`PRK-2026-XXXXXXXX`) and verification token hash.
- `GET /api/v1/certificates/verify/:id` public verification endpoint.

### Phase 10: Role-Based Authorization & Admin Backend
- `requireRole('ADMIN', 'SUPER_ADMIN')` middleware.
- Admin endpoints: `/api/v1/admin/dashboard/stats`, `/api/v1/admin/workers`, `/api/v1/admin/modules`, `/api/v1/admin/certificates/revoke`, `/api/v1/admin/audit-logs`.

### Phase 11: Admin Panel Live Frontend Integration
- Hook up `apps/admin` UI components directly to backend `/api/v1/admin` endpoints.

### Phase 12: Mobile Client Live Integration
- Update `apps/mobile/services/api.ts` to consume `/api/v1` routes and handle the 2-step OTP flow.

### Phase 13: Security Hardening & Rate Limiting
- Strict CORS origin whitelisting.
- Helmet security headers.
- Request payload size boundaries (10MB).
- Centralized error handler preventing stack trace leakages in production.

### Phase 14: Comprehensive Verification & Test Suite
- Vitest end-to-end integration tests covering all 30 test requirements (registration, OTP, login, RBAC, tokens, scoring, certificates).

### Phase 15: Documentation & Deployment Handover
- Updated `README.md`, `docs/ARCHITECTURE.md`, `docs/AUTHENTICATION.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/SECURITY.md`, and `docs/TESTING.md`.
