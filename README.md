# PARIKSHAK 
### *"Practice. Prove. Protect."*
**Enterprise Industrial Safety Training, AR Simulation Engine & Digital Certification Ecosystem**

---

## 1. Project Overview

**PARIKSHAK** is an end-to-end industrial safety training, computer-vision hazard simulation, and regulatory compliance certification platform designed specifically for high-risk industrial environments—such as underground/opencast coal and metal mining, steel mills, thermal power stations, and chemical processing facilities.

The ecosystem combines physical workspace hazard recognition, real-time computer vision simulation, server-authoritative scoring, and verifiable digital credentialing:
- **Mobile Application**: Offline-first mobile training client built with React Native and Expo (SDK 57). Provides multi-lingual localized interfaces (English, Hindi, Santali), audio-assisted assessments, interactive safety simulations, and a built-in cryptographic QR certificate scanner.
- **AI & Augmented Reality Hazard Engine**: Real-time OpenCV and Ultralytics YOLOv8 object detection engine that recognizes industrial equipment (machinery, electrical panels, conveyor rollers, gas valves) and superimposes procedural fire, toxic gas leaks, and hazard emergency procedures directly onto live camera feeds.
- **Authoritative Backend API**: Enterprise REST API built with Node.js, Express, TypeScript, and MongoDB. Implements a secure 2-step registration with cryptographic OTP verification, dual-token JWT rotation (15-minute access, 7-day refresh), tamper-proof server-side assessment evaluation, and automated digital certificate generation (`PRS-MIN-YYYY-XXXX`).
- **Admin / Web Dashboard**: Executive supervisory portal built with React 18, Vite, and Tailwind CSS for safety officers and mine inspectors to monitor compliance metrics, workforce pass rates, plant-wide risk distribution, and conduct real-time certificate validation and revocation.

---

## 2. Repository Structure

The repository is structured logically for clarity, while maintaining the entire working, interconnected application code intact inside `1. App/App Folder/`:

```text
PARIKSHAK/
│
├── 1. App/
│   ├── App Demo/                               # Application screenshots and demo recordings
│   └── App Folder/                             # ⚡ COMPLETE INTERCONNECTED WORKING APPLICATION
│       ├── apps/
│       │   ├── mobile/                         # Mobile App (React Native, Expo SDK 57, Expo Router)
│       │   └── admin/                          # Web Dashboard (React 18, Vite, Tailwind CSS)
│       ├── backend/                            # REST API (Express 4, TypeScript, Mongoose 8, PDFKit)
│       ├── AR Model/                           # AI & AR Virtual Fire Engine (FastAPI, OpenCV, YOLOv8)
│       ├── shared/                             # Domain Types & Validation Schemas (@parishak/shared)
│       ├── scratch/                            # Audit, migration, and maintenance scripts
│       ├── package.json                        # Monorepo workspaces definition & run scripts
│       ├── package-lock.json                   # Monorepo dependency lockfile
│       └── .env.example                        # Monorepo environment configuration template
│
│
├── 2. Architecture/
│
│
├── 3. Document/
│
│── 4. Research/
│       ├── Research Data/                      # Fire classes, explosive gas thresholds & DGMS safety limits
│       └── Research Sources - References/      # Regulatory standards: DGMS, BIS, OSHA, NFPA
│           
├── 5. Unity AR/
│   ├── .gitkeep                                # Directory placeholder
│
│
├── 6. API Details/
│   ├── API.md                                  # Complete REST API (v1) endpoint reference & request payloads
│   └── README.md                               # API architecture, headers, and standard error envelopes
│
├── .gitignore                                  # Comprehensive Git exclusions
├── .env.example                                # Root environment variable template
└── README.md                                   # Root repository documentation (this file)
```

> [!IMPORTANT]
> **Why is the working application maintained in `1. App/App Folder/`?**
> The mobile client (`apps/mobile`), supervisory portal (`apps/admin`), backend service (`backend`), shared domain library (`shared`), and computer vision server (`AR Model`) share npm workspace references, relative TypeScript paths, Metro bundler configurations, and model checkpoints. Keeping them together in `1. App/App Folder/` preserves all interconnections without broken paths.

---

## 3. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           PHYSICAL CLIENTS                              │
│                                                                         │
│   ┌──────────────────────────────┐     ┌────────────────────────────┐   │
│   │   Mobile App (Expo Go / RN)  │     │   Admin Web Dashboard      │   │
│   │   - Interactive Simulations  │     │   - Executive Analytics    │   │
│   │   - Offline Assessments      │     │   - Worker Registry        │   │
│   │   - QR Certificate Scanner   │     │   - Certificate Revocation │   │
│   └──────────────┬───────────────┘     └─────────────┬──────────────┘   │
└──────────────────┼───────────────────────────────────┼──────────────────┘
                   │ HTTP / WebSocket                  │ HTTP REST + Bearer
                   ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AUTHORITATIVE BACKEND (Node.js)                    │
