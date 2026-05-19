"""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from PIL import Image
import io


# load the model
classifier = pipeline("image-classification", model="nateraw/food")

app = FastAPI()

# Allowed origins
origins = [
    "http://localhost:8081"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image bytes
    image_bytes = await file.read()

    # convert bytes to PIL image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # run inference
    res = classifier(image)

    return {
        "filename": file.filename,
        "predictions": res
    }
""""
