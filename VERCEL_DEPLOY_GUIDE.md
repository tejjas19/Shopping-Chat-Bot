# 🚀 Deploy Both Backend & Frontend on Vercel - Step by Step

## What We've Set Up
- ✅ `vercel.json` - Routing config for unified deployment
- ✅ Root `package.json` - Build scripts
- ✅ Backend modified to serve frontend static files
- ✅ `.vercelignore` - Excludes unnecessary files

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Code
Push your code to GitHub:
```bash
git add .
git commit -m "Setup unified Vercel deployment"
git push origin main
```

### Step 2: Go to Vercel.com
1. Visit https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Select your GitHub repository
4. Choose the repository that contains your chatbot code

### Step 3: Configure Build Settings
When Vercel asks for build settings:

**Framework Preset:** `Other`

**Build Command:**
```
npm run build
```

**Install Command:**
```
npm install && cd backend && npm install && cd ../frontend && npm install
```

**Output Directory:** Leave empty (Vercel will handle it)

**Root Directory:** `.` (dot - the root)

### Step 4: Set Environment Variables
Before deploying, click **Environment Variables** and add:

```
MONGODB_URI = your_mongodb_connection_string
NODE_ENV = production
```

If you have other environment variables (like API keys), add them here too.

### Step 5: Deploy!
Click **"Deploy"** button and wait for completion.

---

## ✅ After Deployment

### Update Frontend Environment
Once deployment is complete, you'll get a URL like: `https://your-project-xyz.vercel.app`

1. Update `frontend/.env.production`:
```
VITE_API_URL=https://your-project-xyz.vercel.app
```

2. Push the change:
```bash
git add frontend/.env.production
git commit -m "Update API URL for Vercel deployment"
git push origin main
```

3. Vercel will automatically redeploy

### Test Your Deployment
1. Visit https://your-project-xyz.vercel.app
2. Try the chat feature
3. Open DevTools (F12) → Network tab
4. Submit a message and verify API calls to `/api/chat` succeed
5. Check for any errors in the console

---

## 🔍 Troubleshooting

### Problem: "Build failed"
- Check Vercel build logs for errors
- Ensure `MONGODB_URI` is set and correct
- Make sure all dependencies are listed in both `backend/package.json` and `frontend/package.json`

### Problem: "API returns 404"
- Verify `vercel.json` routes are correct
- Check backend `/api/chat` and `/api/products` routes exist
- Ensure `VITE_API_URL` is set correctly in frontend env

### Problem: "Frontend not loading / 404"
- Check frontend build succeeded in Vercel logs
- Verify `frontend/dist` folder was created
- Ensure `VITE_API_URL` env var is set

### Problem: "MongoDB connection failed"
- Verify `MONGODB_URI` is correct
- Check MongoDB IP whitelist includes Vercel IPs (usually 0.0.0.0/0)
- Test connection string locally first

### Problem: "CORS errors in browser console"
- Backend already configured to allow `*.vercel.app` domains
- If still failing, verify `CLIENT_URL` env var (optional)

---

## 📋 Quick Reference

| Item | Value |
|------|-------|
| Frontend Framework | React + Vite |
| Backend Framework | Node.js + Express |
| Database | MongoDB |
| Deployment | Vercel (Unified) |
| Build Time | ~2-3 minutes |

---

## 🆘 Need Help?

Common issues checklist:
- [ ] MONGODB_URI is valid and not expired
- [ ] GitHub branch is up to date
- [ ] All dependencies installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] `.env.production` has correct API URL
- [ ] Vercel build logs show no errors

---

## Additional Resources
- [Vercel Docs](https://vercel.com/docs)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Node.js on Vercel](https://vercel.com/docs/functions/runtimes/node-js)
