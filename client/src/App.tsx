import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DefinePage from './pages/DefinePage';
import GatherPage from './pages/GatherPage';
import CraftPage from './pages/CraftPage';
import AudioHugPage from './pages/AudioHugPage';
import ExamplesPage from './pages/ExamplesPage';
import MyHugsPage from './pages/MyHugsPage';
import WeavingPage from './pages/WeavingPage';
import UserProfilePage from './pages/UserProfilePage';
import { SoulHugProvider } from './context/SoulHugContext';

export default function App() {
  return (
    <BrowserRouter>
      <SoulHugProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/define" element={<DefinePage />} />
              <Route path="/gather" element={<GatherPage />} />
              <Route path="/craft" element={<CraftPage />} />
              <Route path="/audio-hug" element={<AudioHugPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              <Route path="/my-hugs" element={<MyHugsPage />} />
              <Route path="/weaving" element={<WeavingPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
            </Routes>
          </main>
        </div>
      </SoulHugProvider>
    </BrowserRouter>
  );
}