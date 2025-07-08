import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'

const feelingOptions = [
  "deeply appreciated and valued",
  "completely loved and cherished", 
  "truly understood and seen",
  "incredibly proud and accomplished",
  "genuinely supported and cared for",
  "absolutely amazing and special",
  "wonderfully unique and important",
  "perfectly loved just as they are"
]

const toneOptions = [
  'Warm & Loving', 'Playful & Fun', 'Deep & Meaningful', 'Gentle & Comforting',
  'Inspiring & Uplifting', 'Heartfelt & Sincere', 'Light & Cheerful',
  'Professional & Respectful', 'Serious & Thoughtful', 'Grateful & Appreciative'
]

const occasions = [
  'Birthday', 'Anniversary', 'Graduation', 'New Job', 'Difficult Time',
  'Just Because', 'Thank You', 'Apology', 'Encouragement', 'Celebration'
]

interface AgeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const AgeSlider: React.FC<AgeSliderProps> = ({ label, value, onChange, min = 5, max = 100 }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-3">
      <span className="text-gray-700 font-medium text-sm">{label}</span>
      <span className="text-purple-600 font-bold text-lg">{value}</span>
    </div>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer age-slider"
        style={{
          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  </div>
)

export default function DefinePage() {
  const navigate = useNavigate()
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [formData, setFormData] = useState({
    recipient: currentSoulHug.recipient || '',
    coreFeeling: currentSoulHug.coreFeeling || '',
    occasion: currentSoulHug.occasion || '',
    tone: currentSoulHug.tone || '',
    theirAge: 25,
    yourAge: 30
  })

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const handleContinue = () => {
    updateCurrentSoulHug({
      recipient: formData.recipient,
      coreFeeling: formData.coreFeeling,
      occasion: formData.occasion,
      tone: formData.tone
    })
    navigate('/gather')
  }

  const handleDropdownSelect = (field: string, value: string) => {
    setFormData({...formData, [field]: value})
    setDropdownOpen(null)
  }

  const isFormComplete = formData.coreFeeling && formData.tone

  return (
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="max-w-md mx-auto px-4 py-6 pb-24 sm:pb-28">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Define Your Message
              </span>
            </h1>
            <p className="text-lg text-[#4D5563] mb-4 text-right">
              "We'll help you find the perfect words to share."
            </p>
          </div>

          {/* Essential Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              ESSENTIAL
            </h2>
            
            <div className="space-y-4">
              {/* How Do You Want Them to Feel */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'feeling' ? null : 'feeling')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.coreFeeling || 'How Do You Want Them to Feel After'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'feeling' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {feelingOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('coreFeeling', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tone of the Message */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'tone' ? null : 'tone')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.tone || 'Tone Of the Message'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'tone' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {toneOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('tone', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Just For Extra Heart Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              JUST FOR EXTRA HEART
            </h2>
            
            <div className="space-y-4">
              {/* Occasion */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'occasion' ? null : 'occasion')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.occasion || 'Occasion'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'occasion' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {occasions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('occasion', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recipient Name */}
              <input
                type="text"
                placeholder="Enter who is this for eg. Name"
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-colors text-sm"
              />

              {/* Age Sliders */}
              <div className="space-y-4">
                <AgeSlider
                  label="Their Age"
                  value={formData.theirAge}
                  onChange={(value) => setFormData({...formData, theirAge: value})}
                />
                <AgeSlider
                  label="Your Age"
                  value={formData.yourAge}
                  onChange={(value) => setFormData({...formData, yourAge: value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!isFormComplete}
              className="w-40 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-medium py-2 rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Gather
            </button>
          </div>
          {!isFormComplete && (
            <p className="text-xs mt-2 text-gray-500">
              Please select a feeling and tone to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}