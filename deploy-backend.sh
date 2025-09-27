#!/bin/bash

echo "🚀 Deploying QuantumChat Backend to Railway..."
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Navigate to server directory
cd server

# Initialize Railway project (if not already initialized)
echo "📦 Initializing Railway project..."
railway init

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Backend deployed successfully!"
echo "📱 Your server URL will be shown above"
echo "🔗 Copy the URL and update client/src/config.js"
