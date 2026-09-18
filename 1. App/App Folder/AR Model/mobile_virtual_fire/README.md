# 🔥 Mobile AR Virtual Fire (React Native + Expo SDK 57 / Expo Go)

A real-time mobile Augmented Reality (AR) application built with **React Native** and **Expo SDK 57** for rendering dynamic virtual fire effects over real-world physical objects (**benches, lathe machines, electric poles**, and everyday objects).

> [!IMPORTANT]
> **NOTE**: This is **NOT** a fire detection system.
> The app detects physical objects in the mobile camera feed and virtually renders an animated **AR fire effect ON TOP OF the detected objects in real time**, moving and scaling seamlessly as the camera or object moves.

---

## 📱 Expo Go vs. Development Build Compatibility

| Feature | Expo Go Support | Development Build (`expo-dev-client`) |
| :--- | :---: | :---: |
| **Live Camera Feed (`expo-camera`)** | ✅ Full Support | ✅ Full Support |
| **AR Fire Sprite & Particle Engine (60 FPS)** | ✅ Full GPU Acceleration | ✅ Full GPU Acceleration |
| **Interactive AR Tap-to-Target Simulation** | ✅ Full Support | ✅ Full Support |
| **WebSocket Stream to YOLO Backend** | ✅ Full Support | ✅ Full Support |
| **AR Cyberpunk HUD & Controls** | ✅ Full Support | ✅ Full Support |
| **Flashlight / Torch & Camera Flip** | ✅ Full Support | ✅ Full Support |
| **On-Device C++ JSI Frame Processors** | ⚠️ Not supported in Expo Go | ✅ Supported (`react-native-fast-tflite`) |

---

## 📁 Mobile Project Architecture

```
mobile_virtual_fire/
├── app.json                    # Expo configuration & camera permissions
├── package.json                # Dependencies for Expo SDK 57 / Expo Go
├── babel.config.js             # Babel plugins
├── App.js                      # Root AR component & state management
├── src/
│   ├── components/
│   │   ├── ARCameraView.js         # Full-screen camera preview with tap gesture
│   │   ├── BurningObjectOverlay.js # Anchored animated fire sprite + ambient glow + embers
│   │   ├── BoundingBoxBadge.js     # Glowing sci-fi bounding box corner brackets
│   │   ├── ARHudOverlay.js         # Cyberpunk AR status bar, FPS badge & control buttons
│   │   └── TargetSelectorModal.js  # Bottom sheet modal to toggle target categories
│   ├── engine/
│   │   ├── ObjectTracker.js        # EMA temporal box smoothing & jitter elimination
│   │   ├── FireAnimationManager.js # Flame scaling, multi-emitter span & particle physics
│   │   └── DetectorBridge.js       # WebSocket backend bridge & AR simulator
│   ├── assets/
│   │   ├── fire_sprites/           # 16 transparent PNG fire animation frames
│   │   └── fireSpritesRegistry.js  # Static image require registry
│   └── styles/
│       └── theme.js                # Design tokens (neon orange, glassmorphism, fonts)
├── server/
│   ├── app.py                      # FastAPI WebSocket YOLOv8 streaming server
│   └── requirements.txt            # Server dependencies
└── README.md                       # Documentation & mobile setup guide
```

---

## 🚀 Quick Start (Running in Expo Go)

### 1. Install Dependencies
Open terminal in the `mobile_virtual_fire` directory:
```bash
cd mobile_virtual_fire
npm install
```

### 2. Start Expo Metro Bundler
```bash
npx expo start
```
*(Or simply double-click `run_mobile_app.bat` in the project root!)*

### 3. Open on Your Phone
1. Install **Expo Go** from Google Play Store (Android) or Apple App Store (iOS).
2. Scan the **QR Code** displayed in your terminal using:
   - **Android**: Scan inside the Expo Go app.
   - **iOS**: Scan using the default iPhone Camera app.
3. Grant Camera Permissions when prompted.

---

## 🎮 Mobile Controls & Features

- **Tap-to-Spawn AR Target**: Tap anywhere on the live camera screen to drop an AR burning object (bench, lathe machine, pole, chair) directly in front of you!
- **`🔥 Fire ON/OFF`**: Instantly toggle virtual fire rendering.
- **`🎯 Targets`**: Open target modal to select which physical objects catch fire (`Bench`, `Lathe Machine`, `Electric Pole`, `Chair`, `Laptop`, `Bottle`, `Cup`, `Phone`, `Person`).
- **`✨ Blend Mode`**: Cycle through `Hybrid` (Incandescent core + smooth edges), `Additive` (intense glow), or `Alpha` (soft flame).
- **`🔦 Torch`**: Toggle mobile flashlight to illuminate dark objects.
- **`🔄 Flip`**: Switch between Back and Front cameras.
- **`📸 Snap`**: Capture high-resolution AR screenshot.

---

## 🧠 Optional: Streaming Live Camera to YOLOv8 Backend

To stream live frames from your phone's camera directly to our Python YOLOv8 model running on your PC:

1. **Start the backend server**:
   ```bash
   .\run_mobile_server.bat
   ```
2. The server will output your local Wi-Fi IP address (e.g. `ws://192.168.1.100:8000/ws/detect`).
3. The mobile app automatically receives real-time bounding box detections and renders virtual fire anchored over the detected physical objects!
