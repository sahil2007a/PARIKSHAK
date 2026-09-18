# PARISHAK Authentication & Identity Verification Guide
### "Practice. Prove. Protect."

---

## 1. Overview & Two-Step Registration Rule

In PARISHAK, an active `User` account is **never** created immediately upon submission of the registration form. Instead, the registration process follows a strict two-step verification lifecycle:

```
[ Worker ]                      [ PARISHAK API ]                     [ Database ]
    |                                   |                                  |
    | 1. Submit Registration Details    |                                  |
    |---------------------------------->|                                  |
    |                                   | 2. Zod Validate Input            |
    |                                   | 3. Check duplicate workerId/email|
    |                                   | 4. Hash Password (bcrypt 10)     |
    |                                   | 5. Crypto Gen 6-digit OTP        |
    |                                   | 6. SHA-256 Hash OTP              |
    |                                   | 7. Save PendingRegistration      |
    |                                   |--------------------------------->|
    |                                   | 8. Send Verification OTP (Email) |
    | 9. HTTP 201 Created               |                                  |
    |    (registrationId, 600s TTL)     |                                  |
    |<----------------------------------|                                  |
    |                                   |                                  |
    | 10. Enter 6-digit OTP             |                                  |
    |---------------------------------->|                                  |
    |                                   | 11. Verify OTP Hash              |
    |                                   | 12. Check Expiry & Max Attempts  |
    |                                   | 13. Create active User (ACTIVE)  |
    |                                   | 14. Invalidate PendingRecord     |
    |                                   | 15. Create Session & Tokens      |
    |                                   |--------------------------------->|
    | 16. HTTP 200 (user, tokens)       |                                  |
    |<----------------------------------|                                  |
```

---

## 2. Authentication Endpoints Specification

### 1. `POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "fullName": "Vikram Singh Munda",
    "workerId": "WRK-2099",
    "phone": "+919876500099",
    "email": "vikram.munda@steel.parishak.safety",
    "password": "Safety@2026Password",
    "organizationName": "Tata Steel Plant Jamshedpur",
    "sector": "STEEL",
    "jobRole": "Blast Furnace Technician",
    "experienceYears": 4,
    "preferredLanguage": "hi"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration initiated. A 6-digit verification code has been dispatched...",
    "data": {
      "registrationId": "6688f12a9b31d...",
      "workerId": "WRK-2099",
      "expiresInSeconds": 600
    }
  }
  ```

### 2. `POST /api/v1/auth/verify-registration`
- **Request Body**:
  ```json
  {
    "registrationId": "6688f12a9b31d...",
    "otp": "789123"
  }
  ```
- **Response (200 OK)**: Returns verified `user` object and initial `tokens` (access + refresh).

### 3. `POST /api/v1/auth/resend-verification`
- Rate-limited with a 60-second cooldown per identifier.
- **Request Body**: `{ "identifier": "WRK-2099" }`

### 4. `POST /api/v1/auth/login`
- Accepts `email`, `workerId`, or `phone` with `password`.
- Verifies account status is `ACTIVE`. If pending, returns `ACCOUNT_NOT_VERIFIED`.

### 5. `POST /api/v1/auth/refresh`
- Performs stateful refresh token rotation with token reuse detection.

### 6. `POST /api/v1/auth/logout` & `POST /api/v1/auth/logout-all`
- Revokes active sessions in MongoDB.

### 7. `POST /api/v1/auth/forgot-password` & `POST /api/v1/auth/reset-password`
- Temporary crypto reset token with session invalidation.

---

## 3. JWT & Session Security

- **Access Token**: Short-lived (15 minutes), containing `{ sub: userId, workerId, role, sessionId, type: "access" }`.
- **Refresh Token**: Long-lived (7 days), statefully tracked in `sessions` collection with SHA-256 hash storage.
- **Token Rotation**: Each refresh issues a fresh access + refresh token pair and updates the stored hash.
- **Reuse Detection**: If a revoked or stale token is presented, all user sessions are immediately terminated with a security audit event.
