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
      <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/50">
        <div className="flex items-center justify-center space-x-3">
          <Heart className="w-6 h-6 text-purple-600" />
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    progress >= step.value 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600' 
                      : 'bg-white text-[#4D5563] border-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                    progress >= step.value ? 'text-purple-600' : 'text-[#4D5563]/60'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    progress > step.value 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'bg-gray-300'
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