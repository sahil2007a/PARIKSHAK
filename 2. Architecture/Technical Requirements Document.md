# PARIKSHAK — Technical Requirements Document (TRD)

**Product:** PARIKSHAK  
**Document:** Technical Requirements Document  
**Version:** 1.0  
**Status:** Implementation Baseline  
**Primary Target:** Android 10+ smartphones  
**Architecture:** Offline-first, modular, API-connected  
**MVP:** Fire & Explosion Response + Gas Leak & Confined Space Protocol

---

## 1. Purpose

This TRD converts the PARIKSHAK product requirements into an implementation-level technical specification.

The system must deliver:

**Learn → Simulate → Perform → Assess → Certify → Verify**

The technical design prioritizes:
- Working demonstrable MVP
- Offline-first operation
- Mid-range Android compatibility
- Smartphone AR without external headsets
- Modular AR scenarios
- Reliable local persistence and synchronization
- Secure digital certificates
- Responsive web administration
- Hindi, Santali and English localization
- Future expansion to all five safety modules

The source requirements explicitly require at least two complete polished AR modules for the MVP and future-ready architecture for the remaining modules. [Source: PRD requirements.]

---

## 2. Scope

### 2.1 MVP Scope

| Component | Requirement | Priority |
|---|---|---|
| Android application | Worker onboarding, registration, dashboard | MUST |
| Language | English, Hindi, Santali architecture | MUST |
| AR module | Fire & Explosion Response | MUST |
| AR module | Gas Leak & Confined Space Protocol | MUST |
| Assessment | Interactive scenario-based assessment | MUST |
| Scoring | Configurable pass threshold | MUST |
| Offline DB | Local worker/progress/assessment/certificate data | MUST |
| Certificate | Local digital certificate generation | MUST |
| QR | Unique certificate ID/token | MUST |
| Verification | Public certificate verification webpage | MUST |
| Admin | Compliance dashboard | MUST |
| Sync | Background synchronization when internet returns | MUST |
| Machinery Safety | Placeholder + module architecture | FUTURE |
| PPE Safety | Placeholder + module architecture | FUTURE |
| Emergency Evacuation | Placeholder + module architecture | FUTURE |

### 2.2 Non-Goals for MVP

The MVP will not require:
- VR headsets
- Dedicated AR hardware
- Continuous internet
- Expensive industrial sensors
- Real-world dangerous-action detection
- Full implementation of all five modules
- High-end smartphone assumptions
- Large cloud-streamed 3D assets during AR sessions

---

# 3. High-Level System Architecture

```text
                         ┌─────────────────────────┐
                         │       WORKER            │
                         │   Android 10+ Device    │
                         └────────────┬────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  PARIKSHAK ANDROID APP                      │
│                                                             │
│  UI / Navigation                                             │
│  ├── Onboarding                                              │
│  ├── Registration                                             │
│  ├── Dashboard                                                │
│  └── Certificate                                             │
│                                                             │
│  Training Core                                                │
│  ├── Module Manager                                           │
│  ├── Scenario Engine                                          │
│  ├── Assessment Engine                                        │
│  ├── Scoring Engine                                           │
│  └── Localization                                             │
│                                                             │
│  AR Core                                                       │
│  ├── AR Foundation                                            │
│  ├── ARCore                                                    │
│  ├── Plane Detection                                          │
│  ├── Object Placement                                          │
│  └── Interaction/Effects                                       │
│                                                             │
│  Offline Core                                                  │
│  ├── SQLite                                                    │
│  ├── Sync Queue                                                │
│  ├── Local Content                                             │
│  └── Local Certificates                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND API                            │
│                                                             │
│ Authentication / RBAC                                        │
│ Worker API                                                   │
│ Module API                                                   │
│ Assessment API                                               │
│ Certificate API                                              │
│ Sync API                                                     │
│ Analytics API                                                │
│ Verification API                                             │
└───────────────┬──────────────────────┬──────────────────────┘
                │                      │
                ▼                      ▼
       ┌────────────────┐     ┌─────────────────┐
       │ Primary DB     │     │ Object Storage  │
       │ PostgreSQL     │     │ PDF/assets      │
       └────────────────┘     └─────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     WEB PLATFORM                             │
│                                                             │
│ Admin Dashboard              Certificate Verification        │
│ ├── Analytics                ├── Public verification         │
│ ├── Workers                  ├── Status                      │
│ ├── Modules                  └── Minimal public data         │
│ ├── Certificates                                             │
│ └── Compliance                                                │
└─────────────────────────────────────────────────────────────┘
```

