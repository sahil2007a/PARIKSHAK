# PARIKSHAK — AI & Machine Learning Subsystem

## 📌 Architectural Overview

The **PARIKSHAK AI Subsystem** powers real-time hazard identification and physical object tracking for the Augmented Reality simulation engine. Rather than a static image classifier, it is an active vision model designed to detect real-world industrial equipment (benches, lathe machines, conveyor rollers, electrical poles) and dynamically anchor physical hazard simulations (such as industrial fires and gas leaks) onto those objects.

To preserve monorepo paths, Metro bundler watchers, and backend launcher automation (`backend/src/services/fireModuleService.ts`), the **active implementation** is housed inside the interconnected monorepo.

---

## 📂 Implementation Location

The complete, active implementation of the AI & ML subsystem is located at:

```
1. App/App Folder/AR Model/
```

### Key Components:
- **Model Weights**:
  - `1. App/App Folder/AR Model/yolov8n.pt` (~6.5 MB YOLOv8 Nano weights for low-latency edge inference).
- **Core Vision Engine**:
  - `detector.py`: YOLOv8 object detector wrapper and target class filtering (COCO + custom classes).
  - `fire_effect.py`: Procedural fire particle engine, multi-frame sprite looping, Exponential Moving Average (EMA) coordinate smoothing, and hybrid alpha/additive blending.
  - `main.py`: Webcam vision loop with real-time FPS counter, latency tracker, and AR HUD.
  - `train_custom.py`: Transfer-learning pipeline for custom industrial targets (`lathe machine`, `electric pole`, `conveyor`).
  - `utils.py`: Procedural sprite generators, color-space converters, and screenshot utilities.
- **FastAPI / WebSocket Server**:
  - `1. App/App Folder/AR Model/mobile_virtual_fire/server/app.py`: High-throughput WebSocket stream bridge (`/ws/detect` & `/detect`) communicating directly with mobile devices.

---

## 🛠️ Technology Stack

- **Framework**: Ultralytics YOLOv8 (PyTorch)
- **Computer Vision**: OpenCV (`cv2`) 4.8+, NumPy
- **Server**: FastAPI, Uvicorn, WebSockets
- **Runtime**: Python 3.10+ / 3.11+ / 3.14+

---

## 🚀 How to Run the AI & Detection Server

All commands should be run from the application directory:

```bash
cd "1. App/App Folder/AR Model"

# 1. Install dependencies
pip install -r requirements.txt

# 2. Run standalone webcam AR simulation
python main.py --source 0

# 3. Run synthetic demo mode (no webcam required)
python main.py --source demo

# 4. Start the FastAPI / WebSocket Server for Mobile AR (Port 8000)
# Option A: Using the batch launcher
1_START_YOLO_SERVER.bat

# Option B: Using python directly
python mobile_virtual_fire/server/app.py
```

Or from the monorepo root:
```bash
cd "1. App/App Folder"
npm run dev:yolo
```
