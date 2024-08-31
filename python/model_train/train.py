from ultralytics import YOLO
import torch

def main():
    model = YOLO("yolov8m.yaml")
    epochs = 150
    batch_size = 8
    img_size = 640

    model.train(data="config.yaml", epochs=epochs, batch=batch_size, imgsz=img_size)

if __name__ == "__main__":
    main()