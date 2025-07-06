# Deployment Troubleshooting Guide

## 🚨 DEPLOYMENT_NOT_FOUND Error

If you're getting a "DEPLOYMENT_NOT_FOUND" error, here are the solutions:

### Solution 1: Manual Vercel Deployment

1. **Remove vercel.json temporarily**
   ```bash
   cd frontend
   rm vercel.json
   ```

2. **Deploy manually in Vercel dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the following:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add environment variables**
   - Go to Project Settings > Environment Variables
   - Add: `VITE_WS_URL` = `wss://your-backend-url.com`

### Solution 2: Alternative Deployment Platforms

#### Netlify (Often more reliable)
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy

#### GitHub Pages
1. Add this to `frontend/package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Run: `npm run deploy`

### Solution 3: Fix Common Issues

#### Check File Structure
Ensure your repository structure is correct:
```
your-repo/
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── backend1/
│   ├── package.json
│   └── src/
└── README.md
```

#### Verify Build Works Locally
```bash
cd frontend
npm install
npm run build
```
This should create a `dist` folder without errors.

#### Check for Missing Dependencies
```bash
cd frontend
npm install
npm run build
```

### Solution 4: Create a Minimal vercel.json

If you want to keep vercel.json, use this minimal version:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Solution 5: Use Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from frontend directory:
   ```bash
   cd frontend
   vercel
   ```

3. Follow the prompts and set:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 🔧 Other Common Issues

### Build Failures
- Check if all dependencies are installed
- Verify TypeScript compilation
- Check for syntax errors

### WebSocket Connection Issues
- Ensure backend is deployed and running
- Check if WebSocket URL is correct
- Verify environment variables are set

### CORS Issues
- Backend should accept connections from frontend domain
- Check WebSocket server configuration

## 📞 Getting Help

1. **Check deployment logs** in your platform's dashboard
2. **Test locally first** with `npm run build`
3. **Check browser console** for errors
4. **Verify environment variables** are set correctly

## 🚀 Quick Alternative: Render (Full Stack)

If Vercel continues to have issues, try Render's full-stack deployment:

1. Go to [render.com](https://render.com)
2. Create a new "Static Site"
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
5. Deploy

This often works when other platforms have issues with monorepo structures. 