#!/bin/bash

echo "🚀 Chess Game Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ] || [ ! -f "backend1/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the project
echo "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build output: frontend/dist/"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ..

echo ""
echo "🔧 Backend preparation..."
cd backend1

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Build the project
echo "Building backend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful!"
    echo "📁 Build output: backend1/dist/"
else
    echo "❌ Backend build failed!"
    exit 1
fi

cd ..

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy backend to Railway/Render:"
echo "   - Go to railway.app or render.com"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend1'"
echo "   - Deploy"
echo ""
echo "3. Deploy frontend to Vercel/Netlify:"
echo "   - Go to vercel.com or netlify.com"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable: VITE_WS_URL = wss://your-backend-url"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🔧 For troubleshooting, see TROUBLESHOOTING.md" 