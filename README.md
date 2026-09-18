# PARIKSHAK (परिक्षार्थी / परिशक)
### *"Practice. Prove. Protect."*
**Enterprise Industrial Safety Training, AR Simulation Engine & Digital Certification Ecosystem**

---

## 1. Project Overview

**PARIKSHAK** is an end-to-end, multi-tier industrial safety training and compliance ecosystem purpose-built for hazardous work environments—including underground/opencast mining, steel plants, smelting operations, and chemical processing facilities.

The platform bridges real-world hazard simulation with authoritative regulatory compliance through:
- **Mobile Application**: Offline-first React Native (Expo SDK 57) mobile app with multi-lingual voice/text interfaces (English, Hindi, Santali), 2D simulation engine, and integrated camera QR badge verifier.
- **AI & Augmented Reality Engine**: Real-time OpenCV + Ultralytics YOLOv8 computer vision model detecting physical industrial equipment (benches, lathe machines, electrical panels, conveyor rollers) and anchoring realistic, procedural AR fire and toxic gas hazard simulations directly onto physical objects in live camera feeds.
- **Authoritative Backend API**: Enterprise Node.js / Express / MongoDB service with a two-step cryptographic OTP registration gatekeeper, stateful session management with token rotation, server-side authoritative exam scoring, and automated verifiable digital certificate issuance (`PRS-MIN-YYYY-XXXX`).
- **Admin Web Dashboard**: Executive React 18 + Vite + Tailwind CSS portal for real-time plant safety metrics, workforce compliance auditing, sector pass rates, and cryptographic certificate revocation with immutable audit trails.

---

## 2. Repository Structure

The repository is organized into a clean, modular structure while keeping the complete working monorepo fully interconnected inside `1. App/App Folder/`:

```text
PARIKSHAK_0.1/
├── 1. App/
│   ├── App Demo/                               # Application screenshots and demo media
│   └── App Folder/                             # ⚡ COMPLETE INTERCONNECTED WORKING MONOREPO
│       ├── apps/
│       │   ├── mobile/                         # Mobile App (React Native, Expo SDK 57)
│       │   └── admin/                          # Web Dashboard (React 18, Vite, Tailwind CSS)
│       ├── backend/                            # REST API (Express 4, TypeScript, Mongoose 8)
│       ├── AR Model/                           # AI & AR Virtual Fire Engine (OpenCV + YOLOv8)
│       ├── shared/                             # Core Domain Types & Validation Schemas (@parishak/shared)
│       ├── scratch/                            # Developer audit & localization migration scripts
│       ├── package.json                        # Monorepo workspaces configuration & scripts
│       ├── package-lock.json                   # Dependency lockfile
│       └── .env.example                        # Monorepo environment configuration template
│
├── 2. Web Dashboard/
│   ├── Web Demo/                               # Web dashboard preview screenshots
│   ├── Web Folder/                             # Web portal assets & reference materials
│   └── README.md                               # Architecture & reference pointing to active code in apps/admin
│
├── 3. Unity AR/
│   ├── .gitkeep                                # Empty directory placeholder
│   └── README.md                               # AR architecture documentation & Unity migration roadmap
│
├── 4. AI/
│   └── README.md                               # AI/ML YOLOv8 documentation pointing to active code in AR Model
│
├── 5. Document/
│   ├── Architecture/                           # System architecture & database schema specifications
│   │   └── ARCHITECTURE.md
│   ├── User Flow/                              # Two-step registration & session lifecycle diagrams
│   │   └── AUTHENTICATION.md
│   ├── System Design/                          # RBAC, security defense-in-depth, and database pooling
│   │   ├── ADMIN.md
│   │   ├── DATABASE.md
│   │   ├── SECURITY.md
│   │   └── IMPLEMENTATION_PLAN.md
│   └── Research/
│       ├── Research Data/                      # Safety thresholds, fire classes, and toxic gas limits
│       │   └── README.md
│       └── Research Sources - References/      # DGMS, BIS, OSHA, and NFPA standards
│           └── README.md
│
├── 6. Assessment/
│   ├── TESTING.md                              # Vitest integration test suite instructions
│   └── README.md                               # Authoritative scoring formula & competency dimensions
│
├── 7. API Details/
│   ├── API.md                                  # Complete REST API (v1) endpoint reference
│   └── README.md                               # API architecture, headers, and error envelopes
│
├── .gitignore                                  # Comprehensive Git ignore rules
├── .env.example                                # Root environment variable template
└── README.md                                   # Root project documentation
```

