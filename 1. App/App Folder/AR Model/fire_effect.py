"""
AR Virtual Fire System - Fire Rendering & Animation Module
Features:
- Animated transparent PNG fire sprite frames playback
- Multi-emitter fire distribution for wide objects (e.g. benches, machinery)
- Temporal bounding box smoothing (EMA) to prevent jitter
- Multiple AR blending modes: Alpha, Additive, and Hybrid Glow
- Dynamic rising ember sparks and ambient ground illumination
"""

import os
import glob
import time
import math
import random
from typing import List, Dict, Tuple, Optional
import cv2
import numpy as np


class FireInstance:
    """Tracks and smooths a single burning object's bounding box over time."""
    def __init__(self, box: Tuple[float, float, float, float], class_name: str, phase_offset: float = 0.0):
        self.box = list(box) # [x1, y1, x2, y2]
        self.class_name = class_name
        self.phase_offset = phase_offset
        self.alpha_smooth = 0.45 # Smoothing factor
        self.disappeared_frames = 0
        self.intensity = 1.0 # 0.0 to 1.0 (for fade-in/fade-out)
        self.particles = []  # Active rising embers

    def update(self, new_box: Tuple[float, float, float, float]):
        """Smoothly interpolate towards new box coordinates."""
        for i in range(4):
            self.box[i] = self.alpha_smooth * new_box[i] + (1.0 - self.alpha_smooth) * self.box[i]
        self.disappeared_frames = 0
        self.intensity = min(1.0, self.intensity + 0.15)

    def mark_missing(self):
        """Fade out when detection is temporarily lost."""
        self.disappeared_frames += 1
        self.intensity = max(0.0, self.intensity - 0.20)

    @property
    def is_alive(self) -> bool:
        return self.disappeared_frames < 6 and self.intensity > 0.05


