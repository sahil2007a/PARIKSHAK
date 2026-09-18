# PARISHAK Testing & Quality Assurance
### "Practice. Prove. Protect."

---

## 1. Running the Automated Test Suite

Run all backend and database tests using Vitest:

```bash
# In project root:
npm run test:backend

# Or directly in backend directory:
cd backend
npm test
```

---

## 2. Test Coverage Matrix

The comprehensive integration test suite (`backend/src/__tests__/api.test.ts`) verifies:

- [x] **Health Check**: Database connectivity verification.
- [x] **Registration Staging**: `PendingRegistration` document creation without active `User`.
- [x] **Duplicate Checks**: Rejection of duplicate `workerId`, `email`, and `phone`.
- [x] **Login Gatekeeping**: Unverified accounts rejected with `ACCOUNT_NOT_VERIFIED`.
- [x] **OTP Verification**: Constant-time SHA-256 hash comparison and attempt limiting.
- [x] **User Activation**: Real `User` creation, pending cleanup, and initial token issuance.
- [x] **Authentication & Sessions**: Password check, status validation, and `Session` tracking.
- [x] **Token Rotation**: Refresh token rotation and token reuse detection.
- [x] **Profile & Field Isolation**: Protected fields cannot be modified by workers.
- [x] **Role-Based Authorization**: `WORKER` token on admin endpoint returns `403 FORBIDDEN_ROLE`.
- [x] **Admin Metrics**: Live compliance data and stats retrieval.
- [x] **Curriculum & Lessons**: Seeded safety module retrieval.
- [x] **Assessment Scoring & Certificates**: Server-side answer evaluation, score calculation, pass threshold validation, and verifiable certificate issuance.
- [x] **Public QR Verification**: Verification by cryptographic token.
- [x] **Session Revocation**: Single logout and logout-all.
