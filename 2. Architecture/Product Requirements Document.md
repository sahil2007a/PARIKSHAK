# PARIKSHAK — Product Requirements Document (PRD)

**Product Name:** PARIKSHAK  
**Product Type:** Offline-first mobile AR industrial safety training, assessment, certification and compliance platform  
**Primary Platform:** Android 10+ smartphones  
**Admin Platform:** Responsive Web Dashboard  
**MVP AR Modules:** Fire & Explosion Response; Gas Leak & Confined Space Protocol  
**Languages:** English, Hindi, Santali  
**Document Status:** Implementation-ready MVP PRD

---

## 1. Product Vision

PARIKSHAK transforms industrial safety training from passive reading into an interactive:

**Learn → Simulate → Perform → Assess → Certify → Verify**

experience.

Workers use a smartphone camera and AR simulations to learn safety procedures, perform simulated actions, demonstrate comprehension through assessments, receive a digitally verifiable certificate, and allow authorized supervisors to verify compliance.

The platform is designed for workers in Jharkhand's coal mining, steel, mica processing and other industrial workplaces, especially environments where connectivity, training infrastructure and technical literacy may be limited.

---

## 2. Problem Statement

Industrial workers can receive safety information through classroom instruction, manuals and drills, but these approaches do not consistently provide interactive practice or a standardized way to verify comprehension.

The source brief identifies:
- poor retention from static classroom/manual-based training;
- disruption and operational cost associated with live drills;
- limited accessibility of VR headset-based simulators;
- the need for periodic safety certification;
- the lack of an accessible regional-language platform with integrated comprehension verification.

PARIKSHAK addresses this gap through smartphone-based AR, offline training content, interactive scenarios, assessments, certification and web-based compliance verification.

---

## 3. Proposed Solution

PARIKSHAK is a mobile-first safety learning platform with four connected layers:

1. **Worker Mobile App**
   - onboarding and registration;
   - multilingual safety training;
   - AR simulations;
   - scenario-based assessments;
   - offline progress storage;
   - certificate and QR generation.

2. **Backend Platform**
   - authentication;
   - worker/module/assessment management;
   - synchronization;
   - certificate records;
   - compliance analytics;
   - role-based authorization.

3. **Admin Compliance Dashboard**
   - worker and training monitoring;
   - module/site analytics;
   - certificate management;
   - filters and reports.

4. **Public Certificate Verification**
   - QR/token-based certificate lookup;
   - minimal public information;
   - valid/expired/revoked status.

---

## 4. Product Goals

### Primary Goals
- Make industrial safety training interactive and practical.
- Enable meaningful comprehension verification.
- Work offline for core worker functionality.
- Support Hindi, Santali and English from the architecture level.
- Run on Android 10+ mid-range smartphones without external headsets.
- Provide digitally verifiable certificates.
- Give supervisors actionable compliance analytics.
- Keep the MVP technically achievable and demonstrable.

### Non-Goals for MVP
- Full implementation of all five safety modules.
- Mandatory cloud connectivity during training.
- VR headsets.
- Expensive industrial hardware.
- Advanced real-time computer vision requiring high-end devices.
- Full IoT integration.
- Government-scale integration.

---

## 5. Target Users

### Primary Users
- Industrial workers
- Mine workers
- Steel plant workers
- Mica processing workers
- Contract workers
- Newly recruited/low-experience workers

### Secondary Users
- Safety officers
- Training managers
- Site supervisors
- Mine/plant administrators

### Platform Administrators
- Super Admin
- Training Admin

---

## 6. Core User Journey

```text
Onboarding
   ↓
Language Selection
   ↓
Worker Registration
   ↓
Worker Dashboard
   ↓
Select Safety Module
   ↓
Introduction
   ↓
AR Tutorial
   ↓
Interactive AR Simulation
   ↓
Scenario-Based Assessment
   ↓
Score Calculation
   ↓
Pass / Fail
   ↓
Certificate Generation
   ↓
QR Code
   ↓
Online Certificate Verification
```

### Certification Rule

A worker must satisfy all of the following:

**Training Completion + AR Interaction + Assessment + Minimum Passing Score**

Opening a module alone must never issue a certificate.

---

# 7. MVP Scope

## 7.1 MVP Features

