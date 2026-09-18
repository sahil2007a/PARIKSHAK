# PARISHAK System Architecture & Engineering Specification
### "Practice. Prove. Protect."

---

## 1. System Overview & Monorepo Topology

```
+-----------------------------------------------------------------------------------+
|                                  PARISHAK MONOREPO                                |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +---------------------------+              +----------------------------------+  |
|  |     apps/mobile           |              |           apps/admin             |  |
|  | (React Native / Expo 57)  |              |    (React 18 + Vite + Tailwind)  |  |
|  |                           |              |                                  |  |
|  | • Offline Storage / Sync  |              | • Real-time Compliance Monitor   |  |
|  | • 2D Interactive Drill    |              | • Worker Lifecycle & RBAC        |  |
|  | • Localized UI (EN/HI/SAT)|              | • Module / Assessment Authoring  |  |
|  | • Field QR Verifier       |              | • Certificate Revocation/Audit   |  |
|  +-------------+-------------+              +-----------------+----------------+  |
|                |                                              |                   |
|                | HTTP REST (JSON)                             | HTTP REST (JSON)  |
|                | /api/v1/auth, /training, /progress, /sync    | /api/v1/admin/*   |
|                |                                              |                   |
|                +----------------------+-----------------------+                   |
|                                       |                                           |
|                                       v                                           |
|                     +-----------------------------------+                         |
|                     |              backend              |                         |
|                     |    (Express 4 + TypeScript +      |                         |
|                     |          Mongoose 8)              |                         |
|                     +-----------------+-----------------+                         |
|                                       |                                           |
|                                       | MongoDB Wire Protocol                     |
|                                       | (Non-SRV ReplicaSet / Single Connection)  |
|                                       v                                           |
|                     +-----------------------------------+                         |
|                     |        MongoDB Database           |                         |
|                     |  (ReplicaSet / Multi-Host / Atlas)|                         |
|                     +-----------------------------------+                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             shared (@parishak/shared)                       |  |
|  |  • Domain Entities & Enums  • Zod Validation Schemas  • API Contracts       |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Database Architecture & Collections Design

All entities are segregated into dedicated, normalized Mongoose collections with strict typing and query-optimized indexes:

```
                                  +-------------------+
                                  |   Organization    |
                                  +---------+---------+
                                            |
                         +------------------+------------------+
                         | 1                                   | 1
                         v *                                   v *
               +-------------------+                 +-------------------+
               |PendingRegistration|                 |       User        |
               +-------------------+                 +---------+---------+
                                                               |
                       +-------------------+-------------------+-------------------+
                       | 1                 | 1                 | 1                 | 1
                       v *                 v *                 v *                 v *
               +---------------+   +---------------+   +---------------+   +---------------+
               |    Session    |   |TrainingProg...|   |AssessAttempt  |   |  Certificate  |
               +---------------+   +-------+-------+   +-------+-------+   +-------+-------+
                                           |                   |                   |
                                           +---------+---------+                   |
                                                     |                             |
                                                     v *                           v *
                                           +-------------------+           +---------------+
                                           |  TrainingModule   |           |   AuditLog    |
                                           +---------+---------+           +---------------+
                                                     |
                                           +---------+---------+
                                           | 1                 | 1
                                           v *                 v *
                                     +-----------+       +------------+
                                     |  Lesson   |       | Assessment |
                                     +-----------+       +------------+
```

### Collection Schemas & Index Strategy

1. **`organizations`** (`Organization.ts`)
   - Fields: `name`, `code` (unique), `sector` (`MINING`, `STEEL`, `MICA`, `GENERAL`), `location`, `status` (`ACTIVE`, `INACTIVE`), `activeWorkersCount`, `createdAt`, `updatedAt`.
   - Index: `{ code: 1 }` (unique), `{ name: 1 }`.

2. **`pendingRegistrations`** (`PendingRegistration.ts`)
   - Fields: `fullName`, `workerId` (unique), `phone`, `email`, `passwordHash`, `organizationId` (ref), `organizationName`, `sector`, `jobRole`, `experienceYears`, `preferredLanguage`, `otpHash`, `otpExpiresAt`, `otpAttempts`, `maxOtpAttempts`, `resendCount`, `lastResentAt`, `status` (`PENDING`, `VERIFIED`, `EXPIRED`, `BLOCKED`), `createdAt`, `updatedAt`, `verifiedAt`.
   - Indexes: `{ workerId: 1 }`, `{ email: 1 }`, `{ phone: 1 }`, `{ otpExpiresAt: 1 }` (TTL / cleanup).

3. **`users`** (`User.ts`)
   - Fields: `workerId` (unique), `fullName`, `phone`, `email` (sparse unique), `passwordHash`, `organizationId` (ref), `sector`, `jobRole`, `experienceYears`, `preferredLanguage`, `role` (`WORKER`, `ADMIN`, `SUPER_ADMIN`), `status` (`PENDING`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`), `avatarUrl`, `isEmailVerified`, `isPhoneVerified`, `lastLoginAt`, `lastActiveAt`, `createdAt`, `updatedAt`, `deletedAt`.
   - Indexes: `{ workerId: 1 }` (unique), `{ email: 1 }` (sparse unique), `{ phone: 1 }`, `{ organizationId: 1, status: 1 }`, `{ role: 1 }`.

