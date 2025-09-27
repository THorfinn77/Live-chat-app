#!/bin/bash

echo "🔧 Fixing QuantumChat Backend Server..."
echo "====================================="

# Navigate to project directory
cd "/home/thorfinn77/Documents/cursor go/java /Live-chat-app"

# Add changes
git add server/index.js

# Commit changes
git commit -m "🔧 Fix backend server - add root route and health check

- Add basic GET route for Render health check
- Add /health endpoint for monitoring
- Fix 'Cannot GET' error on backend URL
- Server now responds properly to requests"

# Push to GitHub
git push origin main

echo "✅ Backend fix pushed to GitHub!"
echo "🔄 Render will auto-deploy the fix..."
echo ""
echo "⏱️  Wait 2-3 minutes for Render to redeploy"
echo "🧪 Then test: https://live-chat-app-finale.onrender.com"
echo ""
echo "📱 After backend is fixed, test your chat app!"
