import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function WeavingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-redirect to craft page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/craft')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <motion.div
      className="flex-1 flex flex-col bg-[#F3F7FF] py-12"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-1 flex items-center justify-center pb-24 sm:pb-28">
        <div className="text-center">
          {/* Processing Image Placeholder */}
          <div className="mb-8 flex justify-center">
            <img
              src="https://placehold.co/128x128/8B5CF6/FFFFFF?text=%E2%88%9E"
              alt="Loading..."
              className="w-32 h-32"
            />
          </div>

          {/* Magic Text */}
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              The Magic is Happening...
            </span>
          </h1>

          {/* Animated Dots Loader */}
          <div className="flex justify-center items-center mt-4">
            <span className="inline-block w-3 h-3 mx-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="inline-block w-3 h-3 mx-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-3 h-3 mx-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-16px); }
              }
              .animate-bounce {
                animation: bounce 1.2s infinite;
              }
            `}</style>
          </div>
          <p className="text-lg text-[#4D5563] mt-4">
            Weaving your thoughts into something beautiful
          </p>
        </div>
      </div>
    </motion.div>
  )
}
