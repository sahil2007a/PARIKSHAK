# 🔥 Real-Time AR Virtual Fire Rendering System (OpenCV + YOLO)

An Augmented Reality (AR) visual simulation system built with **Python**, **OpenCV**, and **Ultralytics YOLO**.

> [!IMPORTANT]
> **NOTE**: This is **NOT** a fire detection system.
> The purpose of this system is to detect real-world physical objects (such as benches, lathe machines, electric poles, and workplace objects) in a live webcam or video feed and virtually render an animated, realistic **Augmented Reality fire effect** anchored on top of those objects in real time.

---

## 🌟 Key Features

1. **Real-Time YOLO Object Detection**:
   - Integrated with YOLOv8 for ultra-fast, high-FPS object detection and tracking.
   - Out of the box, natively detects standard COCO classes (e.g., `bench`, `chair`, `bottle`, `laptop`, `couch`) for instant testing, with built-in support for custom trained targets (`lathe machine`, `electric pole`).
2. **Realistic AR Fire Engine**:
   - **Multi-Frame Looping Fire Sprites**: 16 seamless transparent RGBA fire animation frames with glowing incandescent core, flickering flame body, and smoky fading tips.
   - **Multi-Emitter Flame Distribution**: Automatically spawns multiple flame tongues along the span of wide physical objects (like benches, tables, or lathe beds) rather than stretching a single texture.
   - **Temporal Bounding Box Smoothing**: Exponential Moving Average (EMA) coordinate filtering prevents jitter and stutter when detector predictions fluctuate slightly between frames.
   - **Multi-Mode Blending**:
     - **Hybrid AR Blending** (Default): Additive incandescent core + alpha-blended edges + subtle ambient warm illumination on the object's surface.
     - **Additive Blending**: Glowing neon heat effect.
     - **Alpha Blending**: Soft realistic smoke and flame compositing.
   - **Dynamic Rising Embers**: Animated floating sparks and ember particles that drift upward from the burning object.
3. **AR HUD & Interactive Controls**:
   - Real-time FPS counter and latency meter (ms).
   - Target object and active fire counters.
   - Hotkeys for live toggling:
     - `[F]` : Toggle Virtual Fire rendering on/off.
     - `[D]` : Toggle detection bounding boxes and labels.
     - `[B]` : Cycle fire blending mode (Hybrid / Additive / Alpha).
     - `[S]` : Save high-resolution screenshot to `screenshots/` directory.
     - `[Q]` / `[ESC]` : Clean exit.

---

## 📁 Project Structure

```
ML Model / virtual_fire/
├── main.py                 # Main application loop, webcam capture, FPS tracker & AR HUD
├── detector.py             # YOLOv8 object detector wrapper & target class filter
├── fire_effect.py          # AR fire engine, sprite frame manager, EMA smoothing & blending
├── utils.py                # Procedural fire generator, AR HUD renderer, screenshot utility
├── train_custom.py         # Custom YOLOv8 training script for bench, lathe, & electric pole
├── requirements.txt        # Python dependencies
├── models/                 # Pretrained and custom weights directory
├── assets/
│   └── fire/               # 16-frame transparent PNG fire animation frames
├── screenshots/            # Output folder for screenshots captured via [S] key
└── README.md               # Documentation and custom training guide
```

---

## 🚀 Quick Start

### 1. Installation

Activate the virtual environment and install dependencies:
```bash
# Activate virtual environment (Windows)
.\.venv\Scripts\activate

# Install dependencies (if not already installed)
pip install -r requirements.txt
```

### 2. Run with Live Webcam

```bash
python main.py --source 0
```

### 3. Run on a Video File or Demo Mode

```bash
# Run on a video file
python main.py --source "path/to/video.mp4"

# Run in synthetic demo mode (no camera needed)
python main.py --source demo
```

### 4. Customizing Target Objects & Confidence

You can specify which detected objects should catch fire using the `--targets` argument:
```bash
# Fire on benches, chairs, and laptops
python main.py --source 0 --targets "bench,chair,laptop" --conf 0.40 --blend hybrid
```

---

## 🎯 Keyboard Controls

| Key | Action |
|---|---|
| `F` | **Toggle Virtual Fire** on/off |
| `D` | **Toggle Bounding Boxes** and object labels |
| `B` | **Cycle Blending Mode** (`Hybrid` $\rightarrow$ `Additive` $\rightarrow$ `Alpha`) |
| `S` | **Capture Screenshot** (saved to `screenshots/ar_fire_YYYYMMDD_HHMMSS.png`) |
| `Q` / `ESC` | **Quit Application** |

---

## 🛠️ Training a Custom Model (Bench, Lathe Machine, Electric Pole)

To detect specialized industrial machines and infrastructure like **Lathe Machines** and **Electric Poles**, follow this complete training workflow:

### Step 1: Collect and Annotate Dataset
Collect 100–300 images per class under varied lighting, angles, and backgrounds.

Use annotation tools such as:
- [Roboflow](https://roboflow.com/) (Recommended: supports one-click YOLOv8 export)
- [Label Studio](https://labelstud.io/)
- [CVAT](https://www.cvat.ai/)

**Target Classes**:
- `0: bench`
- `1: lathe_machine`
- `2: electric_pole`

Export annotations in **YOLO format** (`<class_id> <x_center> <y_center> <width> <height>` normalized from 0.0 to 1.0).

### Step 2: Organize Dataset Directory
Organize the dataset under `dataset/`:
```
dataset/
├── data.yaml
├── images/
│   ├── train/  # e.g. bench_01.jpg, lathe_01.jpg, pole_01.jpg
│   └── val/    # e.g. bench_20.jpg, lathe_20.jpg, pole_20.jpg
└── labels/
    ├── train/  # e.g. bench_01.txt, lathe_01.txt, pole_01.txt
    └── val/    # e.g. bench_20.txt, lathe_20.txt, pole_20.txt
```

### Step 3: Initialize Dataset Template
Run `train_custom.py` to automatically generate `dataset/data.yaml`:
```bash
python train_custom.py --init-dataset-only
```

The generated `data.yaml` contains:
```yaml
path: /path/to/dataset
train: images/train
val: images/val
names:
  0: bench
  1: lathe_machine
  2: electric_pole
```

### Step 4: Run Training
Execute fine-tuning on top of pretrained YOLOv8 weights:
```bash
python train_custom.py --epochs 50 --batch 16 --imgsz 640 --backbone yolov8n.pt
```

During training, YOLOv8 applies data augmentations (mosaic, color jitter, scaling) and optimizes weights.
Once complete, the best weights are automatically saved to `models/custom_fire_objects.pt`.

### Step 5: Run the AR System with Your Custom Model
```bash
python main.py --model models/custom_fire_objects.pt --targets "bench,lathe_machine,electric_pole"
```

---

## ⚡ Performance Optimization

- **GPU Acceleration**: If an NVIDIA GPU with CUDA is available, PyTorch and YOLO will automatically utilize GPU acceleration for 90+ FPS.
- **CPU Performance**: Using `yolov8n.pt` (Nano) ensures smooth 30–60 FPS on standard modern CPU laptops.
- **Frame Interpolation**: Fire sprite rendering is decoupled from camera framerate, maintaining fluid 24+ FPS flame animations even under variable camera lighting.
