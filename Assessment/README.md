# PARIKSHAK — Assessment & Examination Engine

## 📌 Architectural Overview

The **PARIKSHAK Assessment Subsystem** guarantees the integrity of safety training by enforcing **server-side authoritative scoring**. Client devices (mobile app and web dashboard) never compute final scores or authorize certifications locally.

This directory contains:
- `TESTING.md`: Complete Vitest integration test suite and validation coverage matrix.
- `README.md`: Formal specification of the scoring algorithm, competency domains, and certification issuance.

> [!IMPORTANT]
> The active, production assessment code is maintained within the application monorepo:
> - **Backend Scoring Service**: `1. App/App Folder/backend/src/services/scoringService.ts`
> - **Assessment Controller**: `1. App/App Folder/backend/src/controllers/assessmentController.ts`
> - **Mobile Client Assessment Engine**: `1. App/App Folder/apps/mobile/engine/` and `apps/mobile/app/assessment/`

---

## 1. Authoritative Scoring Model

When a worker submits answers (`POST /api/v1/assessments/:id/submit`), the backend validates the submission against formal answer matrices:

$$\text{Final Score} = \left( \frac{\sum_{i=1}^{N} w_i \cdot \mathbb{I}(a_i = k_i)}{\sum_{i=1}^{N} w_i} \right) \times 100$$

Where:
- $N$ = Total number of questions in the module assessment.
- $w_i$ = Weight assigned to question $i$ based on severity (Critical safety items carry higher weight).
- $a_i$ = Worker's submitted response.
- $k_i$ = Authoritative answer key stored in database.
- $\mathbb{I}(\cdot)$ = Indicator function ($1$ if correct, $0$ if incorrect).

---

## 2. Multi-Dimensional Competency Breakdown

Each assessment evaluates 5 distinct competency dimensions:

| Competency Domain | Code | Description | Minimum Passing Threshold |
|---|---|---|---|
| **Knowledge & Theory** | `knowledge` | Understanding fire classes, gas limits, LOTO definitions | 70% |
| **Hazard Recognition** | `recognition` | Identifying live electrical hazards, fuel spills, poor ventilation | 80% |
| **Procedural Sequence** | `procedure` | PASS protocol order, lockout-tagout zero energy verification | 75% |
| **Emergency Decision-Making** | `decisionMaking` | Immediate evacuation trigger vs. first-response suppression | 80% |
| **Safety Protocol Adherence** | `safetyCompliance` | Mandatory PPE, sounding nearest alarm, emergency dispatch | 85% |

---

## 3. Cryptographic Certificate Issuance

Upon achieving an overall score $\ge 70\%$ and meeting all safety-critical thresholds:
1. **Serial Generation**: Unique formatted identifier `PRS-<SECTOR>-<YEAR>-<SERIAL>` (e.g., `PRS-MIN-2026-9A82FC10`).
2. **Cryptographic Token**: A 256-bit entropy token is generated using `crypto.randomBytes(32)` and hashed with **SHA-256** before database storage.
3. **QR Code Payload**: Public verification URL encoded into high-density QR matrix:
   ```
   https://verify.parishak.safety/cert?token=<RAW_VERIFICATION_TOKEN>
   ```
4. **PDF Generation**: Vector PDF certificate compiled in-memory via `pdfkit` containing worker ID, plant organization, scores, validity period, and QR stamp.

---

## 4. Running the Assessment Test Suite

From the monorepo root (`1. App/App Folder`):

```bash
cd "1. App/App Folder"
npm run test:backend
```
