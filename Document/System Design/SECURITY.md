# PARISHAK Security Architecture & Defense In Depth
### "Practice. Prove. Protect."

---

## 1. Security Architecture Principles

1. **Zero Raw Secrets in Database**: Passwords hashed with bcrypt (salt rounds 10), OTPs hashed with SHA-256 before storage, refresh tokens hashed with SHA-256 in session records.
2. **Two-Step Registration Gatekeeper**: Active accounts are never created before successful cryptographic verification of the short-lived OTP.
3. **Session Revocation & Refresh Token Rotation**: Stateful session store with automatic revocation on reuse detection.
4. **Strict HTTP Security Headers**: Configured with `helmet` for Cross-Origin Resource Policy and protection against clickjacking/XSS.
5. **Dynamic CORS Configuration**: Whitelisted environment origins with mobile schema (`exp://`) compatibility in development.
6. **Centralized Error Handling**: Production environments suppress internal database error traces and stack traces, returning structured error codes (`INVALID_CREDENTIALS`, `ACCOUNT_NOT_VERIFIED`, `OTP_EXPIRED`, etc.).
7. **Immutable Regulatory Audit Trail**: Tracks critical security and compliance events (`USER_LOGIN`, `USER_REGISTER`, `PASSWORD_RESET`, `ASSESSMENT_SUBMIT`, `CERTIFICATE_REVOKE`).
