# PARIKSHAK — Web Dashboard (Admin & Compliance Portal)

## 📌 Architectural Overview

The **PARIKSHAK Web Dashboard** is the centralized executive and plant-supervisor management interface designed for heavy industrial environments (mining, steel plants, smelting, and hazardous manufacturing).

To prevent breaking existing monorepo dependencies, relative imports, and shared TypeScript domain models (`@parishak/shared`), the **active source code** is maintained within the interconnected application monorepo.

---

## 📂 Implementation Location

The complete, active implementation of the Web Dashboard is located at:

```
1. App/App Folder/apps/admin/
```

### Key Subdirectories in the Working Dashboard:
- `1. App/App Folder/apps/admin/src/pages/`:
  - `DashboardPage.tsx`: Executive compliance metrics, expiring certifications, plant pass rates.
  - `CompliancePage.tsx`: Sector-wise safety auditing and regulatory thresholds.
  - `WorkersPage.tsx` & `WorkerDetailPage.tsx`: Worker directory, training history, account suspension / reactivation.
  - `CertificatesPage.tsx`: Digital certificate verification and cryptographic revocation with audit trail.
  - `AuditLogsPage.tsx`: Immutable regulatory compliance timeline.
  - `PublicVerificationPage.tsx`: Public QR-code certificate authenticity verifier.
- `1. App/App Folder/apps/admin/src/services/api.ts`: Authoritative REST API integration with `backend`.
- `1. App/App Folder/apps/admin/src/components/`: Sidebar navigation, Header with user profile, and metric StatCards.

---

## 🛠️ Technology Stack

- **Framework**: React 18.3 + Vite 5.4
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **Visualizations**: Recharts 2.12 (safety compliance curves, sector breakdowns)
- **Icons**: Lucide React
- **Routing**: React Router DOM 6.26

---

## 🚀 How to Run the Web Dashboard

All development scripts should be run from the root of the application monorepo (`1. App/App Folder`):

```bash
cd "1. App/App Folder"

# 1. Install all dependencies (if not already installed)
npm install

# 2. Build the shared domain package
npm run build:shared

# 3. Start the Web Dashboard development server
npm run dev:admin
```

The Web Dashboard will launch at:
```
http://localhost:5173
```

### Production Build:
```bash
cd "1. App/App Folder"
npm run build:admin
```
Built production assets are generated in `1. App/App Folder/apps/admin/dist/`.
