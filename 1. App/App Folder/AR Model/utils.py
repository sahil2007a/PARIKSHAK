"""
AR Virtual Fire System - Utilities Module
Provides:
- FPS calculation and latency tracking
- Procedural transparent animated fire sprite generator (PNG sequence)
- AR Cyberpunk/Modern HUD overlay rendering
- Object bounding box stylized drawing
- Screenshot capture utility
"""

import os
import time
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


class FPSCounter:
    """Calculates smooth moving-average FPS and frame latency."""
    def __init__(self, window_size: int = 30):
        self.window_size = window_size
        self.timestamps = []
        self.last_frame_time = time.perf_counter()
        self.latency_ms = 0.0

    def update(self) -> float:
        current_time = time.perf_counter()
        self.latency_ms = (current_time - self.last_frame_time) * 1000.0
        self.last_frame_time = current_time

        self.timestamps.append(current_time)
        if len(self.timestamps) > self.window_size:
            self.timestamps.pop(0)

        if len(self.timestamps) < 2:
            return 0.0

        elapsed = self.timestamps[-1] - self.timestamps[0]
        if elapsed <= 0:
            return 0.0
        return (len(self.timestamps) - 1) / elapsed

    @property
    def current_latency(self) -> float:
        return self.latency_ms


def generate_fire_sprite_sequence(output_dir: str, num_frames: int = 16, width: int = 256, height: int = 384) -> list:
    """
    Procedurally synthesizes a seamlessly looping sequence of organic, high-fidelity
    transparent PNG fire animation frames with glowing cores, flame tongues, and embers.
    """
    os.makedirs(output_dir, exist_ok=True)
    generated_paths = []

    # Palette definition (normalized 0..1 in height, mapping to RGBA)
    # 0 = base (bright yellow-white), 0.35 = body (orange), 0.7 = flame tip (red-orange), 1.0 = smoke/alpha 0
    np.random.seed(42)

    # Base noise parameters for looping animation
    num_particles = 90
    particle_seeds = np.random.uniform(0, 1, (num_particles, 4)) # [x_base, speed, phase, size]

    for frame_idx in range(num_frames):
        filename = f"frame_{frame_idx:02d}.png"
        filepath = os.path.join(output_dir, filename)
        generated_paths.append(filepath)

        # If already exists and valid, skip regeneration
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1024:
            continue

        # Phase angle for seamless periodic looping
        theta = (2 * math.pi * frame_idx) / num_frames

        # Create high-res blank RGBA canvas
        canvas = np.zeros((height, width, 4), dtype=np.float32)

        # Coordinate grid
        y_indices, x_indices = np.indices((height, width))
        x_norm = (x_indices - width / 2.0) / (width / 2.0) # -1.0 to 1.0
        y_norm = 1.0 - (y_indices / height)               # 0.0 (bottom) to 1.0 (top)

        # 1. Main Flame Tongues (Multi-octave sine/cosine turbulent waves)
        # Squeeze horizontal width near top to form flame teardrop
        flame_width_profile = np.clip(1.0 - (y_norm ** 0.85) * 0.92, 0.05, 1.0)
        
        wave1 = 0.18 * np.sin(y_norm * 14.0 - theta * 2.0) * y_norm
        wave2 = 0.12 * np.cos(y_norm * 22.0 + theta * 3.0) * (y_norm ** 1.3)
        wave3 = 0.08 * np.sin(x_norm * 8.0 + theta * 1.5) * (y_norm ** 0.7)
        turbulent_x = x_norm / (flame_width_profile + 1e-4) + wave1 + wave2 + wave3

        # Base flame intensity field
        radial_dist = turbulent_x ** 2
        height_attenuation = np.clip(1.0 - (y_norm / 0.88), 0.0, 1.0)
        flame_core = np.exp(-radial_dist * 4.5) * (height_attenuation ** 1.1)

        # Secondary licking tongues (left & right tendrils)
        tongue_left = np.exp(-((x_norm + 0.22 - 0.1 * np.sin(y_norm * 16.0 + theta * 2.5)) ** 2) * 18.0) * np.clip(1.0 - y_norm / 0.75, 0.0, 1.0) * 0.7
        tongue_right = np.exp(-((x_norm - 0.22 + 0.1 * np.cos(y_norm * 18.0 - theta * 2.5)) ** 2) * 18.0) * np.clip(1.0 - y_norm / 0.78, 0.0, 1.0) * 0.7

        total_intensity = np.clip(flame_core + tongue_left + tongue_right, 0.0, 1.0)

        # Apply color grading based on temperature & height
        # Core (White / Light Golden Yellow) -> Body (Vibrant Orange) -> Mantle (Fire Red) -> Outer Smoke (Dark Crimson / Transparent)
        alpha = np.clip(total_intensity * 1.6, 0.0, 1.0)
        # Soften edges
        alpha = (alpha ** 1.3) * 255.0

        # Colors in BGR (0..255)
        # Base incandescent yellow-white: (130, 240, 255)
        # Mid orange: (25, 140, 255)
        # Red mantle: (10, 40, 240)
        # Outer smoke: (15, 15, 80)
        t = total_intensity
        b = np.clip((t ** 3.0) * 180 + (t ** 1.5) * 40, 0, 255)
        g = np.clip((t ** 1.8) * 220 + (t ** 3.0) * 35, 0, 255)
        r = np.clip((t ** 0.8) * 255, 0, 255)

        canvas[:, :, 0] = b  # Blue
        canvas[:, :, 1] = g  # Green
        canvas[:, :, 2] = r  # Red
        canvas[:, :, 3] = alpha  # Alpha

        # 2. Add Floating Dynamic Embers
        for p_idx in range(num_particles):
            p_base_x, p_speed, p_phase, p_size = particle_seeds[p_idx]
            # Height progression over time
            p_progress = (frame_idx / num_frames * p_speed + p_phase) % 1.0
            p_y = int((1.0 - (p_progress * 0.95)) * height)
            sway = 0.15 * math.sin(p_progress * 12.0 + theta * 3.0 + p_idx)
            p_x = int((width / 2.0) + (p_base_x - 0.5 + sway) * (width * 0.6))
            
            p_radius = int(1 + p_size * 2.5)
            p_alpha = int(255 * math.sin(p_progress * math.pi) * (1.0 - p_progress * 0.4))
            
            if 0 <= p_x < width and 0 <= p_y < height and p_alpha > 10:
                cv2.circle(canvas, (p_x, p_y), p_radius, (100, 230, 255, p_alpha), -1)

        # Smooth and anti-alias the sprite
        canvas_uint8 = np.clip(canvas, 0, 255).astype(np.uint8)
        # Soft gaussian blur on alpha channel for smoky gradient edge
        canvas_uint8[:, :, 3] = cv2.GaussianBlur(canvas_uint8[:, :, 3], (5, 5), 1.5)
        
        # Save as PNG with alpha
        cv2.imwrite(filepath, canvas_uint8)

    return generated_paths