│                                                                         │
│   - Port: 5000 | Base URL: http://localhost:5000/api/v1                 │
│   - Two-Step Registration & Argon2id/Bcrypt OTP Verification            │
│   - Dual-Token Session Manager (Access: 15m, Refresh: 7d)               │
│   - Authoritative Exam Grader & PDF Certificate Generator               │
│   - Rate Limiting (Helmet, CORS, Express-Rate-Limit)                    │
└──────────────────┬───────────────────────────────────┬──────────────────┘
                   │                                   │
         Mongoose  │                         Health &  │ WebSocket /
          Protocol │                         Telemetry │ REST Inference
                   ▼                                   ▼
┌──────────────────────────────┐         ┌────────────────────────────┐
│      DATABASE LAYER          │         │    AI / AR VISION ENGINE   │
│  MongoDB Atlas or Dev        │         │  FastAPI + OpenCV + YOLOv8 │
│  In-Memory Memory Server     │         │  - Port: 8000              │
│  - Users, Sessions, Modules  │         │  - Real-Time Hazard Detect │
│  - Attempts, Certificates    │         │  - Procedural Fire Overlay │
└──────────────────────────────┘         └────────────────────────────┘
```

- **Mobile App $\leftrightarrow$ Backend**: Communicates over HTTP REST at `http://localhost:5000/api/v1` for registration, auth, module progression, and exam submission.
- **Admin Dashboard $\leftrightarrow$ Backend**: Communicates over HTTP REST with JWT Bearer authentication to view live metrics, inspect worker attempts, and revoke certificates.
- **AI/AR Engine $\leftrightarrow$ Mobile App / Browser**: Real-time video frame inference via HTTP multipart `POST /detect` or live bi-directional streaming over `ws://localhost:8000/ws/detect`.
- **Backend $\leftrightarrow$ Database**: Mongoose connection pooling with automatic in-memory fallback for local development without cloud access.

---

## 4. Prerequisites

Verify that your workstation has the following runtimes installed:

| Tool | Minimum Version | Recommended Version | Purpose |
|---|---|---|---|
| **Node.js** | `v18.0.0` | `v20.x`, `v22.x`, or `v24.x` | Monorepo root, Backend API, Metro bundler, Vite |
| **npm** | `v9.0.0` | `v10.x` or latest | Monorepo workspace package manager |
| **Python** | `3.10` | `3.10`, `3.11`, or `3.12` | YOLOv8 Computer Vision Server & AR Virtual Fire Engine |
| **Git** | `2.30+` | Latest | Version control and submodules |
| **MongoDB** | `v6.0+` | Cloud Atlas or Local | Primary document database (optional fallback included) |
| **Expo Go** | Latest | Available on Google Play / iOS App Store | Running mobile client on physical mobile devices |

---

## 5. Clone the Repository

Clone the official repository using Git:

```bash
git clone https://github.com/sahil2007a/PARIKSHAK_0.1.git
cd PARIKSHAK_0.1
```

---

## 6. Project Directory

All operational scripts, builds, tests, and dependencies reside inside the **monorepo application directory**:

```bash
cd "1. App/App Folder"
```

> [!NOTE]
> All subsequent commands in this guide assume you are inside `1. App/App Folder`.

---

## 7. Environment Variables

The backend relies on environment variables for security keys, database connections, and ports.

### Setup Instructions

1. Copy the provided `.env.example` template:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example backend\.env
     ```
   - **Linux / macOS (Bash)**:
     ```bash
     cp .env.example backend/.env
     ```

2. Open `backend/.env` in your editor and configure your values:

```env
# Server Settings
PORT=5000
NODE_ENV=development
APP_NAME=PARISHAK
API_PREFIX=/api

# Database Connection (MongoDB Atlas URI or local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/parishak?retryWrites=true&w=majority
# Set to 'true' to use an automatic in-memory database if no MongoDB instance is available:
USE_IN_MEMORY_DB_FALLBACK=true

# Security & Cryptographic Tokens
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars_long
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Public Certificate Verification URL
CERTIFICATE_BASE_URL=https://verify.parishak.safety/cert

# CORS Allowed Client Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8081,exp://localhost:8081,exp://*

