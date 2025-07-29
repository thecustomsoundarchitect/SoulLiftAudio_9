import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'
import { motion } from 'framer-motion'
import '../components/ui/fancy-button.css'

const feelingOptions = [
  "Completely and unconditionally loved",
  "Cherished and adored",
  "Wrapped in warmth and affection",
  "Deeply appreciated for who they are",
  "Genuinely thankful for their presence",
  "Recognized and valued",
  "Empowered and believed in",
  "Supported, no matter the challenge",
  "Uplifted and encouraged",
  "Incredibly proud of their accomplishments",
  "Celebrated for being amazing",
  "A sense of success and achievement",
  "Comforted and reassured",
  "Understood and not alone",
  "A sense of peace and tranquility",
  "Filled with pure joy",
  "A bright spot of cheer in their day",
  "Excited and optimistic",
  "Inspired to chase their dreams",
  "Motivated and ready to take on anything",
  "Reminded of their own strength",
  "Truly seen, heard, and understood",
  "A strong sense of connection",
  "Like they are an essential part of my world"
]

const toneOptions = [
  'Warm & Loving', 'Playful & Fun', 'Light & Cheerful', 'Grateful & Appreciative',
  'Deep & Meaningful', 'Gentle & Comforting', 'Heartfelt & Sincere', 'Serious & Thoughtful',
  'Inspiring & Uplifting', 'Professional & Respectful'
]

const occasions = [
  'Birthday', 'Anniversary', 'Graduation', 'New Job', 'Celebration',
  'Difficult Time', 'Apology', 'Encouragement',
  'Just Because', 'Thank You', 'Other'
]

interface AgeSelectorProps {
  label: string
  value: number
  onChange: (value: number) => void
}

