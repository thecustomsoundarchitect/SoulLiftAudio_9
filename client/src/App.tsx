import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import BottomNavigationBar from './components/BottomNavigationBar';
import HomePage from './pages/HomePage';
import DefinePage from './pages/DefinePage';
import GatherPage from './pages/GatherPage';
import CraftPage from './pages/CraftPage';
import AudioHugPage from './pages/AudioHugPage';
import ExamplesPage from './pages/ExamplesPage';
import MyHugsPage from './pages/MyHugsPage';
import TransitionPage from './pages/TransitionPage';
import UserProfilePage from './pages/UserProfilePage';
import { SoulHugProvider } from './context/SoulHugContext';

function AppContent() {
  const location = useLocation();
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <SoulHugProvider>
      <div className="flex flex-col min-h-dvh">
        <Navigation />
        <main ref={mainContentRef} className="flex-1 flex flex-col overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/define" element={<DefinePage />} />
            <Route path="/gather" element={<GatherPage />} />
            <Route path="/craft" element={<CraftPage />} />
            <Route path="/audio-hug" element={<AudioHugPage />} />
            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="/my-hugs" element={<MyHugsPage />} />
            <Route path="/transition" element={<TransitionPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
          </Routes>
        </main>
        <BottomNavigationBar />
      </div>
    </SoulHugProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}