---

# 4. Technology Stack

## 4.1 Mobile

**Recommended:**
- Unity
- C#
- AR Foundation
- Google ARCore
- Android Build Support
- SQLite/local persistence

### Why Unity + AR Foundation + ARCore

This combination is selected because it provides:
- Stable Android AR support
- Native access to ARCore capabilities through AR Foundation
- Reusable scene and interaction architecture
- Efficient 3D rendering
- Easier expansion to additional scenarios
- Practical hackathon development workflow

Native Android ARCore is technically viable but would increase custom rendering and interaction work. Unity provides a more practical foundation for the required interactive 3D scenarios.

---

## 4.2 Backend

Recommended:
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt/Argon2 password hashing
- Zod or equivalent request validation

### Backend principles

- REST APIs
- Stateless authentication
- RBAC
- HTTPS only in deployment
- Input validation
- Centralized error handling
- Structured logging
- Idempotent synchronization endpoints

---

## 4.3 Admin Web

Recommended:
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts or equivalent chart library
- React Router
- TanStack Query or equivalent API-state layer

---

## 4.4 Certificate

Recommended:
- Server-side PDF generation for authoritative online copies
- Local PDF generation or HTML/PDF rendering for offline worker access
- QR code library
- Cryptographically random certificate identifier/token

The QR must reference a certificate identifier or secure verification token rather than embedding the complete certificate payload.

---

# 5. Android Technical Architecture

```text
Assets/
Scripts/
Scenes/
Modules/
Localization/
Audio/
Prefabs/
Materials/
StreamingAssets/
Plugins/
```

## Core runtime services

### AppBootstrap

Responsibilities:
- Initialize configuration
- Initialize local DB
- Load localization
- Initialize module registry
- Check AR support
- Initialize sync manager
- Restore worker session

### NavigationService

Responsibilities:
- Screen transitions
- Back-stack handling
- Session-aware routing
- Prevent duplicate navigation

### ModuleManager

Responsibilities:
- Load module metadata
- Check module availability
- Load module scene/content
- Track module state
- Report completion

### ScenarioEngine

Responsibilities:
- Load scenario definition
- Create AR objects
- Enable interactions
- Validate actions
- Emit events
- Track scenario completion

### AssessmentEngine

Responsibilities:
- Load questions
- Randomize where configured
- Capture responses
- Evaluate answers
- Calculate score
- Store attempt

### CertificateService

Responsibilities:
- Verify eligibility
- Generate certificate data
- Create certificate ID
- Generate QR
- Save certificate locally
- Queue sync record

### SyncManager

Responsibilities:
- Detect connectivity
- Process pending queue
- Retry failures
- Upload local changes
- Download required server updates
- Resolve conflicts

---

# 6. AR Requirements

## 6.1 AR Initialization

The application must:
1. Check ARCore availability.
2. Request camera permission.
3. Initialize AR session.
4. Enable plane detection.
5. Detect suitable horizontal surfaces.
6. Display placement guidance.
7. Place scenario content after confirmation.

## 6.2 Placement

AR content must:
- Have a controlled scale
- Maintain stable anchors
- Avoid unnecessary world-scale complexity
- Support reset/reposition
- Avoid placing content outside the detected usable area

## 6.3 AR Interaction Model

```text
IDLE
  ↓
AR_INITIALIZING
  ↓
SURFACE_SEARCH
  ↓
PLACEMENT_READY
  ↓
SCENARIO_ACTIVE
  ↓
INTERACTION
  ↓
VALIDATE_ACTION
  ├── CORRECT → FEEDBACK → NEXT_ACTION
  └── WRONG   → WARNING → RETRY/PENALTY
  ↓
SCENARIO_COMPLETE
  ↓
ASSESSMENT
```

---

# 7. Fire & Explosion Response Module

## 7.1 Required AR Assets

- Fire extinguisher
- Fire effect
- Smoke effect
- Emergency exit
- Exit sign
- Door
- Fire alarm
- Hazard marker
- Assembly point

## 7.2 Scenario

The worker scans the floor and places a virtual industrial emergency scene.

The worker must:
1. Identify the simulated fire.
2. Identify the safest exit.
3. Identify the correct extinguisher.
4. Execute PASS:
   - Pull
   - Aim
   - Squeeze
   - Sweep
5. Follow evacuation guidance.
6. Reach the safe/assembly point.
7. Complete assessment.

