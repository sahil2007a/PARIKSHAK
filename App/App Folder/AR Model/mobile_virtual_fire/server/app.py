"""
FastAPI & WebSocket YOLOv8 Bridge Server for Mobile AR Virtual Fire
Ultra-fast optimized AI object detection for real-time mobile AR.
"""

import os
import io
import time
import base64
import socket
import cv2
import numpy as np
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="Mobile AR Virtual Fire YOLO Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate YOLO model weights across search directories
env_model = os.getenv("MODEL_PATH", "yolov8n.pt")
search_paths = [
    env_model,
    os.path.join(os.path.dirname(__file__), "..", "..", "yolov8n.pt"),
    os.path.join(os.path.dirname(__file__), "..", "..", "models", "yolov8n.pt"),
    os.path.join(os.path.dirname(__file__), "yolov8n.pt"),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", env_model))
]
MODEL_PATH = "yolov8n.pt"
for p in search_paths:
    if os.path.exists(p):
        MODEL_PATH = p
        break

print(f"[Server] Loading YOLO model from '{MODEL_PATH}'...")
model = YOLO(MODEL_PATH)
print(f"[Server] Model loaded successfully with {len(model.names)} known classes.")




def get_local_ip():
    """Finds local Wi-Fi / LAN IP address to display to the user."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class FramePayload(BaseModel):
    frame: str


def run_yolo_inference(img):
    """Runs ultra-fast YOLOv8 inference with 320px input resolution and high sensitivity."""
    h_img, w_img = img.shape[:2]
    
    # Ultra-fast inference at 320px resolution with 0.20 confidence threshold
    results = model(img, imgsz=320, conf=0.20, verbose=False)
    detections = []

    if results and len(results) > 0:
        boxes = results[0].boxes
        names = model.names
        for b in boxes:
            xyxy = b.xyxy[0].cpu().numpy()
            cls_id = int(b.cls[0].cpu().numpy())
            conf = float(b.conf[0].cpu().numpy())
            cls_name = names.get(cls_id, f"class_{cls_id}")

            x1, y1, x2, y2 = float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])
            w = max(1.0, x2 - x1)
            h = max(1.0, y2 - y1)

            detections.append({
                "box": [x1, y1, w, h],
                "class_name": cls_name,
                "confidence": conf
            })

    return detections, w_img, h_img


@app.get("/health")
def health_check():
    """Lightweight health check endpoint for mobile discovery and connection monitoring."""
    return {
        "status": "healthy",
        "service": "Mobile AR Virtual Fire YOLO Backend",
        "model_loaded": True,
        "timestamp": time.time(),
    }


@app.get("/")
def index():
    local_ip = get_local_ip()
    return {
        "status": "online",
        "service": "Mobile AR Virtual Fire YOLO Backend",
        "websocket_url": f"ws://{local_ip}:8000/ws/detect",
        "http_detect_url": f"http://{local_ip}:8000/detect",
        "health_url": f"http://{local_ip}:8000/health",
    }


@app.post("/detect")
def detect_http(payload: FramePayload):
    t_start = time.perf_counter()
    frame_b64 = payload.frame
    if not frame_b64:
        return {"detections": [], "latency_ms": 0.0, "image_width": 320, "image_height": 240}

    if "," in frame_b64:
        frame_b64 = frame_b64.split(",")[1]

    img_bytes = base64.b64decode(frame_b64)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return {"detections": [], "latency_ms": 0.0, "image_width": 320, "image_height": 240}

    detections, w_img, h_img = run_yolo_inference(img)
    latency_ms = (time.perf_counter() - t_start) * 1000.0

    return {
        "detections": detections,
        "latency_ms": latency_ms,
        "image_width": w_img,
        "image_height": h_img,
    }


@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    print("[WebSocket] Mobile client connected.")

    try:
        while True:
            data = await websocket.receive_json()
            frame_b64 = data.get("frame")
            if not frame_b64:
                continue

            t_start = time.perf_counter()

            if "," in frame_b64:
                frame_b64 = frame_b64.split(",")[1]
            img_bytes = base64.b64decode(frame_b64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                await websocket.send_json({"detections": [], "latency_ms": 0.0, "image_width": 320, "image_height": 240})
                continue

            detections, w_img, h_img = run_yolo_inference(img)
            latency_ms = (time.perf_counter() - t_start) * 1000.0

            # Send response back to mobile
            await websocket.send_json({
                "detections": detections,
                "latency_ms": latency_ms,
                "image_width": w_img,
                "image_height": h_img,
            })

    except WebSocketDisconnect:
        print("[WebSocket] Mobile client disconnected.")
    except Exception as e:
        print(f"[WebSocket] Error: {e}")


if __name__ == "__main__":

    import uvicorn
    local_ip = get_local_ip()
    print("=" * 65)
    print("  🔥 MOBILE AR VIRTUAL FIRE YOLO BACKEND SERVER 🔥")
    print("=" * 65)
    print(f"Local LAN IP:        {local_ip}")
    print(f"WebSocket Endpoint:  ws://{local_ip}:8000/ws/detect")
    print(f"HTTP Detect API:     http://{local_ip}:8000/detect")
    print("=" * 65)
    uvicorn.run(app, host="0.0.0.0", port=8000)
