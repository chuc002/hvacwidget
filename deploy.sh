#!/bin/bash

# Production Deployment Script for ServicePlan Pro
# This script ensures proper build output paths and database migrations

echo "🚀 Starting production deployment..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Step 2: Build frontend
echo "📦 Building frontend..."
npm run build:frontend || {
    echo "❌ Frontend build failed"
    exit 1
}

# Step 3: Build backend with correct output path
echo "🔧 Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js --target=node18 || {
    echo "❌ Backend build failed"  
    exit 1
}

# Step 4: Run database migrations
echo "🗄️ Running database migrations..."
npx drizzle-kit push || {
    echo "❌ Database migration failed"
    exit 1
}

# Step 5: Copy static assets
echo "📁 Copying static assets..."
cp -r client/dist/* dist/client/ 2>/dev/null || echo "No client assets to copy"

echo "✅ Production build complete!"
echo "📂 Server bundle: dist/index.js"
echo "🌐 Static assets: dist/client/"
echo ""
echo "To start production server:"
echo "NODE_ENV=production node dist/index.js"