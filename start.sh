#!/bin/bash

# Kill any running processes on ports 5000 and 5173
echo "Shutting down any existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

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
function cleanup {
  echo "Shutting down..."
  kill $SERVER_PID 2>/dev/null || true
  kill $CLIENT_PID 2>/dev/null || true
  exit
}

# Set up trap to call cleanup function on exit signals
trap cleanup INT TERM

# Keep script running
echo "SoulLift Audio is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services"

wait
