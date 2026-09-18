# PARIKSHAK — Unity AR Module

## 📌 Architecture & Status Note

> [!NOTE]
> There is currently **no external Unity engine project** bundled in this repository.
> 
> The active Augmented Reality (AR) visual simulation engine in PARIKSHAK is currently implemented using:
> 1. **OpenCV + Ultralytics YOLOv8 AI Model**: Anchors realistic procedural fire onto physical industrial targets detected via live camera feeds.
> 2. **React Native / Expo AR Engine**: Renders interactive 3D glTF/GLB models (`fire_exting.glb`), multi-frame sprite overlays, and spatial collision planes on mobile devices.
> 
> The active AR implementation is located in:
> - `1. App/App Folder/AR Model/` (Computer Vision & AR Engine)
> - `1. App/App Folder/apps/mobile/components/AR/` (Mobile AR Layers & 3D Extinguisher Controls)

---

## 🔮 Future Unity AR Integration Roadmap

This directory (`3. Unity AR/`) is designated to host the standalone high-fidelity Unity AR build for industrial headsets (Meta Quest 3, Apple Vision Pro, Magic Leap 2) and ARCore / ARKit:

1. **Unity Version Target**: Unity 2022.3 LTS or 2023 LTS with AR Foundation.
2. **Planned Features**:
   - High-fidelity volumetric fire & smoke simulation (VFX Graph).
   - Real-time physics for high-pressure extinguisher hoses and foam dispersion.
   - Spatial mesh scanning for realistic flame propagation across machinery and walls.
   - Hand-tracking for PASS extinguisher pin pulling, aiming, and lever squeezing.
3. **Bridge to PARIKSHAK REST API**:
   - Unity WebGL / Android builds will communicate with the backend (`/api/v1/fire/complete-drill` and `/api/v1/sync`) using standard JSON payloads to record attempt telemetry and issue verifiable digital certificates.
