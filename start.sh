#!/bin/bash

# If you encounter "EADDRINUSE" errors, please manually stop previous runs by pressing Ctrl+C.
# This script no longer automatically kills processes due to environment compatibility issues.

# Start the backend server
echo "Starting backend server..."
cd "$(dirname "$0")" # Navigate to the script's directory
cd server
npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 2

# Start the client
echo "Starting client..."
cd ../client
npm run dev &
CLIENT_PID=$!

# Function to handle exit
cleanup() {
  echo "Shutting down..."
  kill $SERVER_PID 2>/dev/null || true
  kill $CLIENT_PID 2>/dev/null || true
  exit
}

# Set up trap to call cleanup function on exit signals
trap cleanup INT TERM

# Keep script running
echo "SoulLift Audio is running!"
echo "Backend: http://localhost:6002"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services"

while true; do
  sleep 1
done