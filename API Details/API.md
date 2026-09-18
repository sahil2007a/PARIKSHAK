# PARISHAK REST API Reference (v1)
### "Practice. Prove. Protect."

Base URL: `http://localhost:5000/api/v1`

---

## 1. Health & Readiness
- `GET /health`: Safe service and database connection status check.
- `GET /ready`: Production readiness probe (returns 200 READY if MongoDB is connected, 503 if disconnected).

---

## 2. Authentication (`/api/v1/auth`)
- `POST /register`: Initiate 2-step worker registration (creates `PendingRegistration`, returns registrationId).
- `POST /verify-registration`: Submit 6-digit OTP, create active `User`, return access + refresh tokens.
- `POST /resend-verification`: Resend OTP (60s cooldown).
- `POST /login`: Authenticate with `identifier` + `password`, create `Session`.
- `POST /refresh`: Rotate refresh token and receive fresh access token.
- `POST /logout`: Revoke active session.
- `POST /logout-all`: Revoke all sessions for user.
- `POST /forgot-password`: Request temporary password reset token.
- `POST /reset-password`: Reset password with token and revoke existing sessions.
- `GET /me`: Get authenticated user profile.

---

## 3. User Profile (`/api/v1/profile` or `/api/v1/users/profile` or `/api/v1/users/me`)
- `GET /`: Retrieve authenticated worker's complete profile with organization info.
- `PATCH /`: Update safe profile details (`fullName`, `phone`, `jobRole`, `experienceYears`, `preferredLanguage`, `avatarUrl`). Protected identity fields (`workerId`, `role`, `status`, `organizationId`) are strictly immutable.
- `POST /change-password`: Change password and terminate other active sessions.

---

## 4. Modules & Curriculum (`/api/v1/modules` or `/api/v1/training`)
- `GET /`: Retrieve published training modules with multilingual titles and descriptions.
- `GET /:id`: Retrieve specific module with lessons, competencies, and passing score.

---

## 5. Assessments & Scoring (`/api/v1/assessments`)
- `GET /module/:id`: Retrieve assessment questions (with internal answers sanitized).
- `POST /:id/submit`: Server-side authoritative scoring evaluation, competency breakdown, pass/fail determination, and automatic cryptographic certificate issuance. Returns `PRS-MIN-YYYY-XXXX` certificate serial upon passing.
- `GET /results/:id`: Retrieve detailed competency score breakdown.

---

## 6. Training Progress & Offline Sync (`/api/v1/sync` or `/api/v1/progress/sync`)
- `GET /progress`: Retrieve worker's overall training completion percentage, competency breakdown, and recent attempts.
- `POST /progress/lesson`: Update lesson completion status.
- `POST /sync`: Batch sync offline mobile queue items with idempotency key deduplication.
  - Supports `ASSESSMENT_ATTEMPT` (evaluates and issues certificate)
  - Supports `PROFILE_UPDATE` (syncs offline edited profile)
  - Supports `AR_DRILL_TELEMETRY` (records real camera AR drill duration, safety compliance, and score)
  - Supports `LESSON_PROGRESS` (marks offline lessons completed)

---

## 7. Certificates & Public QR Verification (`/api/v1/certificates`)
- `GET /`: List worker's valid and historical certificates.
- `GET /:id`: Retrieve certificate details and QR code data URL by ObjectId or serial (`PRS-MIN-2026-XXXX`). Protected by worker ownership check.
- `GET /verify/:identifier`: **Public** verification endpoint by SHA-256 cryptographic token or certificate ID. Returns `VALID`, `EXPIRED`, `REVOKED`, or `NOT_FOUND` with masked worker ID (`MIN-****-910`).

---

## 8. Admin & Compliance Management (`/api/v1/admin`)
- `GET /dashboard`: Real database-aggregated compliance metrics, expiring certificates, monthly activity, and real `arDrillStats` (pass rate, avg drill time, intercepted spatial violations).
- `GET /workers`: Search, filter, and paginate workers with training statuses.
- `GET /workers/:id`: Inspect individual worker record with attempt histories.
- `PATCH /workers/:id/status`: Suspend or reactivate worker account.
- `GET /certificates`: Admin certificate directory.
- `PATCH /certificates/:id/revoke`: Revoke certificate with mandatory audit reason.
- `GET /audit-logs`: Immutable regulatory audit log timeline.
