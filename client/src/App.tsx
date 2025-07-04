import { Router, Route, Switch, useLocation } from 'wouter'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DefinePage from './pages/DefinePage'
import GatherPage from './pages/GatherPage'
import CraftPage from './pages/CraftPage'
import AudioHugPage from './pages/AudioHugPage'
import MyHugsPage from './pages/MyHugsPage'
import SoulArchivePage from './pages/SoulArchivePage'
import ExamplesPage from './pages/ExamplesPage'
import WeavingPage from './pages/WeavingPage'
// import BottomNavigation from './components/BottomNavigation'
import { SoulHugProvider } from './context/SoulHugContext'

function AppContent() {
  const [location] = useLocation();
  const showNavigation = location !== '/' && location !== '/examples';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#311A55] via-[#5B2885] to-[#241946]">
      {showNavigation && <Navigation />}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/examples" component={ExamplesPage} />
          <Route path="/define" component={DefinePage} />
          <Route path="/gather" component={GatherPage} />
          <Route path="/craft" component={CraftPage} />
          <Route path="/audio-hug" component={AudioHugPage} />
          <Route path="/weaving" component={WeavingPage} />
          <Route path="/my-hugs" component={MyHugsPage} />
          <Route path="/soul-archive" component={SoulArchivePage} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
                <p className="text-white/80">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
      {/* <BottomNavigation /> */}
    </div>
  );
}

function App() {
  return (
    <SoulHugProvider>
      <Router>
        <AppContent />
      </Router>
    </SoulHugProvider>
  )
}

export default App