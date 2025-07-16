import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SoulHugProvider } from './context/SoulHugContext'; // Import SoulHugProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <SoulHugProvider> {/* Wrap App with SoulHugProvider */}
      <App />
    </SoulHugProvider>
  </StrictMode>
);