| Feature | MVP Status |
|---|---|
| Worker registration | MVP |
| Language selection | MVP |
| English/Hindi/Santali architecture | MVP |
| Worker dashboard | MVP |
| Fire AR module | MVP |
| Gas Leak AR module | MVP |
| Interactive AR actions | MVP |
| Scenario assessment | MVP |
| Score calculation | MVP |
| Configurable passing threshold | MVP |
| Offline local database | MVP |
| Offline training content | MVP |
| Offline certificate generation | MVP |
| QR generation | MVP |
| Certificate verification webpage | MVP |
| Admin compliance dashboard | MVP |
| Machinery Safety | Future Enhancement |
| PPE Safety | Future Enhancement |
| Emergency Evacuation/First Response | Future Enhancement |
| Advanced AI performance analysis | Future Enhancement |
| IoT integration | Future Enhancement |

---

# 8. AR Training Modules

## 8.1 Module 1 — Fire & Explosion Response

### Scenario
A simulated industrial emergency occurs. The worker must recognize hazards, identify the correct response, use the virtual extinguisher sequence and evacuate safely.

### AR Environment
- virtual industrial area;
- floor/surface placement;
- fire;
- smoke;
- emergency exit;
- exit arrows;
- extinguisher;
- alarm;
- hazard markers;
- assembly point.

### Interaction Sequence

```text
Scan Surface
↓
Place Training Environment
↓
Fire/Smoke Appears
↓
Identify Hazard
↓
Find Emergency Exit
↓
Select Correct Extinguisher
↓
Perform PASS
Pull → Aim → Squeeze → Sweep
↓
Evacuate
↓
Reach Assembly Point
↓
Assessment
```

### Correct Actions
- identify simulated fire;
- select appropriate extinguisher;
- follow PASS;
- follow evacuation arrows;
- choose safe exit;
- avoid hazard zones;
- reach assembly point.

### Incorrect Actions
- selecting incorrect extinguisher;
- entering restricted/hazard area;
- choosing unsafe exit;
- performing PASS steps out of order;
- ignoring evacuation instructions.

### Feedback
Immediate visual/audio feedback:
- Correct action
- Incorrect action
- Warning
- Unsafe decision

### Completion Condition
The worker completes the AR interaction sequence and passes the assessment.

**Safety rule:** The simulation must clearly state that it is a training simulation and must never instruct a user to perform dangerous actions on real equipment or during a real emergency.

---

## 8.2 Module 2 — Gas Leak & Confined Space Protocol

### Scenario
A simulated gas leak creates safe, warning, hazard and restricted zones around a confined-space environment.

### AR Environment
- gas cylinder/source;
- leak effect;
- gas detector;
- warning sign;
- confined-space entrance;
- PPE;
- barricade;
- worker avatar;
- zone markers.

### Interaction Sequence

```text
Detect Simulated Hazard
↓
Identify Warning Signs
↓
Recognize Hazard Zone
↓
Select Correct PPE
↓
Check Gas Testing Requirement
↓
Apply Buddy-System Rule
↓
Select Safe Entry/Exit Procedure
↓
Emergency Communication
↓
Scenario Assessment
```

### Zone Visualization

| Zone | Meaning |
|---|---|
| Safe | Normal training area |
| Warning | Increased caution required |
| Hazard | Simulated unsafe area |
| Restricted | Entry prohibited in scenario |

### Correct Actions
- recognize gas hazard;
- avoid unsafe zone;
- select appropriate PPE;
- understand gas testing;
- use buddy system;
- avoid entering alone;
- follow emergency communication protocol.

### Completion Condition
Correct AR actions plus successful scenario assessment.

---

# 9. Future AR Modules

## Module 3 — Machinery Safety
**Future Enhancement**

Covers:
- machine guarding;
- emergency stop;
- Lockout/Tagout;
- safe operating distance;
- PPE;
- unsafe machine-state identification;
- fault reporting.

## Module 4 — PPE & Personal Safety
**Future Enhancement**

Covers:
- helmet;
- goggles;
- gloves;
- safety shoes;
- ear protection;
- respiratory protection;
- reflective vest;
- scenario-specific PPE selection.

## Module 5 — Emergency Evacuation & First Response
**Future Enhancement**

