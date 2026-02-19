# IngredientCV

Detects food ingredients from a live webcam feed using a custom-trained YOLOv8 model, then suggests meals and generates recipes via the OpenAI API.

## Setup

**Python (Flask server)**
```bash
pip install -r requirements.txt
python python/python_scripts.py
```

**Node + React**
```bash
npm install
npm start   # starts both React and the Node proxy
```

Set your OpenAI API key in a `.env` file:
```
SECRET_API_KEY=sk-...
```

## How it works

1. Flask streams webcam frames through YOLOv8, detecting ingredients in real time
2. Detected items populate a list in the UI (you can also add items manually)
3. Click **Generate Meals** to get 3 meal suggestions from GPT-4o-mini
4. Click a meal to get a full step-by-step recipe

## Project Structure

```
client/       React frontend
server/       Node.js proxy (port 5001 → Flask at 5002)
python/       Flask API + YOLOv8 inference + model training scripts
```