const AgeSelector: React.FC<AgeSelectorProps> = ({ label, value, onChange }) => {
  const increment = () => onChange(value < 100 ? value + 1 : 100)
  const decrement = () => onChange(value > 5 ? value - 1 : 5)

  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={decrement}
          className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-600 text-xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          -
        </button>
        <span className="text-2xl font-bold text-pink-500 w-12 text-center">{value}</span>
        <button
          type="button"
          onClick={increment}
          className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-600 text-xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

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
  const [customOccasion, setCustomOccasion] = useState('')

  useEffect(() => {
    const predefinedOccasions = [
      'Birthday', 'Anniversary', 'Graduation', 'New Job', 'Difficult Time',
      'Just Because', 'Thank You', 'Apology', 'Encouragement', 'Celebration'
    ];
    if (currentSoulHug.occasion && !predefinedOccasions.includes(currentSoulHug.occasion)) {
      setFormData(prev => ({ ...prev, occasion: 'Other' }));
      setCustomOccasion(currentSoulHug.occasion);
    }
  }, [])

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const handleContinue = () => {
    updateCurrentSoulHug({
      recipient: formData.recipient,
      coreFeeling: formData.coreFeeling,
      occasion: formData.occasion === 'Other' ? customOccasion : formData.occasion,
      tone: formData.tone
    })
    navigate('/gather')
  }

  const handleDropdownSelect = (field: string, value: string) => {
    setFormData({...formData, [field]: value})
    if (field === 'occasion' && value !== 'Other') {
      setCustomOccasion('')
    }
    setDropdownOpen(null)
  }

  const isFormComplete = formData.coreFeeling && formData.tone

  return (
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <motion.div
        className="max-w-md mx-auto px-4 py-12 pb-24 sm:pb-28"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <img
              src="https://i.imgur.com/8S5iLDn.png"
              alt="Define Your Message"
              className="w-full h-auto mb-4"
            />
          </div>

          {/* Essential Section */}
          <div>
            <p className="text-sm mb-4">
              <span className="text-pink-500 font-bold uppercase tracking-wide">BASICS</span>
              <span className="text-black"> - Essential details that shape what questions we'll ask you</span>
            </p>
            
            <div className="space-y-4">
              {/* How Do You Want Them to Feel */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-4">How do you want them to feel?</label>
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'feeling' ? null : 'feeling')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.coreFeeling || 'Select a feeling...'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'feeling' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {feelingOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('coreFeeling', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tone of the Message */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-4">What is the tone of the message?</label>
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'tone' ? null : 'tone')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.tone || 'Select a tone...'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'tone' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {toneOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('tone', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Touch Section */}
          <div>
            <p className="text-sm mb-4">
              <span className="text-pink-500 font-bold uppercase tracking-wide">Personal Touch</span>
              <span className="text-black"> - Add these for more specific personalized prompts</span>
            </p>
            
            <div className="space-y-4">
              {/* Occasion */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-4">What is the occasion?</label>
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'occasion' ? null : 'occasion')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formData.occasion || 'Select an occasion...'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {dropdownOpen === 'occasion' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {occasions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDropdownSelect('occasion', option)}
                        className="w-full p-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {formData.occasion === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify occasion"
                  value={customOccasion}
                  onChange={(e) => setCustomOccasion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                />
              )}

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-4">Who is this for?</label>
                <input
                  type="text"
                  placeholder="e.g., Dad, Jane, My Best Friend"
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Age Selectors */}
              <div className="flex justify-around pt-4">
                <AgeSelector
                  label="Their Age"
                  value={formData.theirAge}
                  onChange={(value) => setFormData({ ...formData, theirAge: value })}
                />
                <AgeSelector
                  label="Your Age"
                  value={formData.yourAge}
                  onChange={(value) => setFormData({ ...formData, yourAge: value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-16 text-center">
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!isFormComplete}
              className="button"
            >
              <div className="bg"></div>
              <div className="wrap">
                <div className="content">
                  <div className="char state-1">
                    <span data-label="L" style={{'--i': 0} as React.CSSProperties}>L</span>
                    <span data-label="e" style={{'--i': 1} as React.CSSProperties}>e</span>
                    <span data-label="t" style={{'--i': 2} as React.CSSProperties}>t</span>
                    <span data-label="s" style={{'--i': 3} as React.CSSProperties}>s</span>
                    <span data-label=" " style={{'--i': 4} as React.CSSProperties}>&nbsp;</span>
                    <span data-label="g" style={{'--i': 5} as React.CSSProperties}>g</span>
                    <span data-label="a" style={{'--i': 6} as React.CSSProperties}>a</span>
                    <span data-label="t" style={{'--i': 7} as React.CSSProperties}>t</span>
                    <span data-label="h" style={{'--i': 8} as React.CSSProperties}>h</span>
                    <span data-label="e" style={{'--i': 9} as React.CSSProperties}>e</span>
                    <span data-label="r" style={{'--i': 10} as React.CSSProperties}>r</span>
                    <span data-label=" " style={{'--i': 11} as React.CSSProperties}>&nbsp;</span>
                    <span data-label="y" style={{'--i': 12} as React.CSSProperties}>y</span>
                    <span data-label="o" style={{'--i': 13} as React.CSSProperties}>o</span>
                    <span data-label="u" style={{'--i': 14} as React.CSSProperties}>u</span>
                    <span data-label="r" style={{'--i': 15} as React.CSSProperties}>r</span>
                    <span data-label=" " style={{'--i': 16} as React.CSSProperties}>&nbsp;</span>
                    <span data-label="t" style={{'--i': 17} as React.CSSProperties}>t</span>
                    <span data-label="h" style={{'--i': 18} as React.CSSProperties}>h</span>
                    <span data-label="o" style={{'--i': 19} as React.CSSProperties}>o</span>
                    <span data-label="u" style={{'--i': 20} as React.CSSProperties}>u</span>
                    <span data-label="g" style={{'--i': 21} as React.CSSProperties}>g</span>
                    <span data-label="h" style={{'--i': 22} as React.CSSProperties}>h</span>
                    <span data-label="t" style={{'--i': 23} as React.CSSProperties}>t</span>
                    <span data-label="s" style={{'--i': 24} as React.CSSProperties}>s</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
          {!isFormComplete && (
            <p className="text-xs mt-2 text-gray-500"></p>
          )}
        </div>
      </motion.div>
    </div>
  )
}