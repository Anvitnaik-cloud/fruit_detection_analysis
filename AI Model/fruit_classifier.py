"""
AURA Fruit Classifier
Uses MobileNetV2 (pre-trained on ImageNet) to identify fruits from images.
ImageNet contains many fruit classes — we map those to common fruit names.
"""

import io
import numpy as np
from PIL import Image

# Lazy-load TensorFlow to speed up import
_model = None

# ImageNet class indices that map to fruits (index -> fruit name)
IMAGENET_FRUIT_MAP = {
    948: "Apple", 949: "Apple", 950: "Apple",       # Granny Smith, etc.
    951: "Orange",
    952: "Orange",
    953: "Pineapple",
    954: "Banana",
    955: "Jackfruit",
    956: "Custard Apple",
    957: "Pomegranate",
    309: "Strawberry",
    310: "Strawberry",
    945: "Lemon",
    946: "Fig",
    947: "Pineapple",
}

# Broader fruit keywords found in ImageNet class names
FRUIT_KEYWORDS = [
    "apple", "orange", "banana", "lemon", "fig", "pineapple",
    "strawberry", "pomegranate", "custard_apple", "jackfruit",
    "grape", "mango", "watermelon", "coconut", "peach",
]


def _get_model():
    global _model
    if _model is None:
        from tensorflow.keras.applications import MobileNetV2
        _model = MobileNetV2(weights="imagenet", include_top=True)
    return _model


def _get_imagenet_labels():
    from tensorflow.keras.applications.mobilenet_v2 import decode_predictions
    return decode_predictions


class FruitClassifier:
    """Classifies fruit images using MobileNetV2."""

    def __init__(self):
        self._decode = None

    def _preprocess(self, image_bytes: bytes) -> np.ndarray:
        """Load image bytes and preprocess for MobileNetV2 (224x224)."""
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224), Image.LANCZOS)
        arr = np.array(img, dtype=np.float32)
        # MobileNetV2 preprocessing: scale to [-1, 1]
        arr = (arr / 127.5) - 1.0
        return np.expand_dims(arr, axis=0)

    def predict(self, image_bytes: bytes) -> dict:
        """
        Predict the fruit in the image.
        Returns {"fruit": "Apple", "confidence": 0.92}
        """
        model = _get_model()

        if self._decode is None:
            self._decode = _get_imagenet_labels()

        img_array = self._preprocess(image_bytes)
        preds = model.predict(img_array, verbose=0)

        # Decode top-10 predictions
        decoded = self._decode(preds, top=10)[0]

        # Try to find a fruit in the top predictions
        for class_id_str, label, score in decoded:
            label_lower = label.lower().replace("_", " ")
            for keyword in FRUIT_KEYWORDS:
                if keyword.replace("_", " ") in label_lower:
                    fruit_name = self._normalize_fruit_name(label)
                    return {
                        "fruit": fruit_name,
                        "confidence": round(float(score), 4),
                    }

        # Check IMAGENET_FRUIT_MAP by index
        top_indices = np.argsort(preds[0])[::-1][:10]
        for idx in top_indices:
            if int(idx) in IMAGENET_FRUIT_MAP:
                return {
                    "fruit": IMAGENET_FRUIT_MAP[int(idx)],
                    "confidence": round(float(preds[0][idx]), 4),
                }

        # Fallback: return top prediction with a note
        best_label = decoded[0][1].replace("_", " ").title()
        return {
            "fruit": best_label,
            "confidence": round(float(decoded[0][2]), 4),
        }

    def _normalize_fruit_name(self, label: str) -> str:
        """Normalize ImageNet label to a clean fruit name."""
        label = label.replace("_", " ").strip().title()
        # Map known variants
        fruit_map = {
            "Granny Smith": "Apple",
            "Custard Apple": "Custard Apple",
            "Jackfruit": "Jackfruit",
            "Lemon": "Lemon",
            "Fig": "Fig",
            "Pineapple": "Pineapple",
            "Banana": "Banana",
            "Orange": "Orange",
            "Strawberry": "Strawberry",
            "Pomegranate": "Pomegranate",
        }
        return fruit_map.get(label, label)