Covers:
- alarm signals;
- emergency exits;
- evacuation arrows;
- dangerous zones;
- assembly point;
- headcount/buddy procedures;
- emergency-response questions.

---

# 10. Worker Mobile App Requirements

## 10.1 Onboarding

The onboarding experience must be simple and low-literacy friendly.

### Screens
1. Splash
2. Language Selection
3. Worker Registration
4. Optional Login/Authentication
5. Safety Orientation
6. Worker Dashboard

### Language Selection
- हिंदी
- संताली
- English

Use icons + text + optional audio.

---

## 10.2 Worker Dashboard

Example:

```text
WELCOME, WORKER

Training Progress: 65%

🔥 Fire Safety       COMPLETED
🛢 Gas Safety        IN PROGRESS
⚙ Machinery          LOCKED
🦺 PPE Safety        LOCKED
🚨 Evacuation        LOCKED

[ VIEW CERTIFICATE ]

Language:
हिंदी | संताली | English
```

Requirements:
- large touch targets;
- minimal text;
- strong visual hierarchy;
- progress indicators;
- clear locked/completed states;
- voice guidance where useful.

---

# 11. Screen-by-Screen UI Plan

## Screen 1 — Splash
Purpose: brand introduction.

Elements:
- PARIKSHAK logo;
- safety/AR visual;
- short tagline;
- loading state.

## Screen 2 — Language Selection
Purpose: choose training language.

Actions:
- English
- Hindi
- Santali

Store selection locally.

## Screen 3 — Worker Registration
Fields:
- Worker ID
- Name
- Organization/Site
- Department
- Optional phone/contact field if required by deployment

Validate required fields locally.

## Screen 4 — Dashboard
Show:
- progress;
- modules;
- completion;
- certificate access;
- sync status.

## Screen 5 — Module Introduction
Show:
- module objective;
- safety warning;
- estimated activity;
- Start button.

## Screen 6 — AR Tutorial
Teach:
- scan surface;
- place environment;
- interact with objects;
- follow instructions.

## Screen 7 — AR Simulation
Show:
- camera feed;
- AR objects;
- instruction;
- progress;
- contextual feedback;
- exit/pause controls.

## Screen 8 — Assessment
Show:
- question;
- options;
- progress;
- answer feedback where configured.

## Screen 9 — Result
Show:
- score;
- correct/incorrect;
- pass/fail;
- retry or certificate action.

## Screen 10 — Certificate
Show:
- worker;
- module;
- score;
- certificate ID;
- date;
- validity;
- QR.

## Screen 11 — Sync Status
Show:
- synced;
- pending;
- retrying;
- last sync time.

## Screen 12 — Verification
Web page showing certificate status and minimal permitted information.

---

# 12. Assessment Engine

The assessment engine must be reusable across all modules.

## Supported Question Types

- MCQ
- Image-based identification
- AR interaction
- Sequence ordering
- Correct/incorrect action
- Scenario-based decision

## Question Data Model

```text
questionId
moduleId
language
questionText
options[]
correctAnswer
explanation
score
difficulty
safetyCategory
questionType
assetReference
```

## Assessment Result

```text
attemptId
workerId
moduleId
startedAt
completedAt
totalQuestions
correctAnswers
incorrectAnswers
score
percentage
passingThreshold
status
attemptNumber
evidence
```

## Score Calculation

```text
percentage =
(correctAnswers / totalQuestions) × 100
```

Passing threshold must be configurable.

Example:

```text
if trainingCompleted
AND arInteractionCompleted
AND assessmentCompleted
AND percentage >= configuredThreshold:
    PASS
else:
    FAIL
```

---

# 13. Comprehension Verification

Certificate eligibility must depend on demonstrated competence.

```text
Training Completed
        +
AR Interaction Completed
        +
Assessment Completed
        +
Minimum Passing Score
        ↓
Certificate Eligible
```

Store evidence required for authorized compliance verification:
- module completion;
- assessment attempt;
- score;
- timestamp;
- certificate ID;
- status.

---

# 14. Certification System

## Certificate Fields

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
- Digital verification identifier

## Certificate ID

Use a unique server-generated identifier/token.

The QR code must not contain the full certificate data.

Example conceptual payload:

```text
https://verification-domain/certificate/<secure-token>
```

For offline creation, generate a temporary local certificate record and queue it for server synchronization. The final authoritative verification record should be established by the backend when synchronization occurs.

