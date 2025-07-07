import { useEffect, useState } from 'react'

function WeaveTransferPage() {
  const [fadeOut, setFadeOut] = useState(false)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    document.title = 'Weave Transfer Page'
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setRedirected(true) // Simulate redirection
      }, 800)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (redirected) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <h1 className="text-3xl font-bold">Redirected to Craft Page 🚀</h1>
      </div>
    )
  }

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#F3F7FF] font-['Poppins'] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Weave Transfer Page
            </span>
          </h1>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <span className="w-3 h-3 bg-purple-400 rounded-full bounce delay-0" />
            <span className="w-3 h-3 bg-blue-400 rounded-full bounce delay-200" />
            <span className="w-3 h-3 bg-pink-400 rounded-full bounce delay-400" />
          </div>

          <p className="text-lg text-[#4D5563] mt-4">
            Weaving your thoughts into something beautiful
          </p>
        </div>
      </div>

      <style>{`
        .bounce {
          display: inline-block;
          animation: bounce 1.2s infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-16px);
          }
        }
      `}</style>
    </div>
  )
}

export default WeaveTransferPage
