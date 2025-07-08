import React, { useEffect } from 'react';
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
import WeavingPage from './pages/WeavingPage';
import UserProfilePage from './pages/UserProfilePage';
import { SoulHugProvider } from './context/SoulHugContext';

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SoulHugProvider>
        <div className="flex flex-col min-h-screen min-h-dvh">
          <Navigation />
          <main className="flex-1 flex flex-col mb-24">
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
          <BottomNavigationBar />
        </div>
      </SoulHugProvider>
    </BrowserRouter>
  );
}