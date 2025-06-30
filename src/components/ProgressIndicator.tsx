import { useLocation } from 'wouter'
import { Heart } from 'lucide-react'

interface ProgressIndicatorProps {
  className?: string
}

export default function ProgressIndicator({ className = '' }: ProgressIndicatorProps) {
  const [location] = useLocation()
  
  const getProgress = () => {
    switch (location) {
      case '/define':
        return 25
      case '/gather':
        return 50
      case '/craft':
        return 75
      case '/audio-hug':
        return 100
      default:
        return 0
    }
  }

  const progress = getProgress()

  if (progress === 0) return null

  const steps = [
    { label: 'Define', value: 25 },
    { label: 'Gather', value: 50 },
    { label: 'Craft', value: 75 },
    { label: 'Audio', value: 100 }
  ]

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/50">
        <div className="flex items-center justify-center space-x-4">
          <Heart className="w-8 h-8 text-purple-600" />
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${
                    progress >= step.value 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-110' 
                      : 'bg-white/80 text-[#4D5563] border-2 border-white/60'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-semibold mt-2 transition-all duration-300 ${
                    progress >= step.value ? 'text-purple-600' : 'text-[#4D5563]/60'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-3 mx-4 rounded-full transition-all duration-500 shadow-inner ${
                    progress > step.value 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'bg-white/60 border border-white/40'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}