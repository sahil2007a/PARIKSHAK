"""
AR Virtual Fire Rendering System
Main Application Entry Point

Features:
- Real-time OpenCV video stream capture (Webcam / Video file / Synthetic test)
- YOLOv8 object detection with target class filtering
- Real-time animated virtual fire rendering anchored to detected target objects
- Multi-mode blending (Hybrid / Additive / Alpha)
- Modern AR HUD with FPS & Latency stats
- Interactive keyboard controls:
    [F] = Toggle Fire Rendering
    [D] = Toggle Bounding Boxes & Labels
    [B] = Cycle Blending Mode
    [S] = Save High-Res Screenshot
    [Q] / [ESC] = Exit
"""

import os
import sys
import time
import argparse
import cv2
import numpy as np

# Ensure local imports work reliably
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from detector import ObjectDetector, DEFAULT_TARGET_CLASSES
from fire_effect import FireEffect
from utils import (
    FPSCounter,
    generate_fire_sprite_sequence,
    draw_ar_hud,
    draw_detection_box,
    save_screenshot,
)


def parse_arguments():
    parser = argparse.ArgumentParser(description="Real-Time AR Virtual Fire Rendering System")
    parser.add_argument(
        "--source",
        type=str,
        default="0",
        help="Video source: camera index (e.g. '0'), video file path, or 'demo' for synthetic scene"
    )
    parser.add_argument(
        "--model",
        type=str,
        default="yolov8n.pt",
        help="Path to YOLO model weights (e.g. 'yolov8n.pt', 'models/custom_fire_objects.pt')"
    )
    parser.add_argument(
        "--targets",
        type=str,
        default="bench,lathe machine,electric pole,chair,couch,bottle,laptop,tv",
        help="Comma-separated list of target classes to apply virtual fire effect onto"
    )
    parser.add_argument(
        "--conf",
        type=float,
        default=0.35,
        help="Confidence threshold for object detector (0.0 to 1.0)"
    )
    parser.add_argument(
        "--blend",
        type=str,
        default="hybrid",
        choices=["hybrid", "additive", "alpha"],
        help="Fire blending mode (hybrid / additive / alpha)"
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1280,
        help="Desired camera frame capture width"
    )
    parser.add_argument(
        "--height",
        type=int,
        default=720,
        help="Desired camera frame capture height"
    )
    parser.add_argument(
        "--no-hud",
        action="store_true",
        help="Disable the AR HUD overlay"
    )
    return parser.parse_args()


def create_synthetic_demo_frame(frame_count: int, width: int = 1280, height: int = 720) -> np.ndarray:
    """
    Generates a realistic synthetic indoor room background with moving objects
    for headless or camera-less automated testing.
    """
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Gradient wall & floor background
    for y in range(height):
        if y < int(height * 0.65):
            # Wall gradient (slate blue-gray)
            val = int(45 + (y / (height * 0.65)) * 30)
            frame[y, :] = (val, val + 8, val + 15)
        else:
            # Floor gradient (dark wood/tile)
            val = int(25 + ((y - height * 0.65) / (height * 0.35)) * 40)
            frame[y, :] = (val, val + 12, val + 25)

    # Baseboard line
    cv2.line(frame, (0, int(height * 0.65)), (width, int(height * 0.65)), (70, 80, 95), 4)

    # Draw moving synthetic target object: A Park Bench / Table
    t = frame_count * 0.04
    bench_x = int(width * 0.40 + math.sin(t) * 120)
    bench_y = int(height * 0.52)
    bench_w, bench_h = 320, 140

    # Draw wooden bench backrest & seat
    cv2.rectangle(frame, (bench_x, bench_y), (bench_x + bench_w, bench_y + 35), (30, 75, 140), -1) # Backrest
    cv2.rectangle(frame, (bench_x, bench_y + 50), (bench_x + bench_w, bench_y + 80), (35, 85, 160), -1) # Seat
    # Bench legs
    cv2.rectangle(frame, (bench_x + 20, bench_y + 80), (bench_x + 35, bench_y + bench_h), (50, 50, 60), -1)
    cv2.rectangle(frame, (bench_x + bench_w - 35, bench_y + 80), (bench_x + bench_w - 20, bench_y + bench_h), (50, 50, 60), -1)

    # Draw moving synthetic target object: Electric Pole / Stool
    pole_x = int(width * 0.15)
    pole_y = int(height * 0.20)
    pole_w, pole_h = 60, 380
    cv2.rectangle(frame, (pole_x, pole_y), (pole_x + pole_w, pole_y + pole_h), (100, 110, 120), -1)
    # Pole crossbar
    cv2.rectangle(frame, (pole_x - 30, pole_y + 20), (pole_x + pole_w + 30, pole_y + 35), (80, 90, 100), -1)

    return frame