---

# 15. QR Verification

## Verification Flow

```text
QR Scan
↓
Verification URL
↓
Backend Lookup
↓
Certificate Found?
↓
Check Status
↓
Display Verification Result
```

## Public Result

Show only necessary information:

- Valid/Expired/Revoked
- Worker name or controlled display name
- Certificate ID
- Training completed
- Score/status
- Issue date
- Expiry date
- Issuing organization

Do not expose unnecessary personal information.

---

# 16. Offline-First Architecture

Offline operation is a core product requirement.

## Offline Capabilities

The following must work without continuous internet:

- training modules;
- AR assets;
- instructions;
- questions;
- assessment;
- scoring;
- worker progress;
- certificate generation;
- QR generation.

## Recommended Local Storage

For Unity, use a lightweight local persistence layer such as SQLite or an application-level local data store.

The architecture should abstract the storage layer so it can be replaced without changing training logic.

## Sync Queue

Each pending record should contain:

```text
syncId
entityType
entityId
operation
payload
createdAt
retryCount
status
lastError
```

### Sync Logic

```text
Local Action
↓
Save Locally
↓
Add Sync Queue Item
↓
Internet Available?
 ├── No → Keep Pending
 └── Yes
       ↓
   Authenticate
       ↓
   Upload
       ↓
   Server Validates
       ↓
   Success → Mark Synced
       ↓
   Failure → Retry with backoff
```

Use idempotency keys to prevent duplicate server records.

---

# 17. Backend Architecture

## Conceptual Architecture

```text
┌──────────────────────────────┐
│       ANDROID APP            │
│                              │
│ AR Training Engine           │
│ Training Content             │
│ Assessment Engine            │
│ Localization                 │
│ Certificate Generator        │
│ QR Generator                 │
│ Local Database               │
│ Sync Manager                 │
└──────────────┬───────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────┐
│       BACKEND API            │
│                              │
│ Auth Service                 │
│ Worker Service               │
│ Training Service             │
│ Assessment Service           │
│ Certificate Service          │
│ Sync Service                 │
│ Analytics Service            │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│  DATABASE   │  │ AUTH/RBAC   │
└──────┬──────┘  └─────────────┘
       │
       ▼
┌──────────────────────────────┐
│ ADMIN COMPLIANCE DASHBOARD   │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ CERTIFICATE VERIFICATION     │
└──────────────────────────────┘
```

---

# 18. Recommended Technology Stack

## Mobile/AR
**Unity + C# + AR Foundation + ARCore**

Reason:
- practical smartphone AR;
- strong Unity ecosystem;
- reusable AR scene architecture;
- offline asset packaging;
- suitable for optimized 3D assets;
- easier extension than building native AR from scratch for this prototype.

## Backend
**Node.js + Express**

Reason:
- familiar web ecosystem;
- fast API development;
- easy integration with React;
- suitable for hackathon deployment.

## Database
**MongoDB or PostgreSQL**

Recommended MVP choice:
**MongoDB** if the team prioritizes fast iteration and flexible training/question documents.

Use PostgreSQL if strict relational reporting and complex compliance relationships become the priority.

## Admin
**React + Vite + Tailwind CSS**

## Authentication
**JWT + refresh-token/session strategy**

## QR
A standard QR generation library.

## Certificate
PDF generation library on the backend and/or mobile-side offline certificate generator depending on implementation constraints.

## Hosting
Use a low-cost/free-tier backend and database during the hackathon, while keeping deployment provider abstraction in configuration.

---

# 19. Database Design

## Worker

```text
Worker
- _id
- workerId
- name
- organizationId
- siteId
- department
- preferredLanguage
- createdAt
- updatedAt
- status
```

## Organization/Site

```text
Organization
- _id
- name
- sector
- sites[]

Site
- _id
- organizationId
- name
- location
- departmentList
- status
```

## Training Module

```text
TrainingModule
- _id
- moduleCode
- name
- description
- category
- version
- passingThreshold
- status
- assetManifest
```

## Training Content

```text
TrainingContent
- _id
- moduleId
- language
- contentType
- title
- instructions
- audioReference
- assetReference
- sequence
```

## Question