# AI Computer Vision Server
ML_SERVICE_URL=http://localhost:8000
```

> [!CAUTION]
> Never commit active `.env` files, production database passwords, or JWT secrets to GitHub. The repository's `.gitignore` automatically prevents `.env` files from being staged.

---

## 8. Install Dependencies

From `1. App/App Folder`, install the dependencies and compile the shared validation library:

### 1. Install Monorepo NPM Dependencies
```bash
npm install
```
*This installs dependencies for the root, backend, mobile application, admin dashboard, and shared library via npm workspaces.*

### 2. Build the Shared Domain Package (MANDATORY)
```bash
npm run build:shared
```
*Compiles `@parishak/shared` TypeScript types and Zod schemas into `dist/`. Both the Backend and Web Dashboard depend on this build artifact.*

### 3. (Optional) Set Up Python AI / AR Environment
If you intend to run the YOLOv8 computer vision detection server locally:
```bash
cd "AR Model"
python -m venv .venv

# Windows activation:
.venv\Scripts\activate
# Linux/macOS activation:
source .venv/bin/activate

pip install -r requirements.txt
cd ..
```

---

## 9. Database Setup

PARIKSHAK uses **MongoDB** as its primary data store.

1. **Option A: MongoDB Atlas (Recommended for Multi-device Testing)**
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
   - In **Network Access**, add your IP address (or `0.0.0.0/0` for development).
   - Copy your connection string into `backend/.env` under `MONGODB_URI`.

2. **Option B: In-Memory Fallback (Zero Setup)**
   - If you do not have a MongoDB instance available, ensure `USE_IN_MEMORY_DB_FALLBACK=true` is set in `backend/.env`.
   - The backend will spin up an isolated, temporary in-memory MongoDB server (`mongodb-memory-server`) automatically upon startup.

3. **Database Seeding (Optional)**
   - Pre-populate training modules, safety questions, and standard fire/gas certifications:
     ```bash
     npm --workspace=backend run seed
     ```

---

## 10. Backend — How to Run

1. Make sure you are in `1. App/App Folder`:
   ```bash
   cd "1. App/App Folder"
   ```
2. Start the backend development server:
   ```bash
   npm run dev:backend
   ```
3. **Expected Terminal Output**:
   ```text
   [INFO] Connecting to MongoDB at: mongodb+srv://...
   [INFO] Successfully established connection to MongoDB Database
   ====================================================
     PARISHAK Production Backend Started
     Environment : development
     Port        : 5000
     API Base    : http://localhost:5000/api/v1
   ====================================================
   ```
4. **Verification**: Open a browser or terminal and test the health endpoint:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```
   *Expected response:* `{"success":true,"message":"PARISHAK Industrial Safety API v1 Operational",...}`

---

## 11. AI / ML / AR Server — How to Run

The AI engine runs an Ultralytics YOLOv8 object detection model wrapped in a high-performance FastAPI server.

### Startup Options:

- **Option A: Monorepo NPM Command (Recommended)**
  ```bash
  npm run dev:yolo
  ```

- **Option B: Using Windows Batch Script**
  ```powershell
  cd "AR Model"
  .\1_START_YOLO_SERVER.bat
  cd ..
  ```
  *(This script automatically terminates any orphan processes on port 8000 and starts the FastAPI service).*

- **Option C: Direct Python Execution**
  ```bash
  python "AR Model/mobile_virtual_fire/server/app.py"
  ```

- **Expected Output**:
  ```text
  INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
  ```
- **Verification**:
  Open `http://localhost:8000/health` in your browser. Expected: `{"status":"ok","model_loaded":true}`.

---

## 12. Mobile App — How to Run

1. Open a new terminal in `1. App/App Folder`:
   ```bash
   cd "1. App/App Folder"
   ```
2. Start the Expo Metro Bundler:
   ```bash
   npm run dev:mobile
   ```
3. **Connecting to the App**:
   - **Physical Device (Expo Go)**:
     - Install **Expo Go** on your phone (Android or iOS).
     - Ensure your phone and PC are connected to the **same Wi-Fi network**.
     - Scan the terminal's QR code with Expo Go (Android) or the Camera app (iOS).
   - **Android Emulator**:
     - Press `a` in the terminal to launch the app inside Android Studio's emulator.
   - **Web Browser Preview**:
     - Press `w` in the terminal, or run:
       ```bash
       npm run dev:mobile:web
       ```
       *Opens the React Native Web interface at `http://localhost:8081`.*

> [!TIP]
> **Connecting Physical Device to Local Backend**:
> In physical device mode, `localhost` points to the mobile device itself. To communicate with the backend, ensure your backend API URL points to your PC's local LAN IP address (e.g., `http://192.168.1.X:5000/api/v1`).

---

## 13. Admin / Web Dashboard — How to Run

1. Open a new terminal in `1. App/App Folder`:
   ```bash
   cd "1. App/App Folder"
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev:admin
   ```
3. **Expected Output**:
   ```text
   VITE v5.4.2  ready in 320 ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```
