import io
import json
import os
from pathlib import Path
from time import sleep

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from ultralytics import YOLO
import torch

load_dotenv()

# A rate limiter to prevent server overload
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,  # type: ignore[arg-type]
)

# load the model
MODEL_PATH = (
    Path(__file__).parent.parent / "runs" / "detect" / "train" / "weights" / "best.pt"
)
print("Loading model...")
model = YOLO(str(MODEL_PATH))
print("Model loaded!")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints
@app.post("/predict")
@limiter.limit("5/minute")
async def predict(request: Request, file: UploadFile = File(...)):
    # Read image bytes
    image_bytes = await file.read()

    # convert bytes to PIL image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # run inference
    with torch.no_grad():
        results = model(image)

    # Food API to query food data
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {
        "api_key": os.getenv("FOOD_API"),
        "pageNumber": 1,
        "pageSize": 1,
        "dataType": "Foundation",
    }

    # A dictionary that will keep track of food items
    food_items = []

    # Send a request to the food API
    for food_item in json.loads(results[0].to_json()):
        item_name = food_item["name"]
        quantity = int(food_item.get("quantity", 1))

        # If the food item exists in the list, increase the quantity.
        existing_item = next(
            (item for item in food_items if item.get("product_name") == item_name),
            None,
        )

        if existing_item is not None:
            existing_item["quantity"] = existing_item.get("quantity", 1) + quantity
            continue

        # Otherwise, fetch nutrition data from the api and add it to the list.
        params["query"] = item_name
        res = requests.get(url, params=params).json()
        nutrients = res["foods"][0].get("foodNutrients", []) if res["foods"] else None
        if nutrients == None: 
            continue
        sleep(2)

        item_data = {"product_name": item_name, 
                     "product_desc": "",
                     "product_type": "generic",
                     "calories": 0, 
                     "carbs": 0, 
                     "fat": 0, 
                     "protein": 0, 
                     "quantity": quantity}

        for nutrient in nutrients:
            nutrient_name = nutrient["nutrientName"].lower()

            if "fat" in nutrient_name:
                item_data["fat"] = nutrient["value"]
            elif "carbohydrate" in nutrient_name:
                item_data["carbs"] = nutrient["value"]
            elif "protein" in nutrient_name:
                item_data["protein"] = nutrient["value"]
            elif "energy" in nutrient_name or "kcal" in nutrient_name:
                item_data["calories"] = nutrient["value"]
        food_items.append(item_data)

    return food_items