## 7.3 State Machine

```text
FIRE_INTRO
→ AR_SETUP
→ FIRE_DETECTED
→ FIND_EXIT
→ SELECT_EXTINGUISHER
→ PASS_PULL
→ PASS_AIM
→ PASS_SQUEEZE
→ PASS_SWEEP
→ FIRE_CONTROLLED
→ EVACUATION
→ ASSEMBLY_POINT
→ ASSESSMENT
→ RESULT
```

## 7.4 Scoring

Example configurable scoring:
- Correct exit: +10
- Correct extinguisher: +10
- Each PASS step: +10
- Safe evacuation: +20
- Unsafe action: configurable penalty

The exact passing threshold must be configuration-driven and never hardcoded into UI logic.

---

# 8. Gas Leak & Confined Space Module

## 8.1 Required AR Assets

- Gas cylinder/source
- Gas leak effect
- Gas detector
- PPE
- Warning sign
- Confined-space entrance
- Hazard zone
- Safety barricade
- Worker avatar

## 8.2 Zone Model

```text
SAFE
WARNING
HAZARD
RESTRICTED
```

Each zone has:
- Visual indicator
- Safety rules
- Allowed actions
- Blocked actions
- Feedback
- Score impact

## 8.3 Scenario Flow

```text
GAS_INTRO
→ AR_SETUP
→ HAZARD_IDENTIFICATION
→ WARNING_SIGN
→ ZONE_CLASSIFICATION
→ PPE_SELECTION
→ GAS_TESTING
→ BUDDY_SYSTEM
→ ENTRY/NO_ENTRY DECISION
→ EMERGENCY_COMMUNICATION
→ ASSESSMENT
→ RESULT
```

The simulation must not encourage dangerous real-world entry or unsafe actions.

---

# 9. Future Module Architecture

All future modules must implement a common interface:

```text
ISafetyModule
 ├── ModuleId
 ├── Version
 ├── Title
 ├── Description
 ├── RequiredAssets
 ├── Start()
 ├── Reset()
 ├── GetProgress()
 ├── Complete()
 └── GetAssessment()
```

Future modules:
- Machinery Safety
- PPE & Personal Safety
- Emergency Evacuation & First Response

This allows new modules without redesigning the application core.

---

# 10. Local Data Architecture

## 10.1 Local Database

SQLite is the preferred local database for the Unity MVP.

### Core tables

```text
Worker
TrainingModule
TrainingProgress
Question
AssessmentAttempt
AssessmentResponse
Certificate
SyncQueue
AppSettings
LocalizationCache
```

## 10.2 Worker

```text
id
workerId
name
organizationId
siteId
department
preferredLanguage
createdAt
updatedAt
syncStatus
```

## 10.3 TrainingModule

```text
id
moduleCode
name
version
status
contentVersion
required
createdAt
updatedAt
```

## 10.4 TrainingProgress

```text
id
workerId
moduleId
state
completionPercent
arCompleted
assessmentCompleted
bestScore
attemptCount
lastPlayedAt
updatedAt
syncStatus
```

## 10.5 AssessmentAttempt

```text
id
workerId
moduleId
attemptNumber
startedAt
completedAt
totalQuestions
correctAnswers
incorrectAnswers
score
percentage
passed
contentVersion
syncStatus
```

## 10.6 AssessmentResponse

```text
id
attemptId
questionId
selectedAnswer
isCorrect
score
responseTimeMs
createdAt
```

## 10.7 Certificate

```text
id
certificateId
workerId
moduleId
score
issueDate
expiryDate
status
verificationToken
pdfPath
syncStatus
createdAt
```

## 10.8 SyncQueue

```text
id
entityType
entityId
operation
payload
createdAt
attemptCount
lastAttemptAt
status
errorMessage
```

---

# 11. Backend Database Schema

PostgreSQL is recommended for authoritative server data.

## Entities

```text
users
workers
organizations
sites
departments
training_modules
training_content
questions
assessment_attempts
assessment_responses
certificates
certificate_events
sync_events
audit_logs
```

## Relationships

```text
Organization
  └── Sites
       └── Departments
            └── Workers

TrainingModule
  ├── TrainingContent
  └── Questions

Worker
  ├── AssessmentAttempts
  │      └── AssessmentResponses
  └── Certificates
```

---

# 12. API Requirements

Base path:

```text
/api/v1
```

## Authentication

