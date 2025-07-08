import { useEffect, useState } from 'react'
import { Play, Heart, Calendar, Download, Share2, X, Plus, Sparkles, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ExpandableCardDemo from '../components/ui/expandable-card-demo-standard'

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

  // Mock data for demonstration
  const mockSoulHugs = [
    {
      id: '1',
      title: 'Happy Birthday Mom',
      description: 'Birthday Message • 3:45',
      recipient: 'Mom',
      coreFeeling: 'love',
      occasion: 'Birthday',
      duration: '3:45',
      createdAt: '2024-01-15',
      audioUrl: '/audio/birthday-mom.mp3',
      coverImage: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: "You've Got This, Sarah",
      description: 'Encouragement • 2:30',
      recipient: 'Sarah',
      coreFeeling: 'encouragement',
      occasion: 'Support',
      duration: '2:30',
      createdAt: '2024-01-10',
      audioUrl: '/audio/encouragement-sarah.mp3',
      coverImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Thank You, Dad',
      description: 'Gratitude • 4:15',
      recipient: 'Dad',
      coreFeeling: 'gratitude',
      occasion: 'Thank You',
      duration: '4:15',
      createdAt: '2024-01-05',
      audioUrl: '/audio/gratitude-dad.mp3',
      coverImage: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]

  // Use mock data if no saved hugs exist
  const displayHugs = savedSoulHugs.length > 0 ? savedSoulHugs : mockSoulHugs

  return (
    <div 
      className="flex-1 flex flex-col overflow-y-auto bg-[#F3F7FF]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-20 pb-16 sm:pb-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Soul Hugs
            </span>
          </h1>
          <p className="text-lg text-[#4D5563] mb-4">
            "Your saved creations and heartfelt messages"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/50">
            <ExpandableCardDemo />
          </div>
        </motion.div>

        {/* Stats */}
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
                {displayHugs.length}
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
                {displayHugs.reduce((total, hug) => {
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
                {new Set(displayHugs.map(hug => hug.recipient)).size}
              </motion.div>
              <div className="text-sm font-medium text-[#4D5563]">People Touched</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Create New Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Link to="/define">
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Soul Hug
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}