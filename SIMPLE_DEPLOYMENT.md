# Simple Deployment Guide

## 🚀 Quick Deploy (Normal Setup)

### Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Set Root Directory to**: `backend1`
7. **Click "Deploy"**

**Wait for deployment to complete, then copy your URL**

### Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your repository**
5. **Set these settings**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Click "Deploy"**

### Step 3: Connect Frontend to Backend

1. **In Vercel dashboard**, go to your project
2. **Click "Settings"**
3. **Click "Environment Variables"**
4. **Add new variable**:
   - Name: `VITE_WS_URL`
   - Value: `wss://your-railway-url.railway.app`
   - Environment: Production
5. **Click "Save"**
6. **Go to "Deployments"**
7. **Click "Redeploy"**

## ✅ Done!

Your chess game is now live at your Vercel URL!

## 🔧 If Something Goes Wrong

### Check Backend
- Visit your Railway URL in browser
- Should see: "Chess Server is running!"

### Check Frontend
- Open browser dev tools
- Look for WebSocket connection errors
- Make sure VITE_WS_URL is set correctly

### Common Issues
- **WebSocket error**: Check if backend URL is correct
- **Build error**: Make sure all files are pushed to GitHub
- **Connection failed**: Verify backend is running

## 📞 Need Help?

1. Check the deployment logs in Railway/Vercel
2. Make sure your code is pushed to GitHub
3. Verify environment variables are set
4. Test locally first: `npm run dev` in frontend folder 