```http
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

## Worker

```http
POST /workers
GET  /workers/:id
PATCH /workers/:id
GET  /workers/:id/progress
```

## Modules

```http
GET /modules
GET /modules/:moduleId
GET /modules/:moduleId/content
```

## Assessment

```http
POST /attempts
POST /attempts/:attemptId/responses
POST /attempts/:attemptId/complete
GET  /attempts/:attemptId
```

## Certificate

```http
POST /certificates/issue
GET  /certificates/:certificateId
POST /certificates/:certificateId/revoke
```

## Verification

```http
GET /verify/:certificateId
```

Only minimum required certificate information should be returned publicly.

## Sync

```http
POST /sync/push
POST /sync/pull
POST /sync/ack
```

The push API must be idempotent.

---

# 13. Synchronization Architecture

## Offline-first principle

The worker app must not block training because the network is unavailable.

```text
USER ACTION
   ↓
LOCAL DATABASE
   ↓
SYNC QUEUE
   ↓
NETWORK AVAILABLE?
   ├── NO → KEEP QUEUED
   └── YES
          ↓
       PUSH API
          ↓
       SERVER DB
          ↓
       ACK
          ↓
    MARK SYNCED
```

## Retry policy

Recommended:
- Immediate retry for transient connection failure
- Exponential backoff
- Maximum retry interval
- Persistent queue until successful
- Manual retry option for unrecoverable records

## Conflict strategy

Use:
- Server authoritative IDs
- Client-generated UUIDs
- Updated timestamps
- Content versioning
- Idempotency keys
- Append-only assessment evidence where possible

Assessment attempts should not be silently overwritten.

---

# 14. Connectivity Detection

The mobile app must expose a connectivity state:

```text
ONLINE
OFFLINE
SYNCING
SYNC_ERROR
```

Training must remain usable in:
- OFFLINE
- SYNC_ERROR

Only server-dependent operations should be disabled while offline.

---

# 15. Assessment Engine

## Supported question types

```text
MCQ
IMAGE_IDENTIFICATION
AR_INTERACTION
SEQUENCE_ORDERING
CORRECT_INCORRECT_ACTION
SCENARIO_DECISION
```

Each question requires:

```text
questionId
moduleId
language
questionText
options
correctAnswer
explanation
score
difficulty
safetyCategory
contentVersion
```

## Evaluation

```text
totalScore =
sum(correct response scores)
- penalties

percentage =
(totalScore / maximumScore) * 100
```

The passing threshold is configuration-driven.

## Certificate eligibility

```text
Training Completed
AND
AR Interaction Completed
AND
Assessment Completed
AND
Percentage >= Passing Threshold
AND
No required component failed
```

Only then can the certificate workflow execute.

---

# 16. Certificate System

## Certificate fields

- Worker name
- Worker ID
- Organization/site
- Training module
- Completion date
- Score
- Certificate ID
- Validity/expiry date
- Issuing authority
- QR code
- Verification identifier

## Certificate ID

Use a non-sequential unique identifier.

Example conceptual format:

```text
PK-2026-<random-secure-id>
```

Do not use predictable sequential IDs as the sole public verification secret.

## QR payload

Recommended:

```text
https://<verification-domain>/verify/<certificate-id-or-token>
```

The QR must not contain the full certificate data.

---

# 17. Certificate Lifecycle

```text
ELIGIBILITY_CHECK
       ↓
CERTIFICATE_CREATED
       ↓
LOCAL_STORAGE
       ↓
QR_GENERATED
       ↓
SYNC_PENDING
       ↓
SERVER_REGISTERED
       ↓
ONLINE_VERIFIABLE
       ↓
VALID
       ├── EXPIRING
       ├── EXPIRED
       └── REVOKED
