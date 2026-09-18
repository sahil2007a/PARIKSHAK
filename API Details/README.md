# PARIKSHAK — REST API Specifications & Contracts

## 📌 Architecture & Base Configuration

The **PARIKSHAK Backend API** is an authoritative REST service implementing defense-in-depth security, strict JSON request validation (via Zod), rate-limiting, and stateful session control.

This directory contains:
- `API.md`: Detailed endpoint reference with request/response schemas.
- `README.md`: Architectural summary, authentication protocols, error formats, and integration guidelines.

> [!IMPORTANT]
> The active backend source code is located at:
> ```
> 1. App/App Folder/backend/
> ```

---

## 1. Connection & Routing Baseline

- **Base URL**: `http://localhost:5000/api/v1`
- **Default Port**: `5000` (Configurable via `PORT` in `.env`)
- **Protocol**: HTTP/1.1 (JSON payloads, UTF-8 encoded)
- **CORS Allowed Origins**: `http://localhost:5173`, `http://localhost:3000`, `http://localhost:8081`, `exp://*`

---

## 2. API Route Hierarchy

| Route Prefix | Primary Purpose | Key Endpoints | Auth Level |
|---|---|---|---|
| `/api/v1/auth` | Worker onboarding & session lifecycle | `POST /register`<br>`POST /verify-registration`<br>`POST /login`<br>`POST /refresh`<br>`POST /logout` | Public & Bearer |
| `/api/v1/users` | Worker profile & account preferences | `GET /profile`<br>`PATCH /profile`<br>`POST /change-password` | Bearer (Worker/Admin) |
| `/api/v1/modules` | Safety curriculum & interactive lessons | `GET /`<br>`GET /:id` | Bearer (Worker/Admin) |
| `/api/v1/assessments` | Formal grading & exam submission | `GET /module/:id`<br>`POST /:id/submit`<br>`GET /results/:id` | Bearer (Worker/Admin) |
| `/api/v1/progress` | Lesson tracking & offline queue sync | `GET /progress`<br>`POST /progress/lesson`<br>`POST /sync` | Bearer (Worker/Admin) |
| `/api/v1/certificates`| Verifiable safety credential lifecycle | `GET /`<br>`GET /:id`<br>`GET /verify/:identifier` | Bearer / Public (Verify) |
| `/api/v1/admin` | Executive compliance oversight & RBAC | `GET /dashboard`<br>`GET /workers`<br>`PATCH /workers/:id/status`<br>`PATCH /certificates/:id/revoke`<br>`GET /audit-logs` | Bearer (`ADMIN` / `SUPER_ADMIN`) |
| `/api/v1/fire` | YOLO AI process & AR drill telemetry | `GET /status`<br>`POST /start-server`<br>`POST /complete-drill` | Bearer (Worker/Admin) |

---

## 3. Standard Error Envelope

All API errors return consistent structured JSON with descriptive industrial error codes:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "The 6-digit verification code entered is incorrect or has expired.",
    "statusCode": 400,
    "timestamp": "2026-09-18T18:30:00.000Z",
    "details": {
      "remainingAttempts": 2
    }
  }
}
```

Common Error Codes:
- `UNAUTHORIZED`: Missing or invalid Bearer JWT.
- `FORBIDDEN_ROLE`: Worker attempted access to supervisor/admin endpoints.
- `ACCOUNT_NOT_VERIFIED`: Attempted login before completing OTP registration gate.
- `TOKEN_EXPIRED`: Access token expired (refresh token rotation required).
- `VALIDATION_ERROR`: Zod schema rejected input types or formatting.

---

## 4. Full Endpoint Reference

For exhaustive parameter types, JSON payloads, and response structures, see:
- [`API.md`](./API.md)
