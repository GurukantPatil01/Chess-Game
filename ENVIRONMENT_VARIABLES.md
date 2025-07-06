# Environment Variables Setup Guide

## 🔧 Environment Variables Configuration

This guide will help you set up all the necessary environment variables for your chess game deployment.

## 📋 Frontend Environment Variables

### For Vercel Deployment

1. **Go to your Vercel project dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your chess game project

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add the WebSocket URL variable**
   ```
   Name: VITE_WS_URL
   Value: wss://your-backend-url.railway.app
   Environment: Production
   ```
   - ✅ Check "Production"
   - ✅ Check "Preview" (optional)
   - ✅ Check "Development" (optional)

4. **Save and redeploy**
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Redeploy" on your latest deployment

### For Netlify Deployment

1. **Go to your Netlify site dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Select your chess game site

2. **Navigate to Environment Variables**
   - Go to "Site settings"
   - Click "Environment variables" in the left sidebar

3. **Add the WebSocket URL variable**
   ```
   Key: VITE_WS_URL
   Value: wss://your-backend-url.onrender.com
   Scope: All scopes
   ```

4. **Trigger a new deployment**
   - Go to "Deploy" tab
   - Click "Trigger deploy" > "Deploy site"

### For Render Deployment

1. **Go to your Render dashboard**
   - Visit [render.com](https://render.com)
   - Select your frontend service

2. **Navigate to Environment Variables**
   - Go to "Environment" tab
   - Click "Add Environment Variable"

3. **Add the WebSocket URL variable**
   ```
   Key: VITE_WS_URL
   Value: wss://your-backend-url.onrender.com
   ```

4. **Redeploy the service**
   - Click "Manual Deploy" > "Deploy latest commit"

## 🔧 Backend Environment Variables

### For Railway Deployment

1. **Go to your Railway project dashboard**
   - Visit [railway.app](https://railway.app)
   - Select your chess backend service

2. **Navigate to Variables**
   - Click "Variables" tab
   - Click "New Variable"

3. **Add the required variables**
   ```
   NODE_ENV = production
   PORT = 8080
   ```

4. **Deploy automatically**
   - Railway will automatically redeploy when you add variables

### For Render Deployment

1. **Go to your Render dashboard**
   - Visit [render.com](https://render.com)
   - Select your backend service

2. **Navigate to Environment Variables**
   - Go to "Environment" tab
   - Click "Add Environment Variable"

3. **Add the required variables**
   ```
   NODE_ENV = production
   PORT = 8080
   ```

4. **Redeploy the service**
   - Click "Manual Deploy" > "Deploy latest commit"

### For Heroku Deployment

1. **Using Heroku CLI**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=8080
   ```

2. **Using Heroku Dashboard**
   - Go to your app dashboard
   - Click "Settings" tab
   - Click "Reveal Config Vars"
   - Add:
     ```
     NODE_ENV = production
     PORT = 8080
     ```

## 🌐 Getting Your Backend URL

### Railway
- Your backend URL will be: `https://your-app-name.railway.app`
- WebSocket URL: `wss://your-app-name.railway.app`

### Render
- Your backend URL will be: `https://your-app-name.onrender.com`
- WebSocket URL: `wss://your-app-name.onrender.com`

### Heroku
- Your backend URL will be: `https://your-app-name.herokuapp.com`
- WebSocket URL: `wss://your-app-name.herokuapp.com`

## 📝 Local Development Environment Variables

### Frontend (.env file in frontend directory)
Create a file called `.env` in the `frontend` directory:
```env
VITE_WS_URL=ws://localhost:8081
```

### Backend (.env file in backend1 directory)
Create a file called `.env` in the `backend1` directory:
```env
NODE_ENV=development
PORT=8081
```

## 🔍 Testing Environment Variables

### Frontend Testing
1. **Check if variable is loaded**
   ```javascript
   console.log('WebSocket URL:', import.meta.env.VITE_WS_URL);
   ```

2. **Test WebSocket connection**
   - Open browser dev tools
   - Check console for connection logs
   - Verify no connection errors

### Backend Testing
1. **Check if variables are loaded**
   ```javascript
   console.log('NODE_ENV:', process.env.NODE_ENV);
   console.log('PORT:', process.env.PORT);
   ```

2. **Test server startup**
   - Check if server starts on correct port
   - Verify no environment-related errors

## 🚨 Common Issues & Solutions

### Issue: "VITE_WS_URL is undefined"
**Solution:**
- Ensure variable name starts with `VITE_`
- Check if variable is set in deployment platform
- Redeploy after adding environment variables

### Issue: "WebSocket connection failed"
**Solution:**
- Verify backend URL is correct
- Ensure URL uses `wss://` for production
- Check if backend is running and accessible

### Issue: "Backend not starting"
**Solution:**
- Check if `NODE_ENV` is set to `production`
- Verify `PORT` is set correctly
- Check deployment platform logs

## 📋 Environment Variables Checklist

### Frontend Checklist
- [ ] `VITE_WS_URL` is set to your backend WebSocket URL
- [ ] URL uses `wss://` for production (not `ws://`)
- [ ] Variable is set for Production environment
- [ ] Frontend is redeployed after adding variables

### Backend Checklist
- [ ] `NODE_ENV` is set to `production`
- [ ] `PORT` is set (or let platform set it automatically)
- [ ] Backend is deployed and running
- [ ] WebSocket server is accessible

## 🔄 Updating Environment Variables

### When to Update
- After deploying backend to a new URL
- When switching deployment platforms
- When adding new features that need environment variables

### How to Update
1. Go to your deployment platform dashboard
2. Navigate to Environment Variables
3. Update the value
4. Redeploy your application

## 📞 Troubleshooting

If you're still having issues:

1. **Check deployment logs** in your platform's dashboard
2. **Verify environment variables** are set correctly
3. **Test locally first** with `.env` files
4. **Check browser console** for connection errors
5. **Verify backend is running** and accessible

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Frontend loads without errors
- ✅ WebSocket connects successfully
- ✅ Chess game is playable
- ✅ Moves are synchronized between players
- ✅ No console errors in browser 