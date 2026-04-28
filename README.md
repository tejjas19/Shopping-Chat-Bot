<<<<<<< HEAD
# Voice-Powered-Shopping-Assistant
=======
# Voice Assistant Chatbot

A responsive AI-powered voice assistant chatbot built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Groq, and SerpAPI.

## Folder Structure

```text
project-root/
│── frontend/
│   ├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
│── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── config/
│   ├── server.js
│   └── ...
│
│── .env.example
│── README.md
```

## Features

- ChatGPT-style responsive chat interface
- Real-time-style messaging with loading indicator
- Chat history persistence in MongoDB
- Web Speech API voice input
- Text-to-speech output
- Product search and product cards for shopping queries
- English and Hindi support
- Dark and light mode
- Product comparison view

## Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Copy `.env.example` to your local `.env` file and fill in the values.

### 3. Run locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Deployment

### Frontend: Vercel or Netlify

1. Push the repo to GitHub.
2. Import the `frontend` folder as the app root.
3. Set `VITE_API_BASE_URL` to your deployed backend API URL.
4. Run the build command: `npm run build`.
5. Deploy the built app.

### Backend: Render or Railway

1. Import the `backend` folder as the service root.
2. Set `MONGODB_URI`, `GROQ_API_KEY`, `GROQ_MODEL`, `SERPAPI_API_KEY`, `CLIENT_URL`, and `PORT`.
3. Run the start command: `npm start`.
4. Confirm the health endpoint at `/api/health`.

## Public URL wiring

- Set the frontend environment variable `VITE_API_BASE_URL` to the backend public URL plus `/api`.
- Set the backend `CLIENT_URL` to the frontend public URL.
- Verify CORS and chat history loading from the deployed frontend.

## Notes

- If Groq or SerpAPI keys are missing, the app falls back to friendly mock behavior so the UI still demonstrates the flow.
- Speech recognition requires a supported browser, usually Chromium-based browsers on desktop and many Android browsers.
>>>>>>> 4e574c7 (first commit)
