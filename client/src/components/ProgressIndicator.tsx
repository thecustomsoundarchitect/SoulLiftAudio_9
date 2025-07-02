import { useLocation } from 'wouter'

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
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              progress >= step.value 
                ? 'border-purple-600 text-purple-600' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
              progress >= step.value ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}