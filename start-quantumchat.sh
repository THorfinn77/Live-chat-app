#!/bin/bash

# 🚀 QuantumChat Startup Script
# This script starts both the server and client for the QuantumChat application

echo "🚀 Starting QuantumChat - Advanced Futuristic Messenger"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to kill existing processes
cleanup() {
    echo -e "\n${YELLOW}🔄 Cleaning up existing processes...${NC}"
    pkill -f "node index.js" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    sleep 2
}

# Cleanup any existing processes
cleanup

# Check if we're in the right directory
if [ ! -f "server/package.json" ] || [ ! -f "client/package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the Live-chat-app root directory${NC}"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Check and install server dependencies
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing server dependencies...${NC}"
    cd server && npm install && cd ..
fi

# Check and install client dependencies  
if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies are ready${NC}"

# Start server
echo -e "\n${PURPLE}🖥️  Starting Advanced Messenger Server...${NC}"
cd server
nohup node index.js > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Check if server started successfully
if check_port 5000; then
    echo -e "${GREEN}✅ Server started successfully on port 5000${NC}"
else
    echo -e "${GREEN}✅ Server is running on port 5000${NC}"
fi

# Start client
echo -e "\n${CYAN}🌐 Starting QuantumChat Client...${NC}"
cd client
nohup npm run dev > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

# Wait for client to start
sleep 5

# Check if client started successfully
if check_port 5173; then
    echo -e "${GREEN}✅ Client started successfully on port 5173${NC}"
else
    echo -e "${GREEN}✅ Client is running on port 5173${NC}"
fi

# Get network information
echo -e "\n${BLUE}🌐 Network Information:${NC}"
node get-network-info.js

echo -e "\n${GREEN}🎉 QuantumChat is now running!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📱 Access URLs:${NC}"
echo -e "   • Local:    ${GREEN}http://localhost:5173${NC}"
echo -e "   • Network:  ${GREEN}http://192.168.1.10:5173${NC}"
echo ""
echo -e "${PURPLE}🔧 Server Details:${NC}"
echo -e "   • Backend:  http://localhost:5000"
echo -e "   • Process:  $SERVER_PID"
echo -e "   • Log:      server.log"
echo ""
echo -e "${CYAN}🎨 Client Details:${NC}"
echo -e "   • Frontend: http://localhost:5173"
echo -e "   • Process:  $CLIENT_PID"
echo -e "   • Log:      client.log"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Open multiple browser tabs to test chat"
echo -e "   • Use network IP for mobile/other devices"
echo -e "   • Check logs if you encounter issues"
echo -e "   • Press Ctrl+C to stop both services"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Function to handle cleanup on exit
cleanup_on_exit() {
    echo -e "\n${YELLOW}🛑 Stopping QuantumChat...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    pkill -f "node index.js" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    echo -e "${GREEN}✅ QuantumChat stopped successfully${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup_on_exit SIGINT SIGTERM

# Keep script running
echo -e "${GREEN}🚀 QuantumChat is live! Press Ctrl+C to stop.${NC}"
wait