---

## 3. Prerequisites

Before setting up the project, ensure your environment has the following software installed:

| Tool / Runtime | Required Version | Purpose |
|---|---|---|
| **Node.js** | `v18.0.0+` or `v20.0.0+` (LTS recommended) | Monorepo, Backend API, Mobile Bundler, Admin Dashboard |
| **npm** | `v9.0.0+` | Monorepo workspace package manager |
| **Python** | `3.10+`, `3.11+`, or `3.14+` | YOLOv8 Computer Vision Server & AR Virtual Fire Engine |
| **MongoDB** | `v6.0+` or MongoDB Atlas URI | Database storage (or automatic In-Memory fallback in dev) |
| **Expo Go App** | Latest (iOS / Android) | Running the mobile training client on physical mobile devices |

---

## 4. Installation

All installation and development commands are executed from the **application monorepo directory** (`1. App/App Folder`):

```bash
# Navigate to the interconnected application folder
cd "1. App/App Folder"

# 1. Install all JavaScript / TypeScript monorepo dependencies
npm install

# 2. Build the shared domain models & validation library
npm run build:shared

# 3. (Optional) Set up Python AI / AR Model environment
cd "AR Model"
pip install -r requirements.txt
cd ..
```

---

## 5. Environment Setup

Copy the environment template to create your active `.env` file:

```bash
cd "1. App/App Folder"
cp .env.example backend/.env
```

> [!WARNING]
> Never commit active `.env` files or hardcoded credentials to GitHub. Real secrets are ignored automatically by `.gitignore`.

### Required Environment Variables (`backend/.env`):
```env
# Server
PORT=5000
NODE_ENV=development
APP_NAME=PARISHAK
API_PREFIX=/api

# Database (MongoDB Atlas URI or local replica set)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/parishak?retryWrites=true&w=majority
USE_IN_MEMORY_DB_FALLBACK=true

# Security & Session Authentication
JWT_ACCESS_SECRET=your_jwt_access_super_secret_key_2026_industrial_safety_shield
JWT_REFRESH_SECRET=your_jwt_refresh_super_secret_key_2026_refresh_token_protection
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Certificate Verification
CERTIFICATE_BASE_URL=https://verify.parishak.safety/cert

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8081,exp://localhost:8081,exp://*

# AI YOLO Detection Server
ML_SERVICE_URL=http://localhost:8000
```

---

## 6. How to Run

All service commands should be initiated from `1. App/App Folder`:

```bash
cd "1. App/App Folder"
```

### Backend API:
```bash
npm run dev:backend
# Starts Express API at http://localhost:5000/api/v1
```

### Admin Web Dashboard:
```bash
npm run dev:admin
# Starts Vite development server at http://localhost:5173
```

### Mobile App:
```bash
# Start Metro bundler for Expo Go (Port 8081)
npm run dev:mobile

# Or run mobile app directly in web preview mode
npm run dev:mobile:web
```

### AI / AR YOLOv8 Model Server:
```bash
# Option A: From monorepo root via npm
npm run dev:yolo

# Option B: Run batch file directly (Windows)
cd "AR Model"
1_START_YOLO_SERVER.bat

# Option C: Run standalone webcam AR viewer
python main.py --source 0
```

---

## 7. Run Order / Startup Order

