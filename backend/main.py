from ultralytics import YOLO
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io

# load the model
model = YOLO("yolo26s.pt")

def main():
    app = FastAPI()
    
    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        #allow_credentials=True,
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
    
        return results[0].to_json()
    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(main, host="0.0.0.0", port=8000)