4. **`sessions`** (`Session.ts`)
   - Fields: `sessionId` (unique UUID), `userId` (ref User), `refreshTokenHash` (SHA-256), `ipAddress`, `userAgent`, `expiresAt`, `revokedAt`, `isRevoked`, `lastUsedAt`, `createdAt`, `updatedAt`.
   - Indexes: `{ sessionId: 1 }` (unique), `{ userId: 1, isRevoked: 1 }`, `{ expiresAt: 1 }` (TTL).

5. **`trainingModules`** (`TrainingModule.ts`)
   - Fields: `moduleId` (unique number/string), `title` (localized), `description` (localized), `category`, `sector`, `difficulty`, `estimatedDurationMinutes`, `passingScore`, `iconName`, `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`), `lessonsCount`, `createdAt`, `updatedAt`.
   - Indexes: `{ moduleId: 1 }` (unique), `{ sector: 1, status: 1 }`, `{ category: 1 }`.

6. **`lessons`** (`Lesson.ts`)
   - Fields: `lessonId` (unique), `moduleId` (ref), `order`, `title` (localized), `summary` (localized), `durationMinutes`, `keySafetyPoints`, `checklist`, `createdAt`, `updatedAt`.
   - Indexes: `{ moduleId: 1, order: 1 }`.

7. **`assessments`** (`Assessment.ts`)
   - Fields: `assessmentId` (unique), `moduleId` (ref), `title` (localized), `passingScore`, `timeLimitMinutes`, `maxAttempts`, `questions` (array of `questionId`, `type`, `prompt`, `options`, `correctAnswer`, `competencyDomain`), `createdAt`, `updatedAt`.
   - Indexes: `{ assessmentId: 1 }` (unique), `{ moduleId: 1 }`.

8. **`assessmentAttempts`** (`AssessmentAttempt.ts`)
   - Fields: `attemptId` (unique), `userId` (ref), `assessmentId` (ref), `moduleId` (ref), `answers`, `score`, `totalPoints`, `percentage`, `passed`, `timeTakenSeconds`, `competencyScores` (`knowledge`, `recognition`, `decisionMaking`, `procedure`, `safetyCompliance`, `overall`), `idempotencyKey` (unique), `createdAt`, `submittedAt`.
   - Indexes: `{ userId: 1, moduleId: 1, createdAt: -1 }`, `{ idempotencyKey: 1 }` (unique).

9. **`trainingProgress`** (`TrainingProgress.ts`)
   - Fields: `userId` (ref), `moduleId` (ref), `completedLessons` (array of string IDs), `progressPercentage`, `lastLessonId`, `status` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), `score`, `isCertified`, `startedAt`, `completedAt`, `updatedAt`.
   - Indexes: `{ userId: 1, moduleId: 1 }` (unique compound index).

10. **`certificates`** (`Certificate.ts`)
    - Fields: `certificateId` (unique string e.g. `PRK-2026-9A82FC10`), `certificateNumber` (unique serial), `verificationTokenHash` (SHA-256), `userId` (ref), `workerName`, `workerId`, `organizationId` (ref), `organizationName`, `moduleId` (ref), `moduleTitle`, `score`, `percentage`, `issuedAt`, `expiryDate`, `status` (`VALID`, `EXPIRED`, `REVOKED`), `revocationReason`, `revokedAt`, `revokedBy` (ref User), `qrPayload` (`certificateId`, `verifyUrl`, `token`).
    - Indexes: `{ certificateId: 1 }` (unique), `{ verificationTokenHash: 1 }`, `{ userId: 1, moduleId: 1 }`, `{ status: 1 }`.

11. **`notifications`** (`Notification.ts`)
    - Fields: `userId` (ref), `title`, `message`, `type` (`TRAINING_REMINDER`, `CERTIFICATE_EXPIRY`, `CERTIFICATE_ISSUED`, `ASSESSMENT_RESULT`, `ADMIN_MESSAGE`, `SYSTEM`), `isRead`, `actionUrl`, `createdAt`.
    - Indexes: `{ userId: 1, isRead: 1, createdAt: -1 }`.

12. **`auditLogs`** (`AuditLog.ts`)
    - Fields: `actorUserId` (ref), `actorEmail`, `action` (enum), `targetType`, `targetId`, `metadata` (sanitized, zero secrets), `ipAddress`, `userAgent`, `timestamp`.
    - Indexes: `{ actorUserId: 1, timestamp: -1 }`, `{ action: 1, timestamp: -1 }`, `{ targetType: 1, targetId: 1 }`.

