import sys
import os
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add AI Model directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "AI Model"))

from fruit_classifier import FruitClassifier
from nutrition import NutritionDB

app = FastAPI(title="AURA - Fruit Quality Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = FruitClassifier()
nutrition_db = NutritionDB()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.post("/api/analyze")
async def analyze_fruit(file: UploadFile = File(...)):
    # Validate file type
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Unsupported file type. Use JPG, PNG, or WebP.")

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large. Maximum size is 10 MB.")

    if len(image_bytes) == 0:
        raise HTTPException(400, "Empty file.")

    # Run ML prediction
    prediction = classifier.predict(image_bytes)

    # Fetch nutrition data
    fruit_name = prediction["fruit"]
    nutrition = nutrition_db.get_nutrition(fruit_name)

    return {
        "fruit": fruit_name,
        "confidence": prediction["confidence"],
        "nutrition": nutrition,
    }


@app.get("/api/fruits")
async def list_fruits():
    """List all fruits in the nutrition database."""
    return {"fruits": nutrition_db.list_fruits()}


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
