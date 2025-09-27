#!/bin/bash

echo "🔧 Updating QuantumChat Configuration..."
echo "======================================"

# Navigate to project directory
cd "/home/thorfinn77/Documents/cursor go/java /Live-chat-app"

# Add changes
git add client/src/config.js

# Commit changes
git commit -m "🔗 Update production URLs for cross-WiFi deployment

- Backend: https://live-chat-app-finale.onrender.com
- Frontend: https://live-chat-fasvtpdgg-thorfinns-projects-edbf0f6d.vercel.app
- Ready for cross-WiFi chat testing"

# Push to GitHub
git push origin main

echo "✅ Configuration updated and pushed to GitHub!"
echo "🚀 Your chat app is now ready for cross-WiFi testing!"
echo ""
echo "🌍 Test URLs:"
echo "   Frontend: https://live-chat-fasvtpdgg-thorfinns-projects-edbf0f6d.vercel.app"
echo "   Backend:  https://live-chat-app-finale.onrender.com"
echo ""
echo "📱 Test on different devices and WiFi networks!"
