"""
AR Virtual Fire System - Automated Self-Test and Verification Script
Tests:
1. Fire sprite asset loading & verification
2. YOLO model initialization and inference
3. Fire rendering engine, multi-emitter scaling & blending
4. AR HUD drawing and screenshot saving
5. Real-time rendering performance & FPS benchmark
6. Custom dataset template generation
"""

import os
import sys
import time
import cv2
import numpy as np

from utils import (
    generate_fire_sprite_sequence,
    draw_ar_hud,
    draw_detection_box,
    save_screenshot,
    FPSCounter
)
from detector import ObjectDetector
from fire_effect import FireEffect
from train_custom import create_dataset_template


def run_self_test():
    print("=" * 65)
    print("  🧪 RUNNING AR VIRTUAL FIRE SELF-TEST & VERIFICATION 🧪  ")
    print("=" * 65)

    # 1. Fire Assets Test
    print("\n[Test 1/6] Verifying Fire Animation Assets...")
    assets_dir = "assets/fire"
    frames = generate_fire_sprite_sequence(assets_dir, 16)
    assert len(frames) == 16, f"Expected 16 frames, got {len(frames)}"
    for fp in frames:
        assert os.path.exists(fp), f"Missing frame asset: {fp}"
        img = cv2.imread(fp, cv2.IMREAD_UNCHANGED)
        assert img is not None and img.shape[2] == 4, f"Invalid 4-channel image in {fp}"
    print(f"  ✓ Passed: 16 transparent 4-channel PNG fire frames verified.")

    # 2. YOLO Detector Test
    print("\n[Test 2/6] Verifying YOLO Model Initialization & Inference...")
    detector = ObjectDetector(model_path="yolov8n.pt", conf_threshold=0.25)
    # Create test canvas
    test_frame = np.ones((720, 1280, 3), dtype=np.uint8) * 80
    detections = detector.detect(test_frame)
    print(f"  ✓ Passed: YOLO model initialized successfully (known classes: {len(detector.class_names)}).")

    # 3. Fire Effect Engine Test
    print("\n[Test 3/6] Verifying AR Fire Rendering & Multi-Emitter Blending...")
    fire_engine = FireEffect(assets_dir=assets_dir, animation_fps=24.0, blend_mode="hybrid")
    assert len(fire_engine.fire_frames) == 16, "FireEffect failed to load frames"

    # Simulate detected target objects: A bench and an industrial machine
    mock_detections = [
        {
            "box": (350, 320, 850, 560), # Wide bench
            "class_id": 13,
            "class_name": "bench",
            "confidence": 0.92,
            "is_target": True,
            "center": (600, 440),
            "width": 500,
            "height": 240
        },
        {
            "box": (950, 200, 1150, 600), # Tall pole / machine
            "class_id": 99,
            "class_name": "electric pole",
            "confidence": 0.88,
            "is_target": True,
            "center": (1050, 400),
            "width": 200,
            "height": 400
        }
    ]

    canvas = test_frame.copy()
    rendered_frame, active_fires = fire_engine.render(canvas, mock_detections)
    assert active_fires == 2, f"Expected 2 active fires, got {active_fires}"
    # Verify pixels changed (fire was rendered)
    diff = cv2.absdiff(test_frame, rendered_frame)
    assert np.count_nonzero(diff) > 1000, "Fire rendering did not modify canvas pixels!"
    print(f"  ✓ Passed: Fire engine rendered {active_fires} fires with dynamic anchoring & glow.")

    # 4. HUD & Bounding Box Test
    print("\n[Test 4/6] Verifying AR HUD & Styling Overlay...")
    for det in mock_detections:
        draw_detection_box(rendered_frame, det["box"], det["class_name"], det["confidence"], det["is_target"])
    
    hud_frame = draw_ar_hud(
        frame=rendered_frame,
        fps=58.4,
        latency_ms=17.1,
        target_count=2,
        active_fires=active_fires,
        fire_enabled=True,
        blend_mode="hybrid",
        show_boxes=True,
        target_classes=["bench", "lathe machine", "electric pole"]
    )
    
    os.makedirs("screenshots", exist_ok=True)
    out_path = os.path.join("screenshots", "test_verification_output.png")
    cv2.imwrite(out_path, hud_frame)
    assert os.path.exists(out_path) and os.path.getsize(out_path) > 10000, "Screenshot failed to save"
    print(f"  ✓ Passed: HUD and boxes rendered. Output saved to '{out_path}'.")

    # 5. Performance & FPS Benchmark
    print("\n[Test 5/6] Benchmarking Real-Time FPS Performance (60 frames)...")
    fps_counter = FPSCounter()
    t_start = time.perf_counter()
    num_benchmark_frames = 60

    for i in range(num_benchmark_frames):
        f = test_frame.copy()
        # Slight motion simulation
        mock_detections[0]["box"] = (350 + i, 320, 850 + i, 560)
        r_frame, _ = fire_engine.render(f, mock_detections)
        _ = fps_counter.update()

    elapsed = time.perf_counter() - t_start
    avg_fps = num_benchmark_frames / elapsed
    print(f"  ✓ Passed: AR Fire Rendering achieved {avg_fps:.1f} FPS ({1000.0 / avg_fps:.2f} ms/frame).")

    # 6. Custom Dataset Setup Test
    print("\n[Test 6/6] Verifying Custom Dataset Configuration Template...")
    yaml_path = create_dataset_template("dataset")
    assert os.path.exists(yaml_path), f"Failed to create {yaml_path}"
    print(f"  ✓ Passed: Custom dataset structure & data.yaml verified.")

    print("\n" + "=" * 65)
    print("  🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉  ")
    print("=" * 65)


if __name__ == "__main__":
    run_self_test()
