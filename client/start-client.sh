#!/bin/bash

# Kill any running processes on port 5173
echo "Shutting down any existing frontend processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start the client
echo "Starting SoulLift Audio frontend..."
npm run dev
