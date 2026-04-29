# Voice Assistant Chatbot

A responsive AI-powered voice assistant chatbot built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Groq, and SerpAPI.

## Setup

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create local environment files with these values:

```dotenv
# backend/.env
PORT=5000
MONGODB_URI=your-mongodb-uri
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
SERPAPI_API_KEY=your-serpapi-key
CLIENT_URL=http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:5000
```

Run the apps locally:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Local Notes

- The frontend is configured to call the backend at `http://localhost:5000`.
- The backend allows requests from `http://localhost:5173` and `http://127.0.0.1:5173`.
- If Groq or SerpAPI keys are missing, the app falls back to friendly mock behavior so the UI still demonstrates the flow.
