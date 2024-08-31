from flask import Flask, Response, jsonify, request
from ultralytics import YOLO
import cv2
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
logging.getLogger('werkzeug').setLevel(logging.WARNING)

load_dotenv()
app = Flask(__name__)
CORS(app)

client = OpenAI(api_key = os.environ.get('SECRET_API_KEY'))

@app.route('/')
def home():
    app.logger.info("Root route accessed")
    return jsonify({"message": "Flask server is running"}), 200

@app.route('/video_feed/', methods=['GET'])
def video_feed():
    app.logger.info("Video feed route accessed")
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/item_list/', methods=['GET'])
def item_list():
    return jsonify(found_objects), 200

@app.route('/add_item/', methods=['POST'])
def add_item():
    data = request.get_json()
    new_item = data.get('item')

    if new_item and new_item not in found_objects:
        found_objects.insert(0, new_item)

    return jsonify(found_objects)

@app.route('/generate_meals/', methods=['POST'])
def generate_meals():
    data = request.get_json()
    item_list = data.get('items', [])

    prompt = f"These are the following ingredients: {', '.join(item_list)}."

    system_prompt = "The user will give a list of food ingredients that they have. " \
                " You are to suggest 3 possible meals to be made using these ingredients. " \
                " Your response format will be three lines with just the meal names and nothing else."
    
    response = client.chat.completions.create(model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": system_prompt},

        {"role": "user", "content": prompt}
    ],
    max_tokens=150,
    n=1,
    stop=None,
    temperature=0.7)

    meal_text = response.choices[0].message.content.strip()
    meal_list = meal_text.split("\n")

    meals = [meal.strip() for meal in meal_list if meal.strip()]

    meals = meals[:3]

    return jsonify(meals), 200


@app.route('/generate_recipe/', methods=['POST'])
def generate_recipe():
    data = request.get_json()
    meal_name = data.get('meal_name', '')

    prompt = f"Provide a detailed recipe for {meal_name}."

    system_prompt = (
        "The user will give the name of a meal. " \
        "You are to give a detailed recipe for the given meal name with step-by-step instructions. " \
        "Number the steps and limit each line to only one step at a time. " \
        "Start the response with the first step of the recipe."
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        n=1,
        stop=None,
        temperature=0.7
    )

    recipe = response.choices[0].message.content.strip()

    formatted_recipe = recipe.replace('\n', ' # ')

    return jsonify({"recipe": formatted_recipe}), 200

# Change model path depending on route
model_path = "/Users/andrewfu/Documents/vscode/IngredientCV/python/model_train/runs/detect/train(19)/weights/best.pt"
model = YOLO(model_path)
CONFIDENCE_THRESHOLD = 0.7
found_objects = []

def generate_frames():
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()
        if not success:
            break

        results = model(frame, verbose=False)

        for result in results:
            boxes = result.boxes.xyxy.cpu().numpy()
            confidences = result.boxes.conf.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()

            for box, confidence, class_id in zip(boxes, confidences, class_ids):
                if confidence > CONFIDENCE_THRESHOLD:
                    x1, y1, x2, y2 = map(int, box)
                    label = f"{model.names[int(class_id)]}"
                    label_with_confidence = f"{label} {confidence:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label_with_confidence, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                    if label not in found_objects:
                        found_objects.append(label)

        # JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

if __name__ == '__main__':
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.WARNING)

    app.run(host='0.0.0.0', port=5002, debug=True, threaded=True)