```

## Edge cases

### Failed attempt
Store attempt and allow reattempt according to configured policy.

### Reattempt
Increment attempt count. Preserve previous attempt evidence.

### Offline certificate
Generate and store locally if eligibility is satisfied. Mark server verification as pending until synchronization.

### Duplicate attempt
Use client UUID/idempotency key to prevent accidental duplicate server records.

### Expired certificate
Verification returns `EXPIRED`.

### Revoked certificate
Verification returns `REVOKED`.

### Sync failure
Certificate remains locally valid for worker access but server status remains pending until synchronized; deployment policy may choose whether online verification requires server registration.

---

# 18. Public Verification

Verification page should display only necessary information:

```text
Certificate Status
Worker Name
Certificate ID
Training Completed
Score / Result
Issue Date
Expiry Date
Issuing Organization
```

Statuses:

```text
VALID
EXPIRED
REVOKED
NOT_FOUND
PENDING_SYNC
```

Do not expose unnecessary worker personal data.

---

# 19. Authentication & Authorization

## Roles

### SUPER_ADMIN
- Full platform administration
- Organizations/sites
- Users
- Modules
- Certificates
- Analytics

### TRAINING_ADMIN
- Training content
- Workers
- Assessments
- Certificates
- Training analytics

### SITE_SUPERVISOR
- Assigned site workers
- Compliance
- Training progress
- Certificates

### WORKER
- Own profile
- Own training
- Own attempts
- Own certificates

Authorization must be enforced server-side, not only in the UI.

---

# 20. Security Requirements

## Authentication
- Secure password hashing
- Short-lived access tokens
- Refresh-token strategy
- Token revocation/logout handling

## API
- HTTPS
- Request validation
- Authentication middleware
- RBAC middleware
- Rate limiting on public verification/authentication
- Secure error responses

## Certificate integrity

Use:
- Random certificate identifiers
- Server-side authoritative certificate records
- Audit events
- Revocation support
- QR verification against server data
- Optional digital signature/hash for stronger integrity

A user must never be able to modify the local PDF and have that modification become authoritative server data.

---

# 21. Localization Architecture

Supported languages:

```text
en
hi
sat
```

The architecture must support future Indian languages.

Localization must cover:
- Buttons
- Instructions
- Safety warnings
- Questions
- Feedback
- Audio
- Certificate text
- Dashboard labels

Recommended structure:

```text
Localization/
  en/
    common.json
    fire.json
    gas.json
    assessment.json
  hi/
    common.json
    fire.json
    gas.json
    assessment.json
  sat/
    common.json
    fire.json
    gas.json
    assessment.json
```

Santali content must receive native/expert validation before deployment.

Do not rely on literal machine translation for safety-critical instructions.

---

# 22. Offline Audio

Audio files should be packaged locally.

Example:

```text
Audio/
  en/
  hi/
  sat/
```

Audio must:
- Work without internet
- Have play/pause/replay
- Be optional where appropriate
- Match current language
- Avoid playing multiple instructions simultaneously

Use compressed mobile-friendly audio formats.

---

# 23. UI/UX Technical Requirements

The worker UI must support:
- Large touch targets
- Large icons
- High contrast
- Minimal text
- Clear status states
- Visual instructions
- Voice guidance
- Progress indicators
- Warning animations
- Haptic feedback where useful

Minimum screens:

```text
Splash
↓
Language Selection
↓
Worker Registration
↓
Worker Dashboard
↓
Module Details
↓
Training Introduction
↓
AR Tutorial
↓
AR Simulation
↓
Assessment
↓
Result
↓
Certificate
↓
Certificate Verification
```

---

# 24. Admin Dashboard Requirements

Dashboard KPIs:
- Total workers
- Workers trained
- Workers pending
- Certificates issued
- Certificates expiring
- Pass/fail
- Module completion
- Site compliance
- Language usage
- Recent assessments
- Verification activity

Filters:
- Site
- Department
- Module
- Date
- Training status
- Certificate status
- Worker ID

Charts must support meaningful safety/compliance decisions rather than vanity metrics.

---

# 25. Performance Requirements

Target:
- Android 10+
- Stable 30 FPS where possible
- Mid-range smartphones
- Offline operation
- Minimal loading time
- No external headset

## 3D optimization

Use:
- Low-poly models
- Texture atlasing where appropriate
- Compressed textures
- LOD where useful
- Baked lighting where possible
- Limited real-time lights
- Object pooling
- Controlled particle counts
- Simple shaders
- Reduced overdraw
- Occlusion/culling where appropriate

## Fire/smoke optimization

Fire and smoke are performance-sensitive.

Use:
- Small particle counts
- Short-lived particles
- Pooled particle systems
- Mobile-compatible shaders
- Avoid unnecessary transparent layers
- Disable effects outside active scenario

## Memory

- Load assets per module
- Unload unused scenes/assets
- Avoid duplicate textures
- Avoid keeping all future module assets in memory

## APK

Only ship MVP assets in the MVP APK unless a future-module asset is needed for the UI preview.

---

# 26. Asset Packaging

Recommended:

```text
StreamingAssets/
  Modules/
    Fire/
    Gas/
    Shared/
  Localization/
  Audio/
  Config/