```text
Question
- _id
- moduleId
- language
- questionType
- questionText
- options
- correctAnswer
- explanation
- score
- difficulty
- safetyCategory
```

## Attempt

```text
Attempt
- _id
- workerId
- moduleId
- attemptNumber
- startedAt
- completedAt
- answers
- score
- percentage
- status
- evidence
```

## Certificate

```text
Certificate
- _id
- certificateId
- verificationToken
- workerId
- organizationId
- siteId
- moduleId
- issueDate
- expiryDate
- score
- status
- issuedBy
- createdAt
```

## Sync Queue

```text
SyncQueue
- _id
- clientSyncId
- entityType
- entityId
- operation
- payload
- createdAt
- retryCount
- status
- lastError
```

## Admin/User

```text
AdminUser
- _id
- name
- email
- passwordHash
- role
- organizationId
- siteIds
- status
- createdAt
```

---

# 20. Relationships

```text
Organization
  └── Sites
       └── Workers

TrainingModule
  ├── TrainingContent
  └── Questions

Worker
  └── Attempts
       └── Module

Worker
  └── Certificates
       └── Module

AdminUser
  └── Organization/Site permissions
```

---

# 21. API Structure

## Authentication

```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

## Workers

```http
POST /api/workers
GET  /api/workers/:id
PUT  /api/workers/:id
```

## Modules

```http
GET /api/modules
GET /api/modules/:id
GET /api/modules/:id/content
```

## Assessments

```http
GET  /api/modules/:id/questions
POST /api/attempts
GET  /api/attempts/:id
```

## Certificates

```http
POST /api/certificates
GET  /api/certificates/:id
POST /api/certificates/:id/revoke
```

## Verification

```http
GET /api/verify/:token
```

## Synchronization

```http
POST /api/sync
GET  /api/sync/status
```

## Analytics

```http
GET /api/analytics/overview
GET /api/analytics/modules
GET /api/analytics/sites
GET /api/analytics/assessments
GET /api/analytics/certificates
```

All protected endpoints must enforce authentication and authorization.

---

# 22. Admin Compliance Dashboard

## Dashboard Metrics

1. Total workers
2. Workers trained
3. Workers pending training
4. Certificates issued
5. Certificates expiring soon
6. Pass/fail statistics
7. Module-wise completion
8. Site-wise compliance
9. Language usage
10. Recent assessments
11. Certificate verification activity

## Filters

- Site
- Department
- Module
- Date
- Training status
- Certificate status
- Worker ID

## Meaningful Safety Analytics

Prioritize:
- completion rate;
- average score;
- failure rate;
- most common mistakes;
- repeat attempts;
- module difficulty;
- certificate expiry;
- site compliance.

Avoid vanity metrics that do not support safety decisions.

---

# 23. Admin Roles and Permissions

## SUPER ADMIN
- manage organizations;
- manage sites;
- manage admins;
- manage modules;
- view global analytics;
- manage certificates;
- configure platform settings.

## TRAINING ADMIN
- manage training content;
- manage questions;
- view training analytics;
- view worker performance;
- issue/manage authorized certificates.

## SITE SUPERVISOR
- view assigned site;
- view assigned workers;
- monitor training;
- verify certificates;
- view site compliance.

## WORKER
- access own training;
- complete assessments;
- view own results;
- view own certificates.

Enforce organization/site boundaries at the API level, not only in the UI.

---

# 24. Multilingual Architecture

Do not hardcode translated strings into screens.

Use localization keys.

Example:

```json
{
  "fire.start": {
    "en": "Start Fire Safety",
    "hi": "फायर सेफ्टी शुरू करें",
    "sat": "<native-reviewed Santali translation>"
  }
}
```

Content requiring localization:
- buttons;
- instructions;
- warnings;
- questions;
- feedback;
- audio;
- certificates;
- dashboard labels;
- AR prompts.

## Santali Requirement

Santali content must receive expert/native-speaker validation before real-world deployment. Machine-generated translation alone must not be treated as deployment-ready safety content.

---

# 25. Audio Guidance

Package audio files locally for offline playback.

Example instructions:
- "Identify the nearest emergency exit."
- "Do not enter the restricted area."
- "Select the correct PPE."
- "Follow the evacuation route."

Recommended content structure:

```text
/localization/
  en/
    audio/
  hi/
    audio/
  sat/
    audio/