def draw_ar_hud(frame: np.ndarray, fps: float, latency_ms: float, 
                target_count: int, active_fires: int, 
                fire_enabled: bool, blend_mode: str, 
                show_boxes: bool, target_classes: list) -> np.ndarray:
    """
    Renders an AR HUD overlay on top of the OpenCV video frame.
    Includes Glassmorphism stats panel, live status badge, and control keys.
    """
    h, w = frame.shape[:2]
    overlay = frame.copy()

    # Glassmorphism Top-Left Info Card
    card_w, card_h = 340, 160
    card_x, card_y = 20, 20
    
    # Dark translucent background
    cv2.rectangle(overlay, (card_x, card_y), (card_x + card_w, card_y + card_h), (18, 22, 28), -1)
    
    # Apply alpha blending for glass effect
    alpha = 0.72
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    # Stylish border with neon accent top bar
    cv2.rectangle(frame, (card_x, card_y), (card_x + card_w, card_y + card_h), (65, 75, 90), 1)
    cv2.line(frame, (card_x, card_y), (card_x + card_w, card_y), (0, 140, 255), 3) # Fiery orange header bar

    # Header Title
    cv2.putText(frame, "AR VIRTUAL FIRE ENGINE", (card_x + 14, card_y + 24),
                cv2.FONT_HERSHEY_DUPLEX, 0.58, (255, 255, 255), 1, cv2.LINE_AA)
    
    # Live Status Indicator Dot
    status_color = (0, 220, 100) if fire_enabled else (80, 80, 220)
    cv2.circle(frame, (card_x + card_w - 20, card_y + 20), 6, status_color, -1)
    cv2.circle(frame, (card_x + card_w - 20, card_y + 20), 9, status_color, 1)

    # FPS & Latency
    fps_color = (0, 255, 128) if fps >= 25 else ((0, 215, 255) if fps >= 15 else (60, 60, 255))
    cv2.putText(frame, f"FPS: {fps:5.1f}", (card_x + 14, card_y + 55),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, fps_color, 2, cv2.LINE_AA)
    cv2.putText(frame, f"({latency_ms:4.1f} ms)", (card_x + 135, card_y + 55),
                cv2.FONT_HERSHEY_SIMPLEX, 0.50, (180, 190, 200), 1, cv2.LINE_AA)

    # Fire Status & Blending Mode
    fire_text = f"FIRE FX: {'ACTIVE' if fire_enabled else 'PAUSED'} [{blend_mode.upper()}]"
    fire_color = (40, 165, 255) if fire_enabled else (120, 120, 140)
    cv2.putText(frame, fire_text, (card_x + 14, card_y + 85),
                cv2.FONT_HERSHEY_SIMPLEX, 0.52, fire_color, 1, cv2.LINE_AA)

    # Target & Fire Counts
    counts_text = f"Detected: {target_count}  |  Active Fires: {active_fires}"
    cv2.putText(frame, counts_text, (card_x + 14, card_y + 115),
                cv2.FONT_HERSHEY_SIMPLEX, 0.48, (220, 220, 220), 1, cv2.LINE_AA)

    # Targets list
    targets_preview = ", ".join(target_classes[:3]) + (f" +{len(target_classes)-3}" if len(target_classes) > 3 else "")
    cv2.putText(frame, f"Targets: {targets_preview}", (card_x + 14, card_y + 142),
                cv2.FONT_HERSHEY_SIMPLEX, 0.42, (150, 160, 175), 1, cv2.LINE_AA)

    # Bottom Control Bar Banner
    bar_h = 32
    bar_y = h - bar_h - 10
    bar_w = min(w - 40, 720)
    bar_x = (w - bar_w) // 2

    bar_overlay = frame.copy()
    cv2.rectangle(bar_overlay, (bar_x, bar_y), (bar_x + bar_w, bar_y + bar_h), (15, 18, 24), -1)
    cv2.addWeighted(bar_overlay, 0.75, frame, 0.25, 0, frame)
    cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_w, bar_y + bar_h), (50, 60, 75), 1)

    hotkeys_text = "[F] Toggle Fire   [D] Toggle Boxes   [B] Blend Mode   [S] Screenshot   [Q] Quit"
    text_size = cv2.getTextSize(hotkeys_text, cv2.FONT_HERSHEY_SIMPLEX, 0.44, 1)[0]
    tx = bar_x + (bar_w - text_size[0]) // 2
    ty = bar_y + 21
    cv2.putText(frame, hotkeys_text, (tx, ty), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (210, 225, 240), 1, cv2.LINE_AA)

    return frame


