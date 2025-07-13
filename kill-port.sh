#!/bin/bash

echo "🔍 Checking for processes using port 6002..."

# Find process using port 6002
PID=$(lsof -ti:6002)

if [ -n "$PID" ]; then
    echo "📍 Found process $PID using port 6002"
    echo "🔪 Killing process $PID..."
    kill -9 $PID
    sleep 2
    
    # Check if process is still running
    if kill -0 $PID 2>/dev/null; then
        echo "❌ Process $PID is still running, trying force kill..."
        sudo kill -9 $PID 2>/dev/null || true
    else
        echo "✅ Process $PID successfully terminated"
    fi
else
    echo "✅ No process found using port 6002"
fi

# Also kill any node processes that might be hanging
echo "🧹 Cleaning up any hanging node processes..."
pkill -f "tsx index.ts" 2>/dev/null || true
pkill -f "soulliftaudio-server" 2>/dev/null || true

echo "🚀 Starting the application..."
npm run dev