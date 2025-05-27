
# SymptoCare

SymptoCare is a smart AI assistant for **symptom analysis** and **mental wellness**.
The project combines machine learning for health risk prediction with conversational AI for mental health support.

**Tech Stack:**

* Frontend: React.js
* Backend: Flask (Python)
* Machine Learning: scikit-learn
* AI Integrations: OpenAI GPT, Gemini
* Database: Firebase Firestore

---

## Features

* **Symptom Checker:** Users enter symptoms and receive AI-driven risk insights.
* **Mental Wellness Chat:** AI-powered conversational support (choose GPT or Gemini).
* **Doctor Consultation Module:** Browse doctors, book appointments, and manage schedules.
* **Secure and Private:** No sensitive data is stored without user consent.

---

## Project Structure

```
symptocare/
  backend/    # Flask API and ML models
  frontend/   # React app
```

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/symptocare.git
cd symptocare
```

---

### 2. Setup & Run the Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # or flask run
```

By default, the backend runs on [http://localhost:5000](http://localhost:5000)

---

### 3. Setup & Run the Frontend (React)

```bash
cd ../frontend
npm install
npm start
```

By default, the frontend runs on [http://localhost:3000](http://localhost:3000)

**Note:** The React app should call the Flask backend (e.g., via `/api` endpoints). Update proxy settings in `frontend/package.json` if needed:

```json
"proxy": "http://localhost:5000"
```

---

## Machine Learning Models

* Data cleaning and feature engineering on clinical symptom data.
* Trained using logistic regression and other classifiers (accuracy: \~91%).
* Models serialized with `pickle` and served as API endpoints.

---

## Configuration

* **API Keys:**

  * Place your OpenAI/Gemini API keys in the backend’s `.env` file or directly in `config.py` (never commit secrets to source control).
* **Firebase:**

  * Update Firebase config in the frontend for Firestore integration.

---

## Deployment

* **Frontend:** Can be deployed to Netlify, Vercel, or any static hosting.
* **Backend:** Deploy Flask to Heroku, Render, or AWS (set CORS appropriately).

---

## Future Improvements

* Real-time doctor chat
* More symptom and condition coverage
* Multilingual chatbot

---

## License

MIT License. See [LICENSE](LICENSE).

---

## Acknowledgments

Thanks to all contributors and the original inspiration from [this Medium article](https://medium.com/@zying_ai/symptocare-a-smart-ai-assistant-for-symptom-analysis-and-mental-wellness-cbf288f201b6).

---

Feel free to copy, edit, or expand this README as you develop the project!
