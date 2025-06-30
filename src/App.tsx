import { Router, Route, Switch, useLocation } from 'wouter'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DefinePage from './pages/DefinePage'
import GatherPage from './pages/GatherPage'
import CraftPage from './pages/CraftPage'
import AudioHugPage from './pages/AudioHugPage'
import MyHugsPage from './pages/MyHugsPage'
import SoulArchivePage from './pages/SoulArchivePage'
import BottomNavigation from './components/BottomNavigation'

function AppContent() {
  const [location] = useLocation()
  const showNavigation = location !== '/'

  return (
    <>
      {showNavigation && <Navigation />}
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/define" component={DefinePage} />
          <Route path="/gather" component={GatherPage} />
          <Route path="/craft" component={CraftPage} />
          <Route path="/audio-hug" component={AudioHugPage} />
          <Route path="/my-hugs" component={MyHugsPage} />
          <Route path="/soul-archive" component={SoulArchivePage} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="soul-card text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
      <BottomNavigation />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#311A55] via-[#5B2885] to-[#241946]">
      <Router>
        <AppContent />
      </Router>
    </div>
  )
}

export default App