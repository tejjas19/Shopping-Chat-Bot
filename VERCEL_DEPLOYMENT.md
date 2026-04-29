# Vercel Deployment Guide - Unified Frontend + Backend

## Quick Setup

### 1. Update Backend server.js
Your backend needs to serve the frontend static files and handle API routes. See the updated `server.js` for the required changes.

### 2. Environment Variables Setup on Vercel

Go to **Project Settings → Environment Variables** and add:

```
# Database
MONGODB_URI=your_mongodb_connection_string

# Client URL (optional - for CORS)
CLIENT_URL=https://your-project.vercel.app

# Node Environment
NODE_ENV=production

# Any other backend env vars needed
```

### 3. Deploy Steps

#### Option A: Git Integration (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New → Project"
4. Select your repository
5. Framework Preset: **Other**
6. Build Command: 
   ```
   npm run build:vercel
   ```
7. Output Directory: `frontend/dist`
8. Install Command: `npm install && cd backend && npm install && cd ../frontend && npm install`
9. Click Deploy

#### Option B: Vercel CLI
```bash
npm install -g vercel
cd path/to/Chatbot_ai
vercel --prod
# Follow the prompts and configure environment variables
```

### 4. Build Configuration

Update root `package.json` with these scripts:
```json
{
  "scripts": {
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "build:vercel": "cd frontend && npm run build && cd ..",
    "build:local": "cd frontend && npm run build && cd .. && cd backend && npm run build",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}
```

### 5. Frontend Environment Configuration

Create/update `frontend/.env.production`:
```
VITE_API_URL=https://your-project.vercel.app
```

Create `frontend/.env.development`:
```
VITE_API_URL=http://localhost:5000
```

### 6. MongoDB Connection

Make sure `MONGODB_URI` environment variable is set on Vercel pointing to your MongoDB (Atlas, etc.)

### 7. Verify Deployment

After deployment:
1. Visit `https://your-project.vercel.app`
2. Test chat functionality
3. Check browser DevTools → Network to verify API calls to `/api/chat`
4. Check Vercel logs for any errors

## Troubleshooting

### CORS Errors
- Verify `CLIENT_URL` env var matches your Vercel domain
- Check backend CORS configuration allows Vercel domain

### API Routes 404
- Ensure `vercel.json` routes are correct
- Backend should handle requests to `/api/*`

### Frontend Not Loading
- Verify frontend build completed successfully
- Check `frontend/dist` folder exists
- Verify `VITE_API_URL` is set correctly

### Database Connection Issues
- Check `MONGODB_URI` is valid and not expired
- Verify MongoDB IP whitelist allows Vercel IPs
- Check MongoDB credentials

## Project Structure
```
Chatbot_ai/
├── backend/          (Node.js server)
├── frontend/         (React/Vite app)
├── vercel.json       (Vercel config)
├── package.json      (Root package.json)
└── .vercelignore
```
