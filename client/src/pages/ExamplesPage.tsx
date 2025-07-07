import { Link } from 'react-router-dom'
import { ArrowLeft, Play, Heart, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedTestimonialsDemo from '../components/ui/animated-testimonials-demo'

export default function ExamplesPage() {
  const exampleStats = [
    { label: 'Total Examples', value: '5', icon: Heart, color: 'text-purple-600' },
    { label: 'Average Duration', value: '3:06', icon: Clock, color: 'text-blue-600' },
    { label: 'Categories', value: '4', icon: User, color: 'text-green-600' }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F3F7FF]">
      {/* Floating back button */}
      <motion.div 
        className="fixed top-6 left-6 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/">
          <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group hover:bg-white">
            <ArrowLeft className="w-5 h-5 text-[#4D5563] group-hover:text-purple-600 transition-colors" />
          </button>
        </Link>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Soul Hug Examples
            </span>
          </h1>
          
          <motion.p 
            className="text-xl text-[#4D5563] leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover the power of heartfelt audio messages through these inspiring examples
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {exampleStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-xl border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              </motion.div>
              <div className="text-3xl font-bold text-[#4D5563] mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-[#4D5563]/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Examples Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Featured Soul Hugs
                </span>
              </h2>
              <p className="text-[#4D5563]/80 max-w-2xl mx-auto">
                Listen to these heartfelt examples and get inspired to create your own meaningful audio messages
              </p>
            </div>

            {/* Animated Testimonials Component */}
            <AnimatedTestimonialsDemo />
          </div>
        </motion.div>

        {/* Categories Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Message Categories
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Birthday', count: '1', color: 'from-pink-400 to-rose-500' },
                { name: 'Encouragement', count: '1', color: 'from-blue-400 to-cyan-500' },
                { name: 'Gratitude', count: '1', color: 'from-green-400 to-emerald-500' },
                { name: 'Friendship', count: '1', color: 'from-purple-400 to-indigo-500' },
                { name: 'Celebration', count: '1', color: 'from-yellow-400 to-orange-500' },
                { name: 'Support', count: '0', color: 'from-gray-400 to-gray-500' },
                { name: 'Love', count: '0', color: 'from-red-400 to-pink-500' },
                { name: 'Inspiration', count: '0', color: 'from-teal-400 to-blue-500' }
              ].map((category) => (
                <motion.div
                  key={category.name}
                  className={`bg-gradient-to-br ${category.color} rounded-xl p-4 text-white text-center shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold mb-1">{category.count}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ready to Create Your Own?
              </span>
            </h3>
            <p className="text-[#4D5563]/80 mb-8 max-w-2xl mx-auto">
              Start crafting your personalized Soul Hug and make someone's day brighter with your heartfelt message
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/define">
                <motion.button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5 mr-2 inline" />
                  Create Your Soul Hug
                </motion.button>
              </Link>
              
              <Link to="/my-hugs">
                <motion.button 
                  className="bg-white/60 hover:bg-white/80 backdrop-blur-md text-[#4D5563] px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-xl border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 mr-2 inline" />
                  View My Hugs
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}