def run_system():
    args = parse_arguments()

    print("=" * 65)
    print("  🔥 AR VIRTUAL FIRE RENDERING SYSTEM (OpenCV + YOLO) 🔥  ")
    print("=" * 65)

    # 1. Ensure fire animation assets are ready
    assets_fire_dir = os.path.join(current_dir, "assets", "fire")
    if not os.path.exists(assets_fire_dir) or len(os.listdir(assets_fire_dir)) < 16:
        print("[Assets] Generating high-resolution transparent fire sprite sequence...")
        generate_fire_sprite_sequence(assets_fire_dir, num_frames=16)

    # 2. Parse target classes
    targets_list = [c.strip().lower() for c in args.targets.split(",") if c.strip()]
    print(f"[Config] Target Objects for Fire Effect: {targets_list}")

    # 3. Initialize YOLO Object Detector
    detector = ObjectDetector(
        model_path=args.model,
        conf_threshold=args.conf,
        target_classes=targets_list
    )

    # 4. Initialize Fire Rendering Engine
    fire_engine = FireEffect(
        assets_dir=assets_fire_dir,
        animation_fps=24.0,
        blend_mode=args.blend
    )

    # 5. Initialize FPS Tracker
    fps_counter = FPSCounter(window_size=30)

    # 6. Initialize Video Stream Source
    is_demo_mode = (args.source.lower() == "demo")
    cap = None

    if not is_demo_mode:
        # Check if source is numeric camera index or video file
        if args.source.isdigit():
            cam_idx = int(args.source)
            print(f"[Camera] Opening webcam index {cam_idx}...")
            cap = cv2.VideoCapture(cam_idx, cv2.CAP_DSHOW if sys.platform.startswith("win") else cv2.CAP_ANY)
        else:
            print(f"[Video] Opening media source '{args.source}'...")
            cap = cv2.VideoCapture(args.source)

        if cap is None or not cap.isOpened():
            print(f"[Camera] Warning: Could not open source '{args.source}'. Falling back to synthetic demo mode.")
            is_demo_mode = True
        else:
            # Set desired capture dimensions
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)

    # System States
    fire_enabled = True
    show_boxes = True
    frame_count = 0
    window_name = "AR Virtual Fire Rendering System [OpenCV + YOLO]"

    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name, min(1280, args.width), min(720, args.height))

    print("\n[Controls Active]")
    print("  - [F] : Toggle Virtual Fire Effect On/Off")
    print("  - [D] : Toggle Bounding Boxes and Labels")
    print("  - [B] : Cycle Blending Mode (Hybrid / Additive / Alpha)")
    print("  - [S] : Save Screenshot to 'screenshots/' folder")
    print("  - [Q] or [ESC] : Quit application\n")

    try:
        while True:
            # Frame Acquisition
            if is_demo_mode:
                frame = create_synthetic_demo_frame(frame_count, args.width, args.height)
                time.sleep(0.016) # ~60 FPS simulation
            else:
                ret, frame = cap.read()
                if not ret or frame is None:
                    # If video ended, loop it
                    if not args.source.isdigit():
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    else:
                        print("[Stream] Failed to read frame from webcam.")
                        break

            frame_count += 1
            fps = fps_counter.update()
            latency = fps_counter.current_latency

            # In demo mode, provide synthetic detections if needed, or run YOLO on synthesized frame
            detections = detector.detect(frame)
            
            # If in demo mode and YOLO didn't detect synthetic shapes, add mock detections
            if is_demo_mode and len(detections) == 0:
                t = frame_count * 0.04
                bench_x = int(args.width * 0.40 + math.sin(t) * 120)
                bench_y = int(args.height * 0.52)
                bench_w, bench_h = 320, 140
                
                detections.append({
                    "box": (bench_x, bench_y, bench_x + bench_w, bench_y + bench_h),
                    "class_id": 13,
                    "class_name": "bench",
                    "confidence": 0.94,
                    "is_target": True,
                    "center": (bench_x + bench_w / 2.0, bench_y + bench_h / 2.0),
                    "width": bench_w,
                    "height": bench_h
                })

            target_detections = [d for d in detections if d.get("is_target", False)]
            active_fires = 0

            # Render Virtual Fire Effect
            if fire_enabled and target_detections:
                frame, active_fires = fire_engine.render(frame, detections)
            elif not fire_enabled:
                active_fires = 0

            # Draw Detection Bounding Boxes & Labels
            if show_boxes:
                for det in detections:
                    draw_detection_box(
                        frame=frame,
                        box=det["box"],
                        label=det["class_name"],
                        conf=det["confidence"],
                        is_target=det.get("is_target", False)
                    )

            # Draw AR HUD Overlay
            if not args.no_hud:
                frame = draw_ar_hud(
                    frame=frame,
                    fps=fps,
                    latency_ms=latency,
                    target_count=len(target_detections),
                    active_fires=active_fires,
                    fire_enabled=fire_enabled,
                    blend_mode=fire_engine.blend_mode,
                    show_boxes=show_boxes,
                    target_classes=targets_list
                )

            # Display Output
            cv2.imshow(window_name, frame)

            # Handle Keyboard Input
            key = cv2.waitKey(1) & 0xFF
            if key in [ord("q"), ord("Q"), 27]: # Q or ESC
                print("[App] Quitting application...")
                break
            elif key in [ord("f"), ord("F")]:
                fire_enabled = not fire_enabled
                print(f"[Control] Virtual Fire: {'ENABLED' if fire_enabled else 'DISABLED'}")
            elif key in [ord("d"), ord("D")]:
                show_boxes = not show_boxes
                print(f"[Control] Bounding Boxes: {'ENABLED' if show_boxes else 'DISABLED'}")
            elif key in [ord("b"), ord("B")]:
                new_mode = fire_engine.cycle_blend_mode()
                print(f"[Control] Fire Blending Mode changed to: {new_mode.upper()}")
            elif key in [ord("s"), ord("S")]:
                screenshot_path = save_screenshot(frame)
                print(f"[Screenshot] Saved screenshot to: {screenshot_path}")

    except KeyboardInterrupt:
        print("\n[App] Interrupted by user.")
    finally:
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()
        print("[App] Cleanup completed.")


if __name__ == "__main__":
    run_system()
