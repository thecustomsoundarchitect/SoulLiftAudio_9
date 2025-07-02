import { useState } from 'react'
import { Link } from 'wouter'
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

export default function DefinePage() {
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
  }

  const handleDropdownSelect = (field: string, value: string) => {
    setFormData({...formData, [field]: value})
    setDropdownOpen(null)
  }

  const isFormComplete = formData.coreFeeling && formData.tone

  return (
    <div 
      className="min-h-screen pb-20 font-['Poppins']"
      style={{
        backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Define Your Message
              </span>
            </h1>
            <p className="text-lg text-[#4D5563] mb-4">
              "We'll help you find the perfect words to share."
            </p>
          </div>

          {/* Essential Section */}
          <div>
            <h2 className="text-pink-500 font-semibold text-sm uppercase tracking-wide mb-4">
              ESSENTIAL
            </h2>
            
            <div className="space-y-4">
              {/* How Do You Want Them to Feel */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'feeling' ? null : 'feeling')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className={formData.coreFeeling ? 'text-gray-900' : 'text-gray-500'}>
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
                        className="w-full p-3 text-left hover:bg-gray-50 text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
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
                  <span className={formData.tone ? 'text-gray-900' : 'text-gray-500'}>
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
                        className="w-full p-3 text-left hover:bg-gray-50 text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
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
            <h2 className="text-pink-500 font-semibold text-sm uppercase tracking-wide mb-4">
              JUST FOR EXTRA HEART
            </h2>
            
            <div className="space-y-4">
              {/* Occasion */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'occasion' ? null : 'occasion')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-left flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                >
                  <span className={formData.occasion ? 'text-gray-900' : 'text-gray-500'}>
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
                        className="w-full p-3 text-left hover:bg-gray-50 text-gray-700 first:rounded-t-2xl last:rounded-b-2xl"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-colors"
              />

              {/* Age Sliders */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Their Age</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.theirAge}
                      onChange={(e) => setFormData({...formData, theirAge: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full pointer-events-none"
                      style={{left: `calc(${(formData.theirAge - 1) / 99 * 100}% - 12px)`}}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Age</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.yourAge}
                      onChange={(e) => setFormData({...formData, yourAge: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full pointer-events-none"
                      style={{left: `calc(${(formData.yourAge - 1) / 99 * 100}% - 12px)`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Link href="/gather">
              <button
                onClick={handleContinue}
                disabled={!isFormComplete}
                className={`w-full py-4 rounded-full font-semibold flex items-center justify-center space-x-2 transition-all ${
                  isFormComplete
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}