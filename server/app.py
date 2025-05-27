from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pickle
import pandas as pd
import openai
import os
import json

# Initialize Flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

with open('assets/outcome_model.pkl', 'rb') as f:
    outcome_model = pickle.load(f)

with open('assets/disease_model.pkl', 'rb') as f:
    disease_model = pickle.load(f)

# Welcome GET Request API
@app.route('/', methods=['GET'])
@cross_origin()
def status():
    return jsonify({'service': 'diagnoze-api', 'status': 'active'}), 200

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    data = request.json
    input_data = pd.DataFrame({
        "Fever": [data["fever"]],
        "Cough": [data["cough"]],
        "Fatigue": [data["fatigue"]],
        "Difficulty Breathing": [data["difficulty_breathing"]],
        "Age": [data["age"]],
        "Gender": [data["gender"]],
        "Blood Pressure": [data["blood_pressure"]],
        "Cholesterol Level": [data["cholesterol"]]
    })
    outcome_prediction = outcome_model.predict(input_data)[0]

    if outcome_prediction != "Positive":
        return jsonify({'status': False, 'disease': None})
    disease_prediction = disease_model.predict(input_data)[0]
    return jsonify({'status': True, 'disease': disease_prediction})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        default_gemini_message = []
        default_openai_message = []
        messages = data.get("messages", [])
        provider = data.get("provider", "openai")

        if provider == "openai":
            from openai import OpenAI
            client = OpenAI(api_key=openai.api_key)

            with open('openai.json', 'r') as f:
                default_openai_message = json.load(f)

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful and supportive medical assistant."},
                    *default_openai_message,
                    *messages
                ]
            )
            reply = response.choices[0].message.content

        elif provider == "gemini":
            from vertexai.preview.language_models import ChatModel, ChatMessage
            import vertexai

            vertexai.init(project="your-project-id", location="us-central1")
            chat_model = ChatModel.from_pretrained("chat-bison")

            # Load default Gemini history
            with open('gemini.json', 'r') as f:
                default_gemini_message = json.load(f)

            # Convert both default and incoming messages into ChatMessage format
            chat_history = []
            for m in default_gemini_message + messages[:-1]:  # Exclude last for user_input
                role = "user" if m["role"] == "user" else "model"
                chat_history.append(ChatMessage(author=role, content=m["content"]))

            # Start the chat session with history and context
            context_text = "You are a helpful and supportive medical assistant."
            chat = chat_model.start_chat(context=context_text, message_history=chat_history)

            # Send only the last message (the new user input)
            user_input = messages[-1]["content"] if messages else ""
            reply = chat.send_message(user_input).text

        else:
            return jsonify({"error": "Invalid provider specified."}), 400

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()