def draw_detection_box(frame: np.ndarray, box: tuple, label: str, conf: float, is_target: bool = True) -> np.ndarray:
    """
    Draws a bounding box with glowing corner accents and badge label.
    """
    x1, y1, x2, y2 = [int(v) for v in box]
    
    # Colors (BGR)
    theme_color = (0, 140, 255) if is_target else (180, 180, 180) # Orange for target fire objects, Gray for others
    glow_color = (0, 215, 255) if is_target else (220, 220, 220)

    # Main thin rectangle
    cv2.rectangle(frame, (x1, y1), (x2, y2), theme_color, 1, cv2.LINE_AA)

    # Corner brackets (Cyberpunk / AR corner markers)
    corner_len = max(12, min(int((x2 - x1) * 0.15), int((y2 - y1) * 0.15), 25))
    thick = 2
    
    # Top-Left
    cv2.line(frame, (x1, y1), (x1 + corner_len, y1), glow_color, thick, cv2.LINE_AA)
    cv2.line(frame, (x1, y1), (x1, y1 + corner_len), glow_color, thick, cv2.LINE_AA)
    # Top-Right
    cv2.line(frame, (x2, y1), (x2 - corner_len, y1), glow_color, thick, cv2.LINE_AA)
    cv2.line(frame, (x2, y1), (x2, y1 + corner_len), glow_color, thick, cv2.LINE_AA)
    # Bottom-Left
    cv2.line(frame, (x1, y2), (x1 + corner_len, y2), glow_color, thick, cv2.LINE_AA)
    cv2.line(frame, (x1, y2), (x1, y2 - corner_len), glow_color, thick, cv2.LINE_AA)
    # Bottom-Right
    cv2.line(frame, (x2, y2), (x2 - corner_len, y2), glow_color, thick, cv2.LINE_AA)
    cv2.line(frame, (x2, y2), (x2, y2 - corner_len), glow_color, thick, cv2.LINE_AA)

    # Label Badge
    tag_text = f"{label.upper()} {conf * 100:.0f}%"
    (tw, th), baseline = cv2.getTextSize(tag_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
    
    badge_y1 = max(0, y1 - th - 10)
    badge_y2 = badge_y1 + th + 8
    badge_x2 = x1 + tw + 12

    # Draw filled badge
    cv2.rectangle(frame, (x1, badge_y1), (badge_x2, badge_y2), theme_color, -1)
    # Draw label text
    cv2.putText(frame, tag_text, (x1 + 6, badge_y2 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0) if is_target else (255, 255, 255), 1, cv2.LINE_AA)

    return frame


def save_screenshot(frame: np.ndarray, output_dir: str = "screenshots") -> str:
    """
    Saves a captured frame with timestamp to screenshots folder.
    """
    os.makedirs(output_dir, exist_ok=True)
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(output_dir, f"ar_fire_{timestamp}.png")
    cv2.imwrite(filepath, frame)
    return filepath