class FireEffect:
    """
    AR Fire Engine that loads animated transparent PNG fire frames and renders
    realistic dynamic flames over detected objects in real-time.
    """
    def __init__(self, assets_dir: str = "assets/fire", animation_fps: float = 24.0, blend_mode: str = "hybrid"):
        self.assets_dir = assets_dir
        self.animation_fps = animation_fps
        self.blend_mode = blend_mode.lower() # 'alpha', 'additive', 'hybrid'
        self.fire_frames = [] # List of BGRA numpy arrays
        self.tracked_instances: Dict[int, FireInstance] = {}
        self.next_instance_id = 0
        
        self.load_frames()

    def load_frames(self):
        """Loads all transparent PNG fire frames into RAM."""
        frame_files = sorted(glob.glob(os.path.join(self.assets_dir, "frame_*.png")))
        if not frame_files:
            # Check if assets exist in parent or relative path
            fallback_dir = os.path.join(os.path.dirname(__file__), "assets", "fire")
            frame_files = sorted(glob.glob(os.path.join(fallback_dir, "frame_*.png")))
        
        self.fire_frames = []
        for fp in frame_files:
            img = cv2.imread(fp, cv2.IMREAD_UNCHANGED)
            if img is not None and img.shape[2] == 4:
                self.fire_frames.append(img)

        if not self.fire_frames:
            print(f"[FireEffect] Warning: No valid 4-channel PNG frames found in '{self.assets_dir}'.")
        else:
            print(f"[FireEffect] Successfully loaded {len(self.fire_frames)} fire animation frames.")

    def set_blend_mode(self, mode: str):
        """Switch blending mode ('alpha', 'additive', 'hybrid')."""
        if mode in ["alpha", "additive", "hybrid"]:
            self.blend_mode = mode

    def cycle_blend_mode(self) -> str:
        """Cycle through blending modes and return current."""
        modes = ["hybrid", "additive", "alpha"]
        current_idx = modes.index(self.blend_mode) if self.blend_mode in modes else 0
        self.blend_mode = modes[(current_idx + 1) % len(modes)]
        return self.blend_mode

    def _match_and_update_instances(self, detections: List[Dict]):
        """Match incoming detections with existing fire instances to smooth motion."""
        target_dets = [d for d in detections if d.get("is_target", False)]
        unmatched_instances = set(self.tracked_instances.keys())

        for det in target_dets:
            box = det["box"]
            bx1, by1, bx2, by2 = box
            bcx, bcy = (bx1 + bx2) / 2.0, (by1 + by2) / 2.0
            
            best_id = None
            best_dist = float("inf")

            for inst_id in unmatched_instances:
                inst = self.tracked_instances[inst_id]
                ix1, iy1, ix2, iy2 = inst.box
                icx, icy = (ix1 + ix2) / 2.0, (iy1 + iy2) / 2.0
                dist = math.hypot(bcx - icx, bcy - icy)
                
                # Check maximum association distance based on box dimensions
                max_allowable_dist = max(bx2 - bx1, by2 - by1) * 0.85
                if dist < max_allowable_dist and dist < best_dist:
                    best_dist = dist
                    best_id = inst_id

            if best_id is not None:
                self.tracked_instances[best_id].update(box)
                unmatched_instances.remove(best_id)
            else:
                # Create new instance
                new_id = self.next_instance_id
                self.next_instance_id += 1
                phase = random.uniform(0.0, 10.0)
                self.tracked_instances[new_id] = FireInstance(box, det["class_name"], phase)

        # Mark missing instances and remove dead ones
        for inst_id in unmatched_instances:
            self.tracked_instances[inst_id].mark_missing()

        # Prune inactive instances
        self.tracked_instances = {
            k: v for k, v in self.tracked_instances.items() if v.is_alive
        }

    def _render_fire_sprite(self, frame: np.ndarray, sprite_bgra: np.ndarray, 
                            center_x: int, base_y: int, 
                            render_w: int, render_h: int, 
                            intensity: float = 1.0):
        """
        Overlays a transparent fire sprite anchored at (center_x, base_y) onto frame.
        """
        frame_h, frame_w = frame.shape[:2]
        
        # Calculate target bounding coordinates on canvas
        x1 = int(center_x - render_w // 2)
        x2 = x1 + render_w
        y2 = int(base_y)
        y1 = y2 - render_h

        # Clip against frame bounds
        crop_x1 = max(0, x1)
        crop_y1 = max(0, y1)
        crop_x2 = min(frame_w, x2)
        crop_y2 = min(frame_h, y2)

        if crop_x1 >= crop_x2 or crop_y1 >= crop_y2:
            return

        # Resize sprite to requested dimensions
        resized_sprite = cv2.resize(sprite_bgra, (render_w, render_h), interpolation=cv2.INTER_LINEAR)

        # Calculate corresponding sprite crop coordinates
        sprite_x1 = crop_x1 - x1
        sprite_y1 = crop_y1 - y1
        sprite_x2 = sprite_x1 + (crop_x2 - crop_x1)
        sprite_y2 = sprite_y1 + (crop_y2 - crop_y1)

        sprite_crop = resized_sprite[sprite_y1:sprite_y2, sprite_x1:sprite_x2]
        frame_roi = frame[crop_y1:crop_y2, crop_x1:crop_x2]

        # Extract BGR and normalized Alpha
        fire_bgr = sprite_crop[:, :, :3].astype(np.float32)
        fire_alpha = (sprite_crop[:, :, 3].astype(np.float32) / 255.0) * intensity
        fire_alpha = np.expand_dims(fire_alpha, axis=-1)

        # Apply Blending Mode
        if self.blend_mode == "alpha":
            # Pure Alpha Compositing
            blended = frame_roi.astype(np.float32) * (1.0 - fire_alpha) + fire_bgr * fire_alpha
            frame[crop_y1:crop_y2, crop_x1:crop_x2] = np.clip(blended, 0, 255).astype(np.uint8)

        elif self.blend_mode == "additive":
            # Additive Glow
            blended = frame_roi.astype(np.float32) + (fire_bgr * fire_alpha * 1.1)
            frame[crop_y1:crop_y2, crop_x1:crop_x2] = np.clip(blended, 0, 255).astype(np.uint8)

        else: # "hybrid" (Recommended realistic AR)
            # Core is additive for intense heat, outer boundary is smoothly alpha-blended
            alpha_bg = 1.0 - (fire_alpha * 0.70)
            core_boost = np.clip((fire_alpha - 0.4) * 1.5, 0.0, 1.0)
            base_blend = frame_roi.astype(np.float32) * alpha_bg + fire_bgr * fire_alpha
            additive_core = fire_bgr * core_boost * 0.45
            blended = np.clip(base_blend + additive_core, 0, 255).astype(np.uint8)
            frame[crop_y1:crop_y2, crop_x1:crop_x2] = blended

    def _render_ambient_glow(self, frame: np.ndarray, cx: int, cy: int, radius: int, intensity: float):
        """Adds a subtle warm flickering ambient orange light illumination onto the object surface."""
        h, w = frame.shape[:2]
        x1 = max(0, cx - radius)
        y1 = max(0, cy - radius)
        x2 = min(w, cx + radius)
        y2 = min(h, cy + radius)
        if x1 >= x2 or y1 >= y2:
            return

        roi = frame[y1:y2, x1:x2]
        gh, gw = roi.shape[:2]
        
        # Radial gradient mask
        y, x = np.ogrid[:gh, :gw]
        dist_from_center = np.sqrt((x - (cx - x1)) ** 2 + (y - (cy - y1)) ** 2)
        mask = np.clip(1.0 - dist_from_center / radius, 0.0, 1.0) ** 2.0
        mask = np.expand_dims(mask, axis=-1) * intensity * 0.35

        # Warm amber/orange light (BGR: 20, 100, 220)
        glow_color = np.array([20, 100, 220], dtype=np.float32)
        glow_layer = np.ones_like(roi, dtype=np.float32) * glow_color

        frame[y1:y2, x1:x2] = np.clip(roi.astype(np.float32) + glow_layer * mask, 0, 255).astype(np.uint8)

    def render(self, frame: np.ndarray, detections: List[Dict]) -> Tuple[np.ndarray, int]:
        """
        Renders virtual fire over all tracked target objects in real time.
        
        Returns:
            - modified frame with fire rendered
            - count of active burning objects
        """
        if not self.fire_frames:
            return frame, 0

        # Update and smooth tracked fire instances
        self._match_and_update_instances(detections)
        num_frames = len(self.fire_frames)
        current_time = time.time()
        active_fires_count = len(self.tracked_instances)

        for inst_id, inst in self.tracked_instances.items():
            x1, y1, x2, y2 = inst.box
            obj_w = max(20.0, x2 - x1)
            obj_h = max(20.0, y2 - y1)
            aspect_ratio = obj_w / obj_h

            # Organic flickering oscillation
            flicker = 1.0 + 0.08 * math.sin(current_time * 18.0 + inst.phase_offset)

            # Determine number of flame emitters based on object width
            # For wide objects (like benches, tables, lathe machines), distribute multiple flame tongues
            if aspect_ratio > 1.3:
                num_emitters = max(2, min(5, int(obj_w / 70.0)))
            else:
                num_emitters = 1

            emitter_spacing = obj_w / (num_emitters + 1)
            
            # Base anchor Y: anchor along the lower 25% or middle of the object
            base_anchor_y = y2 - (obj_h * 0.15)
            flame_h = int(obj_h * 1.35 * flicker)
            flame_w = int((obj_w / num_emitters) * 1.45 * flicker)

            # 1. Warm Ambient Object Glow
            center_x = int((x1 + x2) / 2.0)
            center_y = int((y1 + y2) / 2.0)
            glow_radius = int(max(obj_w, obj_h) * 0.75)
            self._render_ambient_glow(frame, center_x, center_y, glow_radius, inst.intensity * flicker)

            # 2. Render Flame Sprites for each emitter
            for emitter_idx in range(num_emitters):
                emitter_x = int(x1 + (emitter_idx + 1) * emitter_spacing)
                
                # Dynamic frame indexing with unique phase per emitter
                t_offset = inst.phase_offset + emitter_idx * 2.7
                frame_idx = int((current_time * self.animation_fps + t_offset) % num_frames)
                sprite = self.fire_frames[frame_idx]

                # Slight height variation among emitters for natural chaotic fire look
                emitter_flame_h = int(flame_h * (0.90 + 0.20 * math.sin(current_time * 14.0 + emitter_idx)))
                emitter_flame_w = int(flame_w * (0.95 + 0.10 * math.cos(current_time * 12.0 + emitter_idx)))

                self._render_fire_sprite(
                    frame=frame,
                    sprite_bgra=sprite,
                    center_x=emitter_x,
                    base_y=int(base_anchor_y),
                    render_w=emitter_flame_w,
                    render_h=emitter_flame_h,
                    intensity=inst.intensity
                )

        return frame, active_fires_count
