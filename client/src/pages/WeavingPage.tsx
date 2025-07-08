import { useEffect } from 'react'
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
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="flex-1 flex items-center justify-center pb-24 sm:pb-28">
        <div className="text-center">
          {/* Processing Image Placeholder */}
          <div className="mb-8 flex justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/loading.svg"
              alt="Processing..."
              className="w-32 h-32 animate-spin-slow"
              style={{ animation: 'spin 2s linear infinite' }}
            />
            <style>{`
              @keyframes spin {
                100% { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                animation: spin 2s linear infinite;
              }
            `}</style>
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
    </div>
  )
}
