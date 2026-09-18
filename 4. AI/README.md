# 4. AI & Computer Vision (PARIKSHAK Hazard Detection & Simulation Engine)

Welcome to the **PARIKSHAK AI / Computer Vision** module documentation.

---

## 📌 Implementation & Active Code Location

To preserve direct access to procedural particle engines, OpenCV video pipelines, and the mobile virtual fire simulation server, the active, runnable AI implementation is maintained within the application monorepo:

📁 **Active Implementation Path**:  
[`1. App/App Folder/AR Model/`](../1.%20App/App%20Folder/AR%20Model/)

---

## 🧠 Core Capabilities
- **Model Architecture**: Ultralytics YOLOv8 (Nano `yolov8n.pt` optimized for real-time mobile/edge inference).
- **Physical Hazard Detection**: Identifies industrial equipment (benches, electrical panels, machinery, fire extinguishers, PPE, valves).
- **Procedural Simulation**: Dynamically anchors procedural AR fire, toxic gas plumes, and extinguisher spray physics directly onto detected physical object coordinates.
- **Serving Architecture**: FastAPI with bi-directional WebSockets (`/ws/detect`) and multipart HTTP endpoints (`POST /detect`).

---

## 🚀 How to Run the AI / YOLO Server

From the repository root:

```bash
cd "1. App/App Folder"
npm run dev:yolo
```

Or execute the Windows batch script directly:

```powershell
cd "1. App\App Folder\AR Model"
.\1_START_YOLO_SERVER.bat
```

The server will listen at:  
👉 `http://localhost:8000` (Health endpoint: `http://localhost:8000/health`)