```

Each module should have a versioned manifest.

Example:

```json
{
  "moduleId": "FIRE_001",
  "version": "1.0.0",
  "assetsVersion": "1.0.0",
  "languageVersions": {
    "en": "1.0.0",
    "hi": "1.0.0",
    "sat": "1.0.0"
  }
}
```

---

# 27. Content Versioning

Training content must be versioned.

A worker attempt must store the content version used.

This prevents ambiguity when questions or procedures are updated.

Example:

```text
FIRE_001
contentVersion = 1.2.0
assessmentVersion = 1.1.0
```

---

# 28. Error Handling

## Mobile

All critical operations must use controlled error states.

Examples:
- AR unsupported
- Camera permission denied
- Asset load failure
- Database error
- Certificate generation error
- Storage full
- Sync failure
- Corrupted local record

The user should receive a simple actionable message, not a technical stack trace.

## Backend

Central error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "requestId": "..."
  }
}
```

Never expose internal stack traces in production responses.

---

# 29. Logging & Monitoring

Backend logs should include:
- Request ID
- Endpoint
- User/role where appropriate
- Response status
- Error code
- Duration

Do not log:
- Passwords
- Access tokens
- Full private worker data
- Sensitive certificate secrets

Recommended production monitoring:
- API uptime
- Error rate
- Sync failure rate
- Certificate issuance failures
- Verification failures
- Database health

---

# 30. API Reliability

The backend must implement:
- Timeouts
- Input validation
- Retry-safe operations
- Idempotency for sync
- Pagination for large lists
- Transactional certificate issuance
- Database constraints
- Unique indexes

Certificate creation should be atomic:

```text
Validate eligibility
→ Create certificate
→ Create audit event
→ Return certificate
```

---

# 31. Database Integrity

Required constraints:
- Unique worker ID within defined scope
- Unique certificate ID
- Unique attempt client ID
- Foreign-key relationships
- Valid module IDs
- Valid role values
- Valid certificate statuses

Use database transactions for multi-record operations.

---

# 32. Folder Structure

## Unity

```text
PARIKSHAK-AR/
├── Assets/
│   ├── Art/
│   │   ├── Fire/
│   │   ├── Gas/
│   │   └── Shared/
│   ├── Audio/
│   │   ├── en/
│   │   ├── hi/
│   │   └── sat/
│   ├── Materials/
│   ├── Prefabs/
│   ├── Scenes/
│   │   ├── Core/
│   │   ├── Fire/
│   │   ├── Gas/
│   │   └── Future/
│   ├── Scripts/
│   │   ├── Core/
│   │   ├── AR/
│   │   ├── Modules/
│   │   │   ├── Fire/
│   │   │   ├── Gas/
│   │   │   └── Shared/
│   │   ├── Assessment/
│   │   ├── Certificate/
│   │   ├── Localization/
│   │   ├── Networking/
│   │   ├── Storage/
│   │   └── UI/
│   ├── StreamingAssets/
│   └── Resources/
└── ProjectSettings/
```

## Backend

```text
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── auth/
│   ├── sync/
│   ├── certificates/
│   ├── verification/
│   ├── analytics/
│   └── utils/
├── prisma/
├── tests/
├── .env.example
├── package.json
└── tsconfig.json
```

## Admin

```text
admin/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── charts/
│   ├── auth/
│   └── utils/
├── public/
└── package.json
```

---

# 33. Testing Requirements

## Unit Tests

Test:
- Scoring
- Pass/fail
- Certificate eligibility
- Certificate ID generation
- Localization lookup
- Sync queue
- Retry logic
- API validators

## Integration Tests

Test:
- Login
- Worker registration
- Assessment submission
- Certificate issuance
- QR verification
- Sync push/pull
- Admin analytics

## AR Tests

Test on physical devices:
- Plane detection
- Placement
- Tracking stability
- Touch interaction
- Fire interaction sequence
- Gas zones
- Reset
- Scene transitions

## Offline Tests

Test:
1. Start offline
2. Register worker
3. Complete module
4. Complete assessment
5. Generate certificate
6. Close app
7. Reopen app
8. Confirm data persistence
9. Enable network
10. Confirm sync
11. Verify certificate online

## Failure Tests

- Camera permission denied
- AR unavailable
- Database unavailable
- Network timeout
- Server 500
- Duplicate sync
- Expired certificate
- Revoked certificate
- Invalid certificate ID

---

# 34. Acceptance Criteria

## Mobile

