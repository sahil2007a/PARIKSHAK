"""
Custom YOLOv8 Model Training Pipeline for AR Virtual Fire Targets
Target classes:
1. Bench
2. Lathe machine
3. Electric pole

Usage:
1. Prepare your annotated dataset in YOLO format under `dataset/`:
   dataset/
   ├── images/
   │   ├── train/ (e.g. img1.jpg, img2.jpg)
   │   └── val/   (e.g. img3.jpg)
   └── labels/
       ├── train/ (e.g. img1.txt: '<class_id> <x_center> <y_center> <width> <height>')
       └── val/   (e.g. img3.txt)

2. Run training:
   python train_custom.py --epochs 50 --batch 16 --imgsz 640 --backbone yolov8n.pt

3. The trained weights will be saved to `models/custom_fire_objects.pt`
   and can be directly used in the AR system:
   python main.py --model models/custom_fire_objects.pt --targets "bench,lathe machine,electric pole"
"""

import os
import sys
import argparse
import yaml
from ultralytics import YOLO


CUSTOM_CLASSES = ["bench", "lathe_machine", "electric_pole"]


def create_dataset_template(dataset_dir: str = "dataset") -> str:
    """Creates the dataset folder structure and data.yaml configuration."""
    abs_dataset_dir = os.path.abspath(dataset_dir)
    os.makedirs(os.path.join(abs_dataset_dir, "images", "train"), exist_ok=True)
    os.makedirs(os.path.join(abs_dataset_dir, "images", "val"), exist_ok=True)
    os.makedirs(os.path.join(abs_dataset_dir, "labels", "train"), exist_ok=True)
    os.makedirs(os.path.join(abs_dataset_dir, "labels", "val"), exist_ok=True)
    os.makedirs("models", exist_ok=True)

    yaml_data = {
        "path": abs_dataset_dir,
        "train": "images/train",
        "val": "images/val",
        "names": {i: name for i, name in enumerate(CUSTOM_CLASSES)}
    }

    yaml_path = os.path.join(abs_dataset_dir, "data.yaml")
    with open(yaml_path, "w") as f:
        yaml.dump(yaml_data, f, default_flow_style=False)

    print(f"[Dataset] Configured data.yaml at: {yaml_path}")
    print(f"[Dataset] Target Classes: {CUSTOM_CLASSES}")
    return yaml_path


def train_custom_model(
    data_yaml: str,
    epochs: int = 50,
    batch_size: int = 16,
    imgsz: int = 640,
    backbone: str = "yolov8n.pt",
    output_model_path: str = "models/custom_fire_objects.pt"
):
    print("=" * 65)
    print("  🚀 TRAINING CUSTOM YOLOv8 MODEL FOR AR FIRE OBJECTS 🚀  ")
    print("=" * 65)
    print(f"Backbone Model:  {backbone}")
    print(f"Dataset Config:  {data_yaml}")
    print(f"Epochs:          {epochs}")
    print(f"Batch Size:      {batch_size}")
    print(f"Image Size:      {imgsz}x{imgsz}")
    print("-" * 65)

    # Initialize model with pre-trained weights
    model = YOLO(backbone)

    # Train model
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        batch=batch_size,
        imgsz=imgsz,
        plots=True,
        save=True,
        workers=2,
        project="runs/train",
        name="fire_targets"
    )

    # Copy best weights to models directory
    best_weights_path = os.path.join("runs", "train", "fire_targets", "weights", "best.pt")
    if os.path.exists(best_weights_path):
        os.makedirs(os.path.dirname(output_model_path), exist_ok=True)
        import shutil
        shutil.copy(best_weights_path, output_model_path)
        print(f"\n[Success] Best trained weights saved to: {output_model_path}")
        print(f"[Usage] Run the AR virtual fire system using:")
        print(f"        python main.py --model {output_model_path} --targets \"bench,lathe_machine,electric_pole\"")
    else:
        print("[Notice] Training completed. Check 'runs/train/fire_targets' for results.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Custom YOLO Model for AR Virtual Fire Targets")
    parser.add_argument("--dataset-dir", type=str, default="dataset", help="Directory containing dataset")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Training batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Input image dimension (pixels)")
    parser.add_argument("--backbone", type=str, default="yolov8n.pt", help="Pretrained YOLO backbone (yolov8n.pt, yolov8s.pt)")
    parser.add_argument("--output", type=str, default="models/custom_fire_objects.pt", help="Path to save best weights")
    parser.add_argument("--init-dataset-only", action="store_true", help="Only create dataset structure and data.yaml")

    args = parser.parse_args()

    yaml_path = create_dataset_template(args.dataset_dir)

    if not args.init_dataset_only:
        # Check if dataset has training images
        train_img_dir = os.path.join(args.dataset_dir, "images", "train")
        train_images = [f for f in os.listdir(train_img_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))] if os.path.exists(train_img_dir) else []
        
        if not train_images:
            print(f"\n[Warning] No images found in '{train_img_dir}'.")
            print(f"Please add your annotated images and label files before training.")
            print(f"Run with '--init-dataset-only' if you just wanted to set up the dataset folder.")
        else:
            train_custom_model(
                data_yaml=yaml_path,
                epochs=args.epochs,
                batch_size=args.batch,
                imgsz=args.imgsz,
                backbone=args.backbone,
                output_model_path=args.output
            )