To ensure full cross-service connectivity, launch the components in the following sequence:

```text
┌────────────────────────────────────────────────────────┐
│ 1. Database (MongoDB Atlas or In-Memory Dev Fallback)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Backend REST API (npm run dev:backend)              │
│    Listens at http://localhost:5000/api/v1             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. AI / YOLO Model Server (npm run dev:yolo)           │
│    Listens at http://localhost:8000 (WebSocket & REST) │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│ 4. Admin Web Dashboard    │ │ 5. Mobile App Bundler     │
│    (npm run dev:admin)    │ │    (npm run dev:mobile)   │
│    Opens: localhost:5173  │ │    Metro: localhost:8081  │
└───────────────────────────┘ └───────────────────────────┘
```

---

## 8. API Configuration & Cross-Component Communication

- **Mobile App $\leftrightarrow$ Backend**: Communicates via HTTP REST at `http://localhost:5000/api/v1` (or local Wi-Fi IP on physical device / `10.0.2.2` on Android Emulator).
- **Web Dashboard $\leftrightarrow$ Backend**: Communicates via HTTP REST with bearer JWT authentication. Configurable via `VITE_API_BASE`.
- **Backend $\leftrightarrow$ AI Model**: Backend health check probe queries `http://localhost:8000/health`. Can automatically trigger the YOLO server process.
- **Mobile App $\leftrightarrow$ AI Model**: Direct real-time streaming over WebSocket (`ws://<host>:8000/ws/detect`) and HTTP multipart image inference (`POST /detect`).

---

## 9. Build Instructions

To generate production bundles:

```bash
cd "1. App/App Folder"

# 1. Compile Shared Domain Library
npm run build:shared

# 2. Compile Backend TypeScript to JavaScript (dist/)
npm run build:backend

# 3. Build Admin Web Dashboard for Production (dist/)
npm run build:admin
```

---

## 10. Automated Testing

Run the full integration test suite covering registration, OTP hashing, token rotation, scoring, and certificate issuance:

```bash
cd "1. App/App Folder"
npm run test:backend
```

---

## 11. Troubleshooting

1. **`Cannot find module '@parishak/shared'`**:
   - Run `npm run build:shared` inside `1. App/App Folder` to build the TypeScript distribution files before launching backend or admin.
2. **MongoDB Connection Timeout**:
   - Ensure your IP address is whitelisted in MongoDB Atlas Network Access, or set `USE_IN_MEMORY_DB_FALLBACK=true` in `backend/.env` for local offline development.
3. **YOLO Port 8000 in Use**:
   - Running `AR Model/1_START_YOLO_SERVER.bat` automatically frees port 8000 if occupied by a zombie process.
4. **Metro Bundler Path Conflicts**:
   - If moving across network drives, run `npx expo start -c` inside `apps/mobile` to clear Metro's dependency cache.

---

## 12. Project Documentation Links

For in-depth technical references, consult the dedicated documentation directories:
- **System Architecture**: [`5. Document/Architecture/ARCHITECTURE.md`](./5.%20Document/Architecture/ARCHITECTURE.md)
- **Authentication & Registration Flow**: [`5. Document/User Flow/AUTHENTICATION.md`](./5.%20Document/User%20Flow/AUTHENTICATION.md)
- **Database Schema & Indexes**: [`5. Document/System Design/DATABASE.md`](./5.%20Document/System%20Design/DATABASE.md)
- **Security & Defense-In-Depth**: [`5. Document/System Design/SECURITY.md`](./5.%20Document/System%20Design/SECURITY.md)
- **Industrial Safety Research**: [`5. Document/Research/Research Data/README.md`](./5.%20Document/Research/Research%20Data/README.md)
- **Assessment & Examination Specs**: [`6. Assessment/README.md`](./6.%20Assessment/README.md)
- **REST API Specifications**: [`7. API Details/API.md`](./7.%20API%20Details/API.md)