- App launches on supported Android devices.
- Worker can select language.
- Worker can register.
- Worker can access dashboard.
- Fire module works offline.
- Gas module works offline.
- AR interactions are functional.
- Assessment is functional.
- Score is calculated correctly.
- Failed attempts are stored.
- Passing attempt generates certificate.
- Certificate remains accessible offline.
- QR is generated.
- Sync occurs when connectivity returns.

## Backend

- Authenticated APIs reject unauthorized access.
- RBAC is enforced.
- Worker data is stored correctly.
- Assessment attempts are idempotent.
- Certificates are unique.
- Verification works.
- Revocation works.
- Expiry status works.
- Sync failures do not destroy local records.

## Admin

- Admin can authenticate.
- Dashboard loads.
- Worker statistics are correct.
- Module statistics are correct.
- Certificate statistics are correct.
- Filters work.
- Site compliance data is visible.

---

# 35. Security Acceptance Criteria

- No password is stored in plaintext.
- HTTPS is used in deployment.
- Public verification does not expose unnecessary personal data.
- QR does not contain the complete certificate record.
- Unauthorized roles cannot access restricted APIs.
- Certificate status comes from authoritative server data.
- Input validation exists at API boundaries.
- Production error responses do not expose stack traces.

---

# 36. Performance Acceptance Criteria

The target device class is mid-range Android.

Minimum practical target:
- Stable AR experience around 30 FPS where device capability permits
- No continuous network dependency
- No major frame drops caused by avoidable effects
- No repeated large asset downloads during a session
- No uncontrolled memory growth during module transitions
- Reasonable startup and scene-loading times

Performance must be validated on real physical devices, not only the development PC.

---

# 37. Deployment Architecture

## Development

```text
Unity Android APK
        │
        ├── Local SQLite
        │
        └── Development API
```

## Production-like hackathon deployment

```text
Android APK
    ↓ HTTPS
Backend API
    ↓
PostgreSQL
    ↓
Admin Web + Verification Web
```

Use environment variables for:
- API base URL
- Database URL
- JWT configuration
- Certificate verification domain
- Storage configuration

Never hardcode production secrets.

---

# 38. Environment Configuration

Example:

```text
APP_ENV=development
API_BASE_URL=
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
CERTIFICATE_VERIFY_BASE_URL=
STORAGE_BUCKET=
```

Secrets must remain outside source control.

Provide:

```text
.env.example
```

with placeholder values only.

---

# 39. CI/CD Baseline

Recommended checks:
1. Install dependencies
2. Type-check backend
3. Lint
4. Run unit tests
5. Run integration tests
6. Build backend
7. Build admin
8. Validate environment configuration
9. Build Android release candidate
10. Smoke-test critical flow

---

# 40. Production-Readiness Rules

Before calling the MVP production-ready:

### Functional
- No broken primary user journey
- No fake backend responses
- No placeholder behavior in MVP modules
- Assessment and certificate logic verified end-to-end

### Reliability
- Persistent local data
- Retry-safe synchronization
- Controlled API errors
- No crash on common permission/network failures

### Security
- Secrets removed from source
- HTTPS
- RBAC
- Password hashing
- Input validation
- Secure certificate verification

### Performance
- Real-device AR testing
- Asset optimization
- Memory testing
- 30 FPS target where practical

### UX
- Worker-friendly language
- Large controls
- Clear warnings
- Voice/visual guidance
- Offline states visible

---

# 41. Development Phases

## Phase 1 — Foundation

- Unity project
- AR Foundation + ARCore
- Android build
- UI shell
- SQLite
- Backend project
- PostgreSQL
- Authentication
- API foundation

## Phase 2 — Fire Module

- Fire scene
- Plane detection
- Placement
- Fire/smoke
- Exit logic
- Extinguisher
- PASS interaction
- Evacuation
- Scoring

## Phase 3 — Gas Module

- Gas scenario
- Hazard zones
- PPE
- Gas testing
- Buddy-system logic
- Emergency communication
- Assessment

## Phase 4 — Certification

- Eligibility engine
- Certificate generation
- QR
- Local certificate storage
- Verification API/page

## Phase 5 — Sync

- Sync queue
- Push
- Pull
- Retry
- Conflict handling
- Offline/online tests

## Phase 6 — Admin

- Dashboard
- Worker data
- Compliance analytics
- Certificate list
- Filters
- Verification activity

## Phase 7 — Hardening

- Real-device testing
- Performance optimization
- Security checks
- Crash/error handling
- Full end-to-end testing
- Demo stabilization

---

# 42. Future Scalability

The architecture should allow:

- All five safety modules
- Additional industrial sectors
- Additional Indian languages
- AI-based performance analysis
- IoT sensor integration
- Real-time industrial data
- Advanced computer vision
- Organization-wide compliance
- Government/industry integration
- LMS integration

Future integrations should be implemented behind modular service interfaces rather than tightly coupling them to the worker UI.

---

# 43. Technical Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Low-end AR performance | High | Low-poly assets, particles, lighting and memory optimization |
| ARCore unsupported device | High | Detect support and provide clear fallback |
| Network unavailable | High | Offline-first local DB + sync queue |
| Sync conflict | Medium | UUIDs, idempotency and versioning |
| Certificate tampering | High | Server-authoritative verification |
| Localization errors | High | Native/expert validation, especially Santali |
| Large 3D assets | High | Optimize, compress, load per module |
| Backend outage | Medium | Continue local training; sync later |
| Duplicate attempts | Medium | Client IDs + idempotent APIs |
| Asset corruption | Medium | Versioned manifests/checksums |
| Battery drain | Medium | Limit camera/AR/effects runtime |

---

# 44. Demo Reliability Mode

For hackathon demonstration, the application should have a controlled demo dataset/configuration while retaining the real production architecture.

The demo must still execute:
- Real AR placement
- Real interactions
- Real assessment scoring
- Real local persistence
- Real certificate generation
- Real QR verification
- Real backend synchronization

Avoid fake success screens presented as backend functionality.

---

# 45. End-to-End Technical Flow

```text
APP LAUNCH
   ↓
LOAD CONFIG
   ↓
INIT LOCAL DB
   ↓
LOAD LANGUAGE
   ↓
RESTORE WORKER
   ↓
DASHBOARD
   ↓
SELECT FIRE
   ↓
LOAD LOCAL MODULE
   ↓
AR SESSION
   ↓
PLANE DETECTION
   ↓
PLACE SCENARIO
   ↓
INTERACTIVE TRAINING
   ↓
SCENARIO COMPLETE
   ↓
ASSESSMENT
   ↓
SCORE ENGINE
   ↓
ELIGIBILITY ENGINE
   ↓
PASS?
 ┌─┴──────────────┐
NO                YES
│                  │
Store Attempt      Generate Certificate
│                  │
Reattempt           Generate QR
                   │
                   Save Local
                   │
                   Add Sync Queue
                   │
                   Network Available?
                    ├── NO → Pending
                    └── YES → Backend
                                  ↓
                              PostgreSQL
                                  ↓
                          Online Verification
                                  ↓
                            Admin Analytics
```

---

# 46. Definition of Technical Done

PARIKSHAK technical implementation is considered complete for the MVP when:

- Android 10+ target is validated on representative physical devices.
- Fire and Gas modules are complete and interactive.
- AR works without continuous internet.
- Local data survives app restart.
- Assessment evidence is persisted.
- Passing rules are configurable.
- Certificate eligibility is enforced.
- Certificate and QR are generated.
- Verification works against authoritative server data.
- Offline records synchronize reliably.
- Duplicate synchronization does not create duplicate records.
- Admin dashboard displays synchronized compliance data.
- RBAC and validation are implemented.
- Critical errors are handled gracefully.
- Performance has been tested on mid-range Android hardware.
- No critical blocker remains in the primary demo flow.

---

# 47. Technical Priority Matrix

### P0 — Must Work
- Android app
- AR Foundation/ARCore
- Fire module
- Gas module
- Offline DB
- Assessment
- Scoring
- Certificate
- QR
- Verification
- Backend sync
- Admin dashboard

### P1 — Important
- Audio guidance
- Haptics
- Advanced analytics
- Robust retry UI
- Content versioning
- Audit logs

### P2 — Future
- AI performance analysis
- IoT integration
- Advanced computer vision
- Additional modules
- Additional industrial sectors
- Government/LMS integrations

---

# 48. Final Technical Position

PARIKSHAK should be implemented as an **offline-first modular safety-training platform**, not as a collection of disconnected AR scenes.

The core engineering principle is:

> **Local-first execution, server-authoritative compliance.**

The Android device owns the training experience, AR interaction, assessment execution and local progress while offline. The backend becomes authoritative for synchronized records, certificate verification, compliance analytics and administrative control when connectivity is available.

This architecture directly supports the required worker journey:

**Learn → Simulate → Perform → Assess → Certify → Verify**

and keeps the MVP technically achievable while preserving a clear path toward the complete five-module industrial safety platform.