---

## 3. Two-Step Registration & OTP Verification Flow

```
[ Worker / Client ]              [ Express API (/api/v1/auth) ]             [ MongoDB ]
        |                                      |                                  |
        | 1. POST /register                    |                                  |
        | (fullName, workerId, pass, email)    |                                  |
        |------------------------------------->|                                  |
        |                                      | 2. Zod Validate Input            |
        |                                      | 3. Check duplicate Worker/Email  |
        |                                      |--------------------------------->|
        |                                      |<---------------------------------|
        |                                      | 4. Hash Password (bcrypt 10)     |
        |                                      | 5. Crypto Gen 6-digit OTP        |
        |                                      | 6. SHA-256 Hash OTP              |
        |                                      | 7. Save PendingRegistration      |
        |                                      |--------------------------------->|
        |                                      | 8. Send OTP (Email/SMS)          |
        | 9. HTTP 201 Response                 |                                  |
        | (registrationId, expiresIn: 600s)    |                                  |
        | (NO USER CREATED YET, NO JWT)        |                                  |
        |<-------------------------------------|                                  |
        |                                      |                                  |
        | 10. POST /verify-registration        |                                  |
        | (registrationId/workerId, otp: 654321)|                                 |
        |------------------------------------->| 11. Find PendingRegistration     |
        |                                      |--------------------------------->|
        |                                      | 12. Check Expiry, Max Attempts   |
        |                                      | 13. Verify SHA-256(otp) Hash    |
        |                                      |                                  |
        |                                      | 14. [TRANSACTION]                |
        |                                      |     a. Create User (ACTIVE)      |
        |                                      |     b. Remove PendingRegistration|
        |                                      |     c. Log Audit Event           |
        |                                      |     d. Create Session & Tokens   |
        |                                      |--------------------------------->|
        | 15. HTTP 200 Response                |                                  |
        | (user, accessToken, refreshToken)    |                                  |
        |<-------------------------------------|                                  |
```

---

## 4. Authentication, Sessions & Token Rotation

```
Access Token (JWT, 15m)   --> Stateless, decoded in memory by auth middleware
Refresh Token (JWT, 7d)  --> Stateful, mapped to `Session` record by sessionId
```

1. **Access Token Payload**:
   ```json
   {
     "sub": "6688f12a9b31d...",
     "workerId": "WRK-1001",
     "role": "WORKER",
     "sessionId": "b8a6e810-72cb-4347...",
     "type": "access"
   }
   ```
2. **Refresh Token Flow**:
   - Client sends `{ refreshToken }` to `POST /api/v1/auth/refresh`.
   - Backend decodes token, locates active `Session` document by `sessionId`.
   - Verifies `SHA-256(refreshToken) === session.refreshTokenHash`.
   - **Rotation**: Generates a new refresh token, replaces `session.refreshTokenHash` with the new hash, updates `lastUsedAt`, issues a fresh access token.
   - **Reuse Detection**: If a revoked or stale token is presented, all sessions for the user are immediately revoked, triggering an audit security alert.

---

## 5. Role-Based Access Control (RBAC) Matrix

| Endpoint Route Prefix | Method | Public / Unauth | WORKER | ADMIN | SUPER_ADMIN |
|:---|:---:|:---:|:---:|:---:|:---:|
| `/api/v1/auth/register` | POST | Yes | - | - | - |
| `/api/v1/auth/verify-registration` | POST | Yes | - | - | - |
| `/api/v1/auth/login` | POST | Yes | - | - | - |
| `/api/v1/auth/refresh` | POST | Yes | - | - | - |
| `/api/v1/auth/logout` | POST | No | Yes | Yes | Yes |
| `/api/v1/users/me` | GET/PATCH | No | Own data only | Own data | Own data |
| `/api/v1/training/modules` | GET | No | Yes | Yes | Yes |
| `/api/v1/training/progress` | GET/POST | No | Own data only | Read all | Read all |
| `/api/v1/assessments/:id/submit` | POST | No | Yes | Yes | Yes |
| `/api/v1/certificates/verify/:id` | GET | Yes (Public) | Yes | Yes | Yes |
| `/api/v1/admin/dashboard/stats` | GET | No | 403 Forbidden | Yes | Yes |
| `/api/v1/admin/workers` | GET | No | 403 Forbidden | Yes | Yes |
| `/api/v1/admin/workers/:id/status` | PATCH | No | 403 Forbidden | Yes | Yes |
| `/api/v1/admin/modules` | POST/PUT | No | 403 Forbidden | Yes | Yes |
| `/api/v1/admin/certificates/revoke` | POST | No | 403 Forbidden | Yes | Yes |
| `/api/v1/admin/audit-logs` | GET | No | 403 Forbidden | 403 Forbidden | Yes |
