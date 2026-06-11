import io
import json
import os
from collections import defaultdict

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

load_dotenv()

# load the model
model = YOLO("../runs/detect/train/weights/best.pt")


def main():
    app = FastAPI()

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
    async def predict(file: UploadFile = File(...)):
        # Read image bytes
        image_bytes = await file.read()

        # convert bytes to PIL image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # run inference
        results = model(image)

        # return results[0].to_json()
        # Food API to query food data
        url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "api_key": os.getenv("FOOD_API"),
            "pageNumber": 1,
            "pageSize": 1,
            "dataType": "Foundation",
        }

        # A dictionary that will keep track of food items
        food_items = defaultdict(dict)

        # Send a request to the food API
        for food_item in json.loads(results[0].to_json()):
            # If the food item exists in the dictionary, increase the quantity.
            if food_item["name"] in food_items:
                food_items[food_item["name"]]["quantity"] += 1

            # Otherwise, fetch nutrition data from the api and add it to the dictionary.
            else:
                params["query"] = food_item["name"]
                res = requests.get(url, params=params).json()
                nutrients = res["foods"][0]["foodNutrients"]
                for nutrient in nutrients:
                    nutrient_name = nutrient["nutrientName"].lower()

                    if "fat" in nutrient_name:
                        food_items[food_item["name"]]["fat"] = nutrient["value"]
                    elif "carbohydrate" in nutrient_name:
                        food_items[food_item["name"]]["carbs"] = nutrient["value"]
                    elif "protein" in nutrient_name:
                        food_items[food_item["name"]]["protein"] = nutrient["value"]
                    elif "energy" in nutrient_name or "kcal" in nutrient_name:
                        food_items[food_item["name"]]["calories"] = nutrient["value"]

                food_items[food_item["name"]]["quantity"] = 1
        print("Confirm food_items:", food_items)
        return food_items

    return app


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(main, host="0.0.0.0", port=8000)