```

Use short, clear instructions.

---

# 26. 3D Asset Plan

## Fire Module

| Asset | Priority | Optimization | Animation |
|---|---|---|---|
| Fire extinguisher | Required | Low-poly | PASS interaction |
| Fire | Required | Lightweight VFX | Loop |
| Smoke | Required | Lightweight particles | Loop |
| Emergency exit | Required | Low-poly | Optional |
| Exit sign | Required | Low-poly | Optional |
| Door | Required | Low-poly | Optional |
| Fire alarm | Required | Low-poly | Alarm state |
| Hazard marker | Required | Low-poly | Pulse |
| Assembly point | Required | Low-poly | Optional |

## Gas Module

| Asset | Priority | Optimization | Animation |
|---|---|---|---|
| Gas cylinder/source | Required | Low-poly | Optional |
| Gas leak effect | Required | Lightweight VFX | Loop |
| Gas detector | Required | Low-poly | Detection state |
| PPE | Required | Low-poly | Selection |
| Warning sign | Required | Low-poly | Optional |
| Confined-space entrance | Required | Low-poly | Optional |
| Hazard zone | Required | Simple mesh/VFX | Pulse |
| Safety barricade | Required | Low-poly | Optional |
| Worker avatar | Optional | Low-poly | Basic |

---

# 27. AR Interaction Logic

## Surface Placement

```text
Start AR Session
↓
Detect Plane
↓
Show Placement Indicator
↓
User Taps
↓
Instantiate Scenario Prefab
↓
Lock/Confirm Placement
```

## Object Interaction

```text
User taps AR object
↓
Identify object
↓
Check current scenario state
↓
Is action valid?
├── Yes → Advance state + score
└── No  → Warning + penalty + feedback
```

Use a state-machine approach rather than hardcoding each scenario as unrelated logic.

Example:

```text
ScenarioState:
INTRO
HAZARD_DETECTED
EXIT_SELECTION
EXTINGUISHER_SELECTION
PASS_PULL
PASS_AIM
PASS_SQUEEZE
PASS_SWEEP
EVACUATION
ASSESSMENT
COMPLETED
```

This makes future modules easier to add.

---

# 28. Performance Requirements

Target:
- Android 10+;
- mid-range devices;
- stable 30 FPS where practical;
- minimal loading time;
- offline operation;
- no headset.

## Optimization

### 3D
- reduce polygon count;
- use LOD where beneficial;
- remove unused meshes/materials;
- combine static meshes where appropriate.

### Textures
- use compressed textures;
- avoid unnecessary 4K textures;
- use lower resolutions for small assets;
- use atlases where appropriate.

### Lighting
- prefer baked/simple lighting;
- minimize real-time lights;
- avoid expensive shadows.

### VFX
- limit particle counts;
- use lightweight fire/smoke effects;
- avoid excessive transparency/overdraw.

### Animation
- use simple loops;
- avoid unnecessary skeletal animation;
- disable unused animators.

### Memory
- load modules/assets only when needed;
- unload unused scenes/assets;
- avoid duplicate textures;
- monitor memory on target devices.

### APK Size
- package only required MVP assets;
- compress assets;
- separate future modules from MVP builds where practical.

---

# 29. Security Architecture

Implement:

- authentication;
- role-based access control;
- HTTPS;
- password hashing;
- input validation;
- API authorization;
- secure certificate tokens;
- minimal public worker information;
- rate limiting on public verification;
- server-side certificate status checks;
- audit logging for sensitive actions.

## Certificate Tamper Prevention

Do not trust certificate information encoded in the QR.

Instead:

```text
QR
↓
Secure Verification Token
↓
Backend Database
↓
Certificate Record
↓
Current Status
```

A revoked certificate must immediately show as revoked on online verification.

---

# 30. Certification Workflow

```text
Module Started
↓
Training Completed
↓
AR Interaction Completed
↓
Assessment Started
↓
Assessment Completed
↓
Score Calculated
↓
Pass / Fail
↓
If PASS
  ↓
Certificate Generated
  ↓
QR Created
  ↓
Stored Locally
  ↓
Sync With Server
  ↓
