import { useEffect, useState } from 'react'
import { Play, Heart, Calendar, Download, Share2, X, Plus, Sparkles, CheckCircle, Star } from 'lucide-react'
import { Link } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ExpandableCardDemo from '../components/ui/expandable-card-demo-standard'
import FloatingDockDemo from '../components/ui/floating-dock-demo'

export default function MyHugsPage() {
  const { savedSoulHugs, loadSavedSoulHugs, deleteSoulHug } = useSoulHug()
  const [hoveredHug, setHoveredHug] = useState<string | null>(null)

  useEffect(() => {
    loadSavedSoulHugs()
  }, [])

  const getThumbnailGradient = (feeling: string) => {
    const gradientMap: { [key: string]: string } = {
      'love': 'from-pink-400 via-rose-500 to-purple-500',
      'appreciation': 'from-blue-400 via-cyan-500 to-teal-500',
      'support': 'from-green-400 via-emerald-500 to-blue-500',
      'encouragement': 'from-yellow-400 via-orange-500 to-red-500',
      'gratitude': 'from-purple-400 via-pink-500 to-rose-500'
    }
    return gradientMap[feeling?.toLowerCase()] || 'from-gray-400 via-gray-500 to-gray-600'
  }

  const getTitle = (hug: any) => {
    if (hug.occasion && hug.recipient) {
      return `${hug.occasion} Message for ${hug.recipient}`
    } else if (hug.recipient) {
      return `Soul Hug for ${hug.recipient}`
    } else {
      return `${hug.coreFeeling} Message`
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF]">

      {/* Floating back button */}
      <motion.div 
        className="fixed top-6 left-6 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/">
          <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group hover:bg-white">
            <Heart className="w-5 h-5 text-[#4D5563] group-hover:text-purple-600 transition-colors" />
          </button>
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Soul Hugs
            </span>
          </h1>
          
          <motion.p 
            className="text-xl text-[#4D5563] leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your saved creations and heartfelt messages
          </motion.p>
        </motion.div>

        {savedSoulHugs.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Heart className="w-20 h-20 mx-auto text-[#4D5563]/60" />
              </motion.div>
              <motion.h3 
                className="text-2xl font-semibold mb-4 text-[#4D5563]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                No Soul Hugs Yet
              </motion.h3>
              <motion.p 
                className="mb-8 text-lg text-[#4D5563]/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Create your first heartfelt message to get started
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Link href="/define">
                  <motion.button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Soul Hug
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/50">
              <ExpandableCardDemo />
            </div>
            
            {/* Floating Dock Demo */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Quick Navigation</span>
                </h3>
                <p className="text-[#4D5563]/80">
                  Access your favorite features with our floating dock
                </p>
              </div>
              <FloatingDockDemo />
            </motion.div>
          </motion.div>
        )}

        {/* Stats */}
        {savedSoulHugs.length > 0 && (
          <motion.div 
            className="mt-16 pt-8 border-t border-white/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="grid grid-cols-3 gap-6">
              <motion.div 
                className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-purple-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {savedSoulHugs.length}
                </motion.div>
                <div className="text-sm font-medium text-[#4D5563]">Total Hugs</div>
              </motion.div>
              
              <motion.div 
                className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-blue-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {savedSoulHugs.reduce((total, hug) => {
                    const duration = hug.duration || '2:30'
                    const [min, sec] = duration.split(':').map(Number)
                    return total + min + sec / 60
                  }, 0).toFixed(0)}
                </motion.div>
                <div className="text-sm font-medium text-[#4D5563]">Minutes Created</div>
              </motion.div>
              
              <motion.div 
                className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-green-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  {new Set(savedSoulHugs.map(hug => hug.recipient)).size}
                </motion.div>
                <div className="text-sm font-medium text-[#4D5563]">People Touched</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Create New Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Link href="/define">
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg relative overflow-hidden shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Soul Hug
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-transparent"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 opacity-70" />
                </motion.div>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}