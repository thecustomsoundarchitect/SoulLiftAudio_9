# SoulLift Audio

## Getting Started

### Running the Application

You can start both the frontend and backend servers with a single command:

```bash
./start.sh
```

Or run them separately:

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend server:
```bash
cd client
npm run dev
```

### Accessing the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Development

### Frontend

The frontend is a React application built with:
- React
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion
- Wouter (for routing)

### Backend

The backend is a Node.js application built with:
- Express
- TypeScript

### Project Structure

```
client/              # Frontend code
  ├── src/
  │   ├── components/  # React components
  │   ├── context/     # React context providers
  │   ├── hooks/       # Custom React hooks
  │   ├── lib/         # Utility functions
  │   └── pages/       # Page components
server/              # Backend code
  ├── index.ts       # Server entry point
  └── routes.ts      # API routes
shared/              # Shared code between frontend and backend
  └── schema.ts      # Shared types and schemas
```

## Troubleshooting

If you encounter any issues starting the application:

1. Make sure ports 5000 and 5173 are not in use
2. Check the logs for any errors
3. Try restarting the application with the start script

```bash
./start.sh
```
