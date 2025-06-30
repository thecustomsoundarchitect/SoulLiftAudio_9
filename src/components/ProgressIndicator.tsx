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
      <div className="flex items-center space-x-4">
        <Heart className="w-8 h-8 text-purple-600" />
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                progress >= step.value 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'bg-white/60 backdrop-blur-md text-[#4D5563] border border-white/30'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                  progress > step.value 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                    : 'bg-white/40'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}