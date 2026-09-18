# PARISHAK Database Architecture & Collections Reference
### "Practice. Prove. Protect."

---

## 1. MongoDB Connection Configuration

PARISHAK uses a dedicated singleton connection pool in `backend/src/config/database.ts` supporting standard multi-host non-SRV connection URIs and replica sets:

```typescript
const mongooseOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  maxPoolSize: 20,
  minPoolSize: 2,
  retryWrites: true,
  autoIndex: config.env !== 'production'
};
```

### Safety Principles
- **No Destructive Drops**: Collections are never dropped automatically or recreated blindly.
- **Connection Isolation**: Connects once during server startup; closes cleanly on `SIGINT` / `SIGTERM`.
- **Masked Credential Logging**: All log outputs sanitize MongoDB connection strings.

---

## 2. Collections & Index Matrix

| Collection Name | Model File | Purpose | Indexed Fields |
|:---|:---|:---|:---|
| `organizations` | `Organization.ts` | Industrial plants and mining enterprises | `{ code: 1 }` (unique), `{ name: 1 }` |
| `pendingRegistrations` | `PendingRegistration.ts` | Temporary unverified worker staging with hashed OTP | `{ workerId: 1 }`, `{ email: 1 }`, `{ phone: 1 }`, `{ otpExpiresAt: 1 }` |
| `users` | `User.ts` | Active worker and admin profiles | `{ workerId: 1 }` (unique), `{ email: 1 }`, `{ phone: 1 }`, `{ organizationId: 1, status: 1 }` |
| `sessions` | `Session.ts` | Stateful refresh token session store | `{ sessionId: 1 }` (unique), `{ userId: 1, isRevoked: 1 }`, `{ expiresAt: 1 }` |
| `trainingModules` | `TrainingModule.ts` | Safety curriculum modules (1 to 5) | `{ moduleId: 1 }` (unique), `{ sector: 1, status: 1 }` |
| `lessons` | `Lesson.ts` | Interactive multi-language lesson guides | `{ moduleId: 1, order: 1 }` |
| `assessments` | `Assessment.ts` | Formal examination questions & grading keys | `{ assessmentId: 1 }` (unique), `{ moduleId: 1 }` |
| `assessmentAttempts` | `AssessmentAttempt.ts` | Worker exam submissions & competency scores | `{ userId: 1, moduleId: 1, createdAt: -1 }`, `{ idempotencyKey: 1 }` |
| `trainingProgress` | `TrainingProgress.ts` | Normalized per-user module lesson progress | `{ userId: 1, moduleId: 1 }` (unique compound) |
| `certificates` | `Certificate.ts` | Official verifiable safety credentials | `{ certificateId: 1 }` (unique), `{ verificationTokenHash: 1 }`, `{ userId: 1, moduleId: 1 }` |
| `notifications` | `Notification.ts` | In-app alerts and compliance reminders | `{ userId: 1, isRead: 1, createdAt: -1 }` |
| `auditLogs` | `AuditLog.ts` | Immutable regulatory compliance audit trail | `{ actorUserId: 1, timestamp: -1 }`, `{ action: 1, timestamp: -1 }` |
