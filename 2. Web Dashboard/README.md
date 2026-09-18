# 2. Web Dashboard (PARIKSHAK Admin & Regulatory Portal)

Welcome to the **PARIKSHAK Web Dashboard** module.

---

## 📌 Architecture & Source Code Location

To preserve monorepo workspace dependencies, shared validation schemas (`@parishak/shared`), and strict build configurations, the active, runnable Web Dashboard source code is maintained inside the unified monorepo:

📁 **Active Implementation Path**:  
[`1. App/App Folder/apps/admin/`](../1.%20App/App%20Folder/apps/admin/)

---

## 🛠️ Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **API Client**: Axios with Bearer JWT interceptors

---

## 🚀 How to Run the Web Dashboard

From the repository root, navigate to the application folder and start the development server:

```bash
cd "1. App/App Folder"
npm run dev:admin
```

The portal will launch at:  
👉 `http://localhost:5173` (or `http://localhost:3000`)

---

## 📂 Directory Contents
- **`Web Demo/`**: Screenshots, recordings, and UI flow demonstrations of the safety management dashboard.
- **`Web Folder/`**: Architecture diagrams, UI design mockups, and exported assets.
