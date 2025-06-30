import { motion } from 'framer-motion'
import { Link } from 'wouter'
import { Plus, Eye, Headphones, Heart, Infinity } from 'lucide-react'
import { WavyBackground } from '../components/ui/wavy-background'

export default function HomePage() {
  return (
    <WavyBackground
      className="min-h-screen"
      containerClassName="min-h-screen"
      colors={["#5B2885", "#DF86F9", "#29D3FF"]}
      waveWidth={50}
      backgroundFill="white"
      blur={15}
      speed="slow"
      waveOpacity={0.2}
    >
      <div className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-16">
            <motion.div
              className="relative mx-auto mb-6 md:mb-8 w-16 h-16 sm:w-20 sm:h-20"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [-180, 0, 0],
                opacity: [0, 1, 1]
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut",
                times: [0, 0.7, 1]
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: { 
                  rotate: { duration: 0.5, ease: "easeInOut" },
                  scale: { duration: 0.2 }
                }
              }}
            >
              {/* Splash effect background */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)'
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: 999999,
                  ease: "easeInOut"
                }}
              />
              
              {/* Secondary splash ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: 999999,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              {/* Main logo - using Heart icon as fallback */}
              <motion.div
                className="w-full h-full flex items-center justify-center relative z-10"
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: 999999,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-12 h-12 text-purple-600" />
              </motion.div>
              
              {/* Sparkle effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: 999999,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SoulLift
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-700 mt-2">Audio</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              Join thousands creating meaningful connections through personalized audio messages
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="flex flex-col items-center gap-6 max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto mb-8 md:mb-12">
            <Link href="/define">
              <button className="
                relative
                bg-gradient-to-br from-purple-400 to-purple-600 
                rounded-3xl 
                p-6 
                shadow-xl 
                text-white 
                font-semibold 
                text-lg
                transform 
                hover:scale-105 
                transition-all 
                duration-200
                border-0
                min-w-[280px]
                overflow-hidden
                before:absolute
                before:inset-0
                before:bg-gradient-to-br
                before:from-white/30
                before:via-white/10
                before:to-transparent
                before:rounded-3xl
                before:pointer-events-none
                after:absolute
                after:top-0
                after:left-0
                after:right-0
                after:h-1/2
                after:bg-gradient-to-b
                after:from-white/20
                after:to-transparent
                after:rounded-t-3xl
                after:pointer-events-none
              ">
                <span className="relative z-10">Create New Soul Hug</span>
              </button>
            </Link>

            <Link href="/examples">
              <button className="
                relative
                bg-gradient-to-br from-green-400 to-green-600 
                rounded-3xl 
                p-6 
                shadow-xl 
                text-white 
                font-semibold 
                text-lg
                transform 
                hover:scale-105 
                transition-all 
                duration-200
                border-0
                min-w-[280px]
                overflow-hidden
                before:absolute
                before:inset-0
                before:bg-gradient-to-br
                before:from-white/30
                before:via-white/10
                before:to-transparent
                before:rounded-3xl
                before:pointer-events-none
                after:absolute
                after:top-0
                after:left-0
                after:right-0
                after:h-1/2
                after:bg-gradient-to-b
                after:from-white/20
                after:to-transparent
                after:rounded-t-3xl
                after:pointer-events-none
              ">
                <span className="relative z-10">View Soul Hug Examples</span>
              </button>
            </Link>

            <Link href="/my-hugs">
              <button className="
                relative
                bg-gradient-to-br from-blue-400 to-blue-600 
                rounded-3xl 
                p-6 
                shadow-xl 
                text-white 
                font-semibold 
                text-lg
                transform 
                hover:scale-105 
                transition-all 
                duration-200
                border-0
                min-w-[280px]
                overflow-hidden
                before:absolute
                before:inset-0
                before:bg-gradient-to-br
                before:from-white/30
                before:via-white/10
                before:to-transparent
                before:rounded-3xl
                before:pointer-events-none
                after:absolute
                after:top-0
                after:left-0
                after:right-0
                after:h-1/2
                after:bg-gradient-to-b
                after:from-white/20
                after:to-transparent
                after:rounded-t-3xl
                after:pointer-events-none
              ">
                <span className="relative z-10">View My Soul Hugs</span>
              </button>
            </Link>
          </div>

          {/* Sign In CTA */}
          <div className="text-center">
            <button className="soul-button-outline text-base md:text-lg px-8">
              Sign In to Save Your Creations
            </button>
          </div>
        </div>
      </div>
    </WavyBackground>
  )
}