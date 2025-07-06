# Chess Game Deployment Guide

This guide will help you deploy your chess game online. You have several options depending on your preferences and budget.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Set the root directory to `frontend`
   - Deploy

3. **Set Environment Variables in Vercel**
   - Go to your project settings
   - Add environment variable:
     - `VITE_WS_URL` = `wss://your-backend-url.railway.app`

#### Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set the root directory to `backend1`
   - Deploy

2. **Set Environment Variables in Railway**
   - Go to your project settings
   - Add environment variables:
     - `NODE_ENV` = `production`
     - `PORT` = `8080` (or let Railway set it automatically)

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend Deployment (Netlify)

1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/dist`
   - Deploy

2. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add: `VITE_WS_URL` = `wss://your-backend-url.onrender.com`

#### Backend Deployment (Render)

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New Web Service"
   - Connect your repository
   - Set root directory to `backend1`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Deploy

### Option 3: Heroku (Both Frontend and Backend)

#### Backend Deployment (Heroku)

1. **Create Heroku app**
   ```bash
   heroku create your-chess-backend
   ```

2. **Deploy backend**
   ```bash
   cd backend1
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-chess-backend
   git push heroku main
   ```

#### Frontend Deployment (Heroku)

1. **Create another Heroku app**
   ```bash
   heroku create your-chess-frontend
   ```

2. **Deploy frontend**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-chess-frontend
   git push heroku main
   ```

## 🔧 Environment Variables

**📖 For detailed environment variables setup, see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)**

### Frontend (.env file in frontend directory)
```env
VITE_WS_URL=wss://your-backend-url.com
```

### Backend (.env file in backend1 directory)
```env
NODE_ENV=production
PORT=8080
```

### Quick Environment Variables Setup

1. **After deploying backend**, get your backend URL
2. **In your frontend deployment platform** (Vercel/Netlify/Render):
   - Go to Environment Variables settings
   - Add: `VITE_WS_URL = wss://your-backend-url.com`
   - Redeploy your frontend

3. **In your backend deployment platform** (Railway/Render/Heroku):
   - Go to Environment Variables settings
   - Add: `NODE_ENV = production`
   - Add: `PORT = 8080` (or let platform set it automatically)

## 📝 Pre-deployment Checklist

- [ ] All files are committed to Git
- [ ] Environment variables are set correctly
- [ ] WebSocket URL is updated to use `wss://` (secure) instead of `ws://`
- [ ] Backend is configured to use `process.env.PORT`
- [ ] Frontend is configured to use `import.meta.env.VITE_WS_URL`

## 🌐 Custom Domain (Optional)

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway/Render
1. Go to your project settings
2. Add custom domain
3. Update DNS records

## 🔍 Testing Your Deployment

1. **Test WebSocket Connection**
   - Open browser dev tools
   - Check console for WebSocket connection logs
   - Verify no connection errors

2. **Test Game Functionality**
   - Try making moves
   - Check if moves are reflected for both players
   - Verify error handling works

3. **Test Cross-Origin Issues**
   - Ensure WebSocket connections work from your frontend domain
   - Check for CORS errors in console

## 🐛 Common Issues

### WebSocket Connection Failed
- Check if backend URL is correct
- Ensure backend is running
- Verify WebSocket URL uses `wss://` for production

### Build Failures
- Check if all dependencies are in package.json
- Verify TypeScript compilation
- Check for missing environment variables

### CORS Issues
- Backend should accept connections from your frontend domain
- Check WebSocket server configuration

## 💰 Cost Estimates

- **Vercel**: Free tier available (frontend)
- **Railway**: $5/month (backend)
- **Render**: Free tier available (backend)
- **Netlify**: Free tier available (frontend)
- **Heroku**: $7/month per dyno (both)

## 🚀 Alternative: Self-Hosted

If you prefer to host on your own server:

1. **VPS Setup** (DigitalOcean, AWS, etc.)
2. **Install Node.js and PM2**
3. **Deploy backend with PM2**
4. **Set up Nginx for frontend**
5. **Configure SSL certificates**

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

## 🎉 Success!

Once deployed, your chess game will be accessible online and players can join from anywhere in the world! 