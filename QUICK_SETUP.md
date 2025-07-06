# Quick Setup - Normal Deployment

## 🎯 What You Need

1. **GitHub account** (free)
2. **Railway account** (free tier)
3. **Vercel account** (free tier)

## 📋 Step-by-Step

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend (Railway)
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- New Project → Deploy from GitHub
- Select your repo
- Set Root Directory: `backend1`
- Deploy
- **Copy the URL** (e.g., `https://chess-backend-123.railway.app`)

### 3. Deploy Frontend (Vercel)
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- New Project → Import repo
- Set Root Directory: `frontend`
- Deploy

### 4. Connect Them
- In Vercel: Settings → Environment Variables
- Add: `VITE_WS_URL = wss://your-railway-url.railway.app`
- Redeploy

## ✅ That's It!

Your chess game is now online!

## 🔍 Test It
- Visit your Vercel URL
- Open two browser tabs
- Click "Play" in both
- Try making chess moves

## 💰 Cost
- **Railway**: Free tier available
- **Vercel**: Free tier available
- **Total**: $0/month 