4. **Verification**: Open `http://localhost:5173` (or `http://localhost:3000`) in your browser to view the industrial safety management dashboard.

---

## 14. Unity AR

The directory `3. Unity AR/` contains high-level documentation and migration plans for compiling 3D spatial mesh environments into dedicated mobile builds (AR Foundation / ARCore / ARKit). 

> [!NOTE]
> Currently, the production Augmented Reality hazard simulation is executed in real-time via the integrated Python OpenCV + YOLOv8 engine in `1. App/App Folder/AR Model/`, providing immediate camera-based hazard detection on both mobile devices and desktop webcams.

---

## 15. API Details

Complete, authoritative API documentation is maintained in:
- **`7. API Details/API.md`**: Detailed table of every route, HTTP method, required authentication headers, request bodies, query parameters, and JSON response envelopes.
- **`7. API Details/README.md`**: Authentication lifecycle overview, standard error payloads, and HTTP status code conventions.

---

## 16. Assessment

Documentation regarding assessment parameters and automated integration tests:
- **`6. Assessment/README.md`**: Scoring rubrics across Hazard Identification, Protocol Compliance, Response Time, and DGMS Rule Adherence.
- **`6. Assessment/TESTING.md`**: Guide for running backend unit and integration test suites using Vitest.

---

## 17. Recommended Startup Order

To prevent connection refusals between interdependent services, follow this startup sequence:

```text
Step 1: Database (MongoDB Atlas online or In-Memory Dev Fallback)
          ↓
Step 2: Backend REST API (npm run dev:backend) -> Port 5000
          ↓
Step 3: AI / YOLO Computer Vision Engine (npm run dev:yolo) -> Port 8000
          ↓
Step 4: Admin Web Dashboard (npm run dev:admin) -> Port 5173
          ↓
Step 5: Mobile App Bundler (npm run dev:mobile) -> Port 8081
```

---

## 18. Full Quick Start

For a quick run of all services from scratch:

```bash
# 1. Clone the repository
git clone https://github.com/sahil2007a/PARIKSHAK_0.1.git
cd PARIKSHAK_0.1

# 2. Enter monorepo directory
cd "1. App/App Folder"

# 3. Configure environment
copy .env.example backend\.env    # Windows PowerShell/CMD
# cp .env.example backend/.env     # Linux / macOS

# 4. Install dependencies and build shared domain library
npm install
npm run build:shared

# 5. Open separate terminals and launch services:
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:yolo

# Terminal 3:
npm run dev:admin

# Terminal 4:
npm run dev:mobile
```

---

## 19. Troubleshooting

### 1. `Cannot find module '@parishak/shared'`
- **Cause**: The shared TypeScript package has not been built yet.
- **Solution**: Run `npm run build:shared` from `1. App/App Folder`.

### 2. Node.js v24 Module Resolution Warnings
- **Cause**: Node 24 enforces strict CommonJS module resolution.
- **Solution**: All required transitive packages (`emoji-regex`, `bser`, `error-stack-parser`, `@expo-google-fonts/material-symbols`, `dijkstrajs`, `events-universal`) are pinned in the root `package.json`. Running `npm install` inside `1. App/App Folder` ensures clean resolution.

### 3. MongoDB Connection Refused / Timeout
- **Cause**: MongoDB Atlas IP whitelist blocking connection, or incorrect credentials.
- **Solution**: Set `USE_IN_MEMORY_DB_FALLBACK=true` in `backend/.env` for zero-configuration local offline development.

### 4. YOLO / AI Port 8000 in Use
- **Cause**: A previous Python/Uvicorn process was left running in the background.
- **Solution**: Execute `AR Model/1_START_YOLO_SERVER.bat` on Windows (automatically detects and kills existing port 8000 processes) or run `npx kill-port 8000`.

### 5. Metro Bundler Cache Issues (`expo start`)
- **Cause**: Stale packager cache or switching branches.
- **Solution**: Run `npx expo start -c` from `1. App/App Folder/apps/mobile` to reset the Metro cache.

---

## 20. Security Notes

- **Secrets & Credentials**: Active `.env` files containing database URIs, API keys, or JWT private keys must never be committed to Git.
- **Git Hygiene**: The project's root `.gitignore` enforces exclusion of `.env*`, `node_modules/`, `dist/`, build logs, and Python virtual environments (`.venv/`).
- **Cryptographic OTP Hashing**: Worker registration OTPs are never stored in plaintext in the database; they are hashed before storage.
- **Authoritative Grading**: Assessment scoring logic is strictly evaluated server-side to prevent client-side answer tampering or score manipulation.

---

**PARIKSHAK Engineering Team**  
*Empowering industrial workforces with life-saving knowledge through immersive technology.*
