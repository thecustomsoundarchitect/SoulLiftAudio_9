import { Link, useLocation } from 'wouter'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNavigation() {
  const [location] = useLocation()

  const navItems = [
    { path: '/', icon: ArrowUp },
    { path: '/define', icon: ArrowRight },
    { path: '/my-hugs', icon: ArrowDown },
    { path: '/soul-archive', icon: ArrowLeft }
  ]

  const isActive = (path: string) => {
    if (path === '/') return location === '/'
    return location.startsWith(path)
  }

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.button
              className={`p-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: isActive(item.path) ? 1.1 : 1,
                  color: isActive(item.path) ? '#c084fc' : '#9ca3af'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}