import { Link, useLocation } from 'wouter'
import { Home, Heart, Archive, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNavigation() {
  const [location] = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/define', label: 'Create', icon: Heart },
    { path: '/my-hugs', label: 'My Hugs', icon: Archive },
    { path: '/soul-archive', label: 'Profile', icon: User }
  ]

  const isActive = (path: string) => {
    if (path === '/') return location === '/'
    return location.startsWith(path)
  }

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.button
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: isActive(item.path) ? 1.1 : 1,
                  color: isActive(item.path) ? '#9333ea' : '#6b7280'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-6 h-6" />
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${
                isActive(item.path) ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <motion.div
                  className="w-1 h-1 bg-purple-600 rounded-full mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}