Online Verification Available
```

## Edge Cases

### Failed Attempt
Save result and allow retry according to configured retry policy.

### Reattempt
Increment attempt number. Preserve previous evidence.

### Offline Certificate
Create local certificate state and queue server synchronization. Clearly distinguish locally generated/pending-sync state from server-verified status.

### Duplicate Attempt
Use client attempt IDs/idempotency keys.

### Expired Certificate
Verification returns `EXPIRED`.

### Revoked Certificate
Verification returns `REVOKED`.

### Server Sync Failure
Keep local record and retry using exponential backoff.

---

# 31. Project Folder Structure

## Unity Mobile App

```text
PARIKSHAK-Mobile/
├── Assets/
│   ├── AR/
│   │   ├── Core/
│   │   ├── Fire/
│   │   └── Gas/
│   ├── Scenes/
│   ├── Prefabs/
│   ├── Models/
│   ├── Materials/
│   ├── Textures/
│   ├── VFX/
│   ├── Audio/
│   ├── Localization/
│   ├── Scripts/
│   │   ├── AR/
│   │   ├── Training/
│   │   ├── Assessment/
│   │   ├── Certificate/
│   │   ├── Localization/
│   │   ├── Database/
│   │   └── Sync/
│   └── UI/
├── Packages/
└── ProjectSettings/
```

## Backend

```text
PARIKSHAK-Backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   └── app.js
├── tests/
├── .env.example
└── package.json
```

## Admin Dashboard

```text
PARIKSHAK-Admin/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
├── public/
└── package.json
```

---

# 32. Development Phases

## Phase 1 — Foundation

Deliver:
- repository structure;
- Unity AR Foundation setup;
- ARCore configuration;
- basic navigation;
- localization framework;
- local database;
- backend API;
- authentication;
- admin skeleton.

## Phase 2 — MVP Training

Deliver:
- Fire AR module;
- Gas AR module;
- AR interaction state machines;
- assessment engine;
- offline content;
- scoring;
- worker progress.

## Phase 3 — Certification & Compliance

Deliver:
- certificate generation;
- QR generation;
- verification webpage;
- sync engine;
- admin analytics;
- certificate management.

## Phase 4 — Stabilization

Deliver:
- device testing;
- performance profiling;
- offline testing;
- sync failure testing;
- security testing;
- UI accessibility checks;
- end-to-end demo rehearsal.

---

# 33. Team Task Division

## AR/Unity Developer
- AR Foundation;
- plane detection;
- object placement;
- Fire module;
- Gas module;
- 3D optimization;
- interaction state machines.

## Mobile/UI Developer
- onboarding;
- worker dashboard;
- localization UI;
- assessment screens;
- certificate screens;
- offline UX.

## Backend Developer
- API;
- database;
- authentication;
- synchronization;
- certificate services;
- verification endpoint.

## Web/Admin Developer
- React dashboard;
- charts;
- filters;
- worker/module analytics;
- certificate verification page.

## Integration/QA
- end-to-end integration;
- offline/online tests;
- Android device testing;
- assessment validation;
- demo reliability;
- bug tracking.

---

# 34. Hackathon Demo Flow

Target duration: **3–5 minutes**.

```text
1. Open PARIKSHAK
2. Select Hindi
3. Register worker
4. Open Fire Safety
5. Scan floor
6. Place AR environment
7. Fire appears
8. Identify emergency exit
9. Select extinguisher
10. Perform PASS
11. Evacuate
12. Complete assessment
13. Show score
14. Generate certificate
15. Scan QR
16. Show verification webpage
17. Open admin dashboard
18. Show updated compliance analytics
```

The demo should emphasize:

**AR interaction + comprehension verification + offline-first capability + certificate verification + compliance dashboard.**

---

# 35. Future Scalability

## Future Enhancements

- all five safety modules;
- additional industrial sectors;
- more Indian languages;
- AI-based performance analysis;
- IoT sensor integration;
- real-time industrial data;
- advanced computer vision;
- organization-wide compliance;
- government/industry integrations;
- LMS integration.

The architecture should use modular content, module IDs, reusable assessment components and role-based APIs so future modules do not require rewriting the core platform.

---

# 36. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Mid-range phone performance | Low-poly assets, compressed textures, simple lighting, profiling |
| Large 3D assets | Optimize and package only required MVP assets |
| Offline/online conflicts | Local-first writes + sync queue + idempotency |
| Duplicate sync | Client operation IDs and server idempotency |
| Poor AR tracking | Simple plane detection and controlled demo environment |
| Translation quality | Native/expert validation, especially Santali |
| Unsafe interpretation | Explicit training-simulation labels and safe instructional design |
| Certificate tampering | Server-side verification token |
| API downtime | Core training remains locally available |
| Low digital literacy | Icons, large buttons, voice and minimal text |
| Battery consumption | Limit camera/AR session duration and heavy VFX |
| Scope creep | Strict MVP boundary with future-enhancement labels |

---

# 37. Feasibility

## Technical Feasibility
High for the defined MVP because:
- smartphone AR is used instead of dedicated hardware;
- Unity + AR Foundation + ARCore provides the AR layer;
- training assets can be packaged locally;
- assessments and scoring can run offline;
- synchronization can occur when connectivity returns;
- web dashboards use standard web technologies.

## Operational Feasibility
The platform is designed for low-bandwidth environments and does not require continuous connectivity for core learning.

## Cost Feasibility
The MVP avoids specialized VR headsets and expensive industrial equipment. Development can use open-source/free-tier software and cloud resources within their applicable usage limits.

## Scope Feasibility
Only two AR modules are fully implemented for the hackathon. The remaining modules are represented architecturally and in the UI as future enhancements.

---

# 38. Technical Novelty

PARIKSHAK combines:

1. Smartphone-based industrial AR training.
2. Offline-first safety education.
3. Interactive action-based comprehension verification.
4. Multilingual, low-literacy-oriented UX.
5. Digitally verifiable certification.
6. QR-based online verification.
7. Supervisor/admin compliance analytics.
8. A modular architecture designed for additional industrial scenarios.

The key innovation is not AR alone; it is the complete chain:

**Learn → Simulate → Perform → Assess → Certify → Verify**

---

# 39. Social Impact

PARIKSHAK can support:
- safer worker onboarding;
- better comprehension of safety procedures;
- improved accessibility of training in regional languages;
- reduced dependence on continuous internet;
- easier compliance monitoring;
- transparent certificate verification;
- scalable digital safety education for industrial workers.

It is especially suited to environments where workers may have limited technical literacy or inconsistent access to high-end training infrastructure.

---

# 40. Expected Measurable Outcomes

The platform should track measurable outcomes such as:

- training completion rate;
- assessment pass rate;
- average score;
- repeat-attempt rate;
- most common mistakes;
- module completion by site;
- certificate issuance count;
- certificate expiry count;
- verification activity;
- language usage;
- time spent completing modules.

For pilot deployment, baseline and post-training performance should be compared before making claims about actual improvement.

---

# 41. Product Success Criteria

The MVP is successful if a demonstrator can:

### Worker
- register;
- select language;
- complete Fire module;
- complete Gas module;
- perform required AR interactions;
- take assessments;
- receive a score;
- receive a certificate;
- view QR.

### Offline
- complete training without continuous internet;
- preserve progress;
- queue records;
- recover after reconnecting.

### Admin
- authenticate;
- view workers;
- view module progress;
- view assessment statistics;
- view certificates;
- filter compliance data.

### Verification
- scan/use certificate QR;
- retrieve certificate;
- display current status;
- distinguish valid, expired and revoked states.

### Reliability
- no critical crash during the demonstration;
- no duplicate certificate caused by repeated sync;
- no certificate issued solely from module opening;
- no unsafe real-world instruction.

---

# 42. Definition of Done

A feature is considered complete only when:

- UI is implemented;
- happy path works;
- invalid actions are handled;
- offline behavior is tested where applicable;
- data is persisted correctly;
- API authorization is enforced where applicable;
- errors have user-friendly feedback;
- target Android device testing is completed;
- performance is acceptable;
- feature is integrated into the end-to-end journey.

The MVP should prioritize a **working, stable and demonstrable product** over a large number of partially implemented features.

---

# 43. Final Product Positioning

**PARIKSHAK** is an offline-first smartphone AR safety training and certification platform that enables industrial workers to **learn safety procedures, practice them through immersive simulations, prove comprehension through assessments, receive verifiable certificates, and help supervisors monitor compliance.**

### Product Principle

> **Don't just teach safety. Let workers practice it, prove they understand it, and make that proof verifiable.**
