"""
AR Virtual Fire System - Object Detection Module
Wraps Ultralytics YOLOv8 for real-time target detection and bounding box extraction.
Supports pretrained COCO models (bench, chair, etc.) and custom trained models (lathe machine, electric pole).
"""

import os
from typing import List, Dict, Any, Optional
import numpy as np
from ultralytics import YOLO


DEFAULT_TARGET_CLASSES = [
    # Required primary targets
    "bench",
    "lathe machine",
    "lathe",
    "electric pole",
    "utility pole",
    "pole",
    # Everyday fallback objects for instant webcam testing
    "chair",
    "couch",
    "bottle",
    "cup",
    "laptop",
    "tv",
]


class ObjectDetector:
    """
    YOLO-based Object Detector for identifying objects to apply virtual AR fire.
    """
    def __init__(
        self,
        model_path: str = "yolov8n.pt",
        conf_threshold: float = 0.35,
        iou_threshold: float = 0.45,
        target_classes: Optional[List[str]] = None,
        device: str = "auto"
    ):
        """
        Initialize detector with specified YOLO model and target class filter.
        """
        self.model_path = model_path
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        self.target_classes = [c.lower().strip() for c in (target_classes or DEFAULT_TARGET_CLASSES)]
        
        # Resolve model path
        resolved_path = model_path
        if not os.path.exists(resolved_path) and os.path.exists(os.path.join("models", model_path)):
            resolved_path = os.path.join("models", model_path)
            
        # Load YOLO model
        print(f"[Detector] Loading YOLO model from '{resolved_path}' (Device: {device})...")
        self.model = YOLO(resolved_path)
        self.class_names = self.model.names if hasattr(self.model, "names") else {}
        print(f"[Detector] Model loaded with {len(self.class_names)} known classes.")

    def set_target_classes(self, classes: List[str]):
        """Update active target classes dynamically."""
        self.target_classes = [c.lower().strip() for c in classes]

    def is_target(self, class_name: str) -> bool:
        """Check if detected class matches any of the target object criteria."""
        c_lower = class_name.lower().strip()
        # Direct match or substring match (e.g. 'lathe' in 'lathe machine')
        for target in self.target_classes:
            if target == c_lower or target in c_lower or c_lower in target:
                return True
        return False

    def detect(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Perform object detection on an input BGR OpenCV image/frame.
        
        Returns:
            List of dictionaries containing:
            - 'box': (x1, y1, x2, y2)
            - 'class_id': int
            - 'class_name': str
            - 'confidence': float
            - 'is_target': bool
            - 'center': (cx, cy)
            - 'width': float
            - 'height': float
        """
        # Run inference (verbose=False for high FPS and clean logs)
        results = self.model(
            frame,
            conf=self.conf_threshold,
            iou=self.iou_threshold,
            verbose=False
        )

        detections = []
        if not results or len(results) == 0:
            return detections

        result = results[0]
        boxes = result.boxes

        if boxes is None or len(boxes) == 0:
            return detections

        for box in boxes:
            xyxy = box.xyxy[0].cpu().numpy()
            conf = float(box.conf[0].cpu().numpy())
            cls_id = int(box.cls[0].cpu().numpy())
            cls_name = self.class_names.get(cls_id, f"class_{cls_id}")

            x1, y1, x2, y2 = float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])
            w = max(1.0, x2 - x1)
            h = max(1.0, y2 - y1)
            cx = x1 + w / 2.0
            cy = y1 + h / 2.0

            target_flag = self.is_target(cls_name)

            detections.append({
                "box": (x1, y1, x2, y2),
                "class_id": cls_id,
                "class_name": cls_name,
                "confidence": conf,
                "is_target": target_flag,
                "center": (cx, cy),
                "width": w,
                "height": h
            })

        return detections
