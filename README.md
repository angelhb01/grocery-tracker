# Grocery Tracker

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-3ECF8E?logo=supabase)](https://supabase.com/)

Grocery Tracker is a full-stack mobile app that turns a grocery photo into an editable grocery list with nutrition information. It combines an Expo/React Native client, Supabase authentication and PostgreSQL storage, and a FastAPI service that runs a custom-trained YOLO food detector. Detected foods are enriched with data from the USDA FoodData Central API before the user saves them.

**Live web app:** [grocery-tracker.expo.app](https://grocery-tracker.expo.app/)

> Nutrition values and detections are estimates. Users can review and edit results before saving them.

## Features

- Create an account, manage a profile, and securely sign in with Supabase Auth.
- Add grocery items manually or scan a photo using the device camera.
- Detect multiple food items in one image with a custom YOLO object-detection model.
- Look up calories, carbohydrates, fat, and protein through USDA FoodData Central.
- Edit detected quantities and nutrition values before adding items to a grocery list.
- Keep each user's grocery data private with Supabase row-level security.
- View nutrition totals and a macro breakdown in the Analytics tab.
- Run on iOS, Android, and web from one Expo codebase.

## Architecture

```text
Expo / React Native app
        |
        | photo upload (multipart/form-data)
        v
FastAPI inference service ──> custom YOLO model
        |
        | detected food names
        v
USDA FoodData Central API
        |
        | editable food + nutrition results
        v
Supabase Auth + PostgreSQL (profiles and groceries)
```

## Tech stack

| Area | Technology |
| --- | --- |
| Mobile and web client | Expo, React Native, TypeScript, Expo Router |
| Camera and UI | Expo Camera, NativeWind, Gluestack UI |
| Backend inference API | Python, FastAPI, Uvicorn |
| Computer vision | Ultralytics YOLO, PyTorch |
| Authentication and data | Supabase Auth, PostgreSQL, Row Level Security |
| Nutrition data | USDA FoodData Central API |
| Charts | `react-native-gifted-charts` |

## Local setup

### Prerequisites

- Node.js 20 or later and npm
- Python 3.10 or later
- A Supabase project
- A USDA FoodData Central API key

### 1. Clone and install the app

```bash
git clone https://github.com/angelhb01/grocery-tracker.git
cd grocery-tracker
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Full FastAPI /predict URLs. Use your computer's LAN IP for a physical device.
EXPO_PUBLIC_API_MOBILE=http://<your-lan-ip>:8000/predict
EXPO_PUBLIC_API_WEB=http://localhost:8000/predict
```

Create `backend/.env` for the inference service:

```dotenv
FOOD_API=<your-usda-fooddata-central-api-key>
```

Never commit either file. The repository's `.gitignore` already excludes `.env` files. Variables prefixed with `EXPO_PUBLIC_` are bundled into the client, so only put non-sensitive configuration in them.

### 3. Set up Supabase

Create a Supabase project, then apply the SQL files in [`supabase/migrations`](supabase/migrations). The schema creates:

- `profiles`, linked one-to-one with authenticated users;
- `groceries`, containing grocery item, quantity, and nutrition fields; and
- row-level-security policies that restrict each user to their own profile and groceries.

You can apply the migrations with the Supabase CLI after linking your project:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

### 4. Start the inference API

The trained model is committed at `runs/detect/train/weights/best.pt` and is loaded when the API starts.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The service exposes `POST /predict`, accepting an image in a `file` multipart field. It is rate limited to five requests per minute per client IP.

### 5. Start the Expo app

In a second terminal at the repository root:

```bash
npm start
```

Then choose iOS, Android, or web from the Expo development server. For a physical phone, make sure `EXPO_PUBLIC_API_MOBILE` uses an address reachable from that device and restart Expo after changing `.env` values.

## How food recognition works

1. The user takes a grocery photo in the Camera tab.
2. The app uploads it to the FastAPI `/predict` endpoint.
3. The server runs the image through the custom YOLO detector.
4. For each detected food class, the server queries USDA FoodData Central for nutrition information.
5. The app presents editable results; the user chooses what to save.
6. Saved groceries power the list and aggregate nutrition analytics.

## Model evaluation

The repository includes the training configuration, validation samples, confusion matrices, precision/recall curves, and weights under `runs/detect/train/`.

The committed 100-epoch training run reports:

| Metric | Validation result |
| --- | ---: |
| Precision | 0.801 |
| Recall | 0.800 |
| mAP@50 | 0.854 |
| mAP@50–95 | 0.578 |

These values are from the model's validation split and should be treated as an offline evaluation, not a guarantee of performance on every grocery photo. Lighting, occlusion, packaging, and food classes outside the training set can reduce accuracy.

## Project structure

```text
app/                    Expo Router screens and layouts
components/             Shared UI components
lib/supabase.ts         Supabase client and auth-session handling
utils/                  Client-side food helpers
backend/main.py         FastAPI prediction and USDA-enrichment service
backend/requirements.txt Python dependencies
runs/detect/train/      YOLO metrics, visualizations, and trained weights
supabase/migrations/    Database schema and security migrations
```

## Available commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run ios` | Open the app in an iOS simulator |
| `npm run android` | Open the app in an Android emulator/device |
| `npm run web` | Run the web target |
| `npm run lint` | Run Expo's ESLint configuration |

## Current limitations and next steps
- There is no automated retraining, model registry, or production model-monitoring pipeline yet.
- Future work includes caching nutrition lookups, containerized deployment, dataset versioning, and feedback-driven model improvements.model improvements.

## Security notes

- Keep `FOOD_API` only on the backend; it is a server-side secret.
- Never use a Supabase service-role key in the Expo app. The client should use only the anon key shown above.
- Confirm Supabase Row Level Security remains enabled when changing the schema.
