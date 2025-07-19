Application Architecture Schematic


1. The Frontend (Client)
Location: /client/ folder

What it is: Your React application, running locally in a development server provided by Vite.

Key Component: The GatherPage.tsx component, which sends requests for prompts.

The User's View: The user interacts with your app in their web browser at http://localhost:5173.

2. The Vite Development Server
Location: Running from your client/ folder (via the npm run client command).

What it is: A server that runs your frontend code. It handles hot-reloading (updating the page as you code).

Its Job: It listens for requests from the browser at http://localhost:5173. When it sees a request to /api/..., it knows to forward it.

3. The Proxy (In client/vite.config.ts)
Location: Defined inside your client/vite.config.ts file.

What it is: A set of rules that tells Vite to forward requests to a different server.

Its Job:

Intercepts any request from the browser that starts with /api/.

Redirects that request to your backend's URL: http://localhost:5001.

Example Flow: When GatherPage.tsx runs fetch('/api/prompt-seeds'), the proxy intercepts this call and sends it to http://localhost:5001/api/prompt-seeds instead.

4. The Backend Server
Location: /server/ folder (running from your npm run dev command).

What it is: Your Express.js/Node.js server that handles the business logic.

Its Job:

Listens for requests at http://localhost:5001.

Receives the forwarded request from the Vite proxy (e.g., POST /api/prompt-seeds).

Runs the code for that endpoint (e.g., calls the OpenAI API using your OPENAI_API_KEY).

Sends back the response (e.g., the array of generated prompts).

How the SoulHugProvider Wraps Everything Together
File: src/context/SoulHugContext.tsx

Purpose: The provider is responsible for sharing data (currentSoulHug, collectedThoughts, etc.) and functions (updateCurrentSoulHug) with all the components in your React application that need it.

Its Location: The SoulHugProvider component is placed in your src/main.tsx file, where it wraps your entire <App /> component.

The Flow:

main.tsx renders <SoulHugProvider>.

This provider creates and stores the shared data.

The provider then renders its <App /> children.

Any component inside <App /> (like DefinePage or GatherPage) can then call useSoulHug() to access that shared data, and it will never throw the must be used within... error because the provider is already wrapping it.

Here is a schematic that outlines the key parts of your project as we have them configured and working.

-----

### SoulLift Audio Application Schematic

```
├── Project Root
│   ├── .gitignore             → Correctly ignores .env, node_modules, etc.
│   ├── package.json           → Manages all dependencies and scripts
│   │   ├── "dev" script         → Starts the backend
│   │   └── "client" script      → Starts the frontend
│   │
│   ├── Backend (Node.js + Express)
│   │   ├── server/
│   │   │   ├── index.ts        → Main backend entry point
│   │   │   │   └── Fix: Express import and buildPrompt call added
│   │   │   ├── promptRules.ts  → Business logic for prompt rules
│   │   │   │   └── Fix: Correct "export" added for functions
│   │   │   └── .env            → Private API keys and port
│   │   │       └── Fix: Cleaned up and correctly formatted
│   │   │
│   ├── Frontend (React + Vite)
│   │   ├── client/
│   │   │   ├── src/
│   │   │   │   ├── main.tsx    → Renders the root of the app
│   │   │   │   │   └── Fix: SoulHugProvider now wraps the App
│   │   │   │   ├── App.tsx     → Manages routing to pages
│   │   │   │   └── context/SoulHugContext.tsx → Defines the shared context
│   │   │   └── vite.config.ts  → Configures the frontend dev server
│   │   │       └── Fix: Only one file, correctly configured with proxy
│   │
└── Application Flow
    │
    ├── 1. User opens browser
    │   └──→ Requests http://localhost:5173
    │
    ├── 2. Frontend Server (Vite)
    │   ├── Runs from `npm run client`
    │   └── Serves the React application
    │
    ├── 3. API Call
    │   │   (e.g., GatherPage calls fetch('/api/prompt-seeds', ...))
    │   └──→ Vite Proxy intercepts the "/api/" path
    │
    ├── 4. Request Forwarding
    │   └──→ Proxy forwards the call to http://localhost:5001
    │
    ├── 5. Backend Server (Express)
    │   ├── Runs from `npm run dev`
    │   └── Receives the request and calls OpenAI using the .env key
    │
    └── 6. Response
        └──→ Backend sends prompts back to the Frontend through the proxy

### SoulLift Audio Application Flow

```Define Page → User enters: recipient, occasion, core feeling, tone
Gather Page → Shows 8 AI-generated prompt seeds + standard descriptors

Users tap prompts to write thoughts OR check them to add directly
Everything goes into "collected thoughts" box


Transition Page → "Magic happening" while API generates the message
Craft Page → Shows the generated message for editing
Audio Hug Page → Optional audio version

So the /api/prompt-seeds endpoint needs to generate high-quality, specific prompts like your examples that help users remember meaningful moments about the recipient.