import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowRight, ArrowLeft, Heart, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'

export default function DefinePage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [formData, setFormData] = useState({
    recipient: currentSoulHug.recipient || '',
    coreFeeling: currentSoulHug.coreFeeling || '',
    occasion: currentSoulHug.occasion || '',
    tone: currentSoulHug.tone || ''
  })

  const [completedFields, setCompletedFields] = useState<string[]>([])

  const occasions = [
    'Birthday', 'Anniversary', 'Graduation', 'New Job', 'Difficult Time',
    'Just Because', 'Thank You', 'Apology', 'Encouragement', 'Celebration'
  ]

  const tones = [
    'Warm & Loving', 'Playful & Fun', 'Deep & Meaningful', 'Gentle & Comforting',
    'Inspiring & Uplifting', 'Heartfelt & Sincere', 'Light & Cheerful',
    'Professional & Respectful', 'Serious & Thoughtful', 'Grateful & Appreciative'
  ]

  const canProceed = formData.coreFeeling.trim().length > 0 && formData.tone.length > 0

  // Calculate completed fields
  useEffect(() => {
    const completed = []
    if (formData.recipient.trim()) completed.push('recipient')
    if (formData.coreFeeling.trim()) completed.push('coreFeeling')
    if (formData.occasion) completed.push('occasion')
    if (formData.tone) completed.push('tone')
    
    setCompletedFields(completed)
  }, [formData])

  const handleContinue = () => {
    updateCurrentSoulHug({
      recipient: formData.recipient,
      coreFeeling: formData.coreFeeling,
      occasion: formData.occasion,
      tone: formData.tone
    })
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] pb-20">

      {/* Floating back button */}
      <div className="fixed top-6 left-6 z-10">
        <Link href="/">
          <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group hover:bg-white">
            <ArrowLeft className="w-5 h-5 text-[#4D5563] group-hover:text-purple-600 transition-colors" />
          </button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Define Your Message
            </span>
          </h1>
          
          <p className="text-lg text-[#4D5563]">
            Tell us about the message you want to create
          </p>
          
          {/* Progress Indicator at top */}
          <ProgressIndicator className="mt-8" />
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="space-y-6">
            {/* Recipient Field */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-[#4D5563]">
                <Heart className="w-5 h-5 mr-2" />
                <span>Who is this for?</span>
                <span className="font-normal text-base ml-2 text-[#4D5563]/60">(Optional)</span>
                {completedFields.includes('recipient') && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                )}
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                placeholder="Enter their name or leave blank..."
                className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 placeholder-[#4D5563]/40 text-[#4D5563] shadow-lg ${
                  completedFields.includes('recipient')
                    ? 'border-green-400 bg-green-50/50'
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                }`}
              />
            </div>

            {/* Core Feeling Field */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-[#4D5563]">
                <Heart className="w-5 h-5 mr-2" />
                <span>How do you want them to feel?</span>
                <span className="text-red-500 ml-1">*</span>
                {completedFields.includes('coreFeeling') && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                )}
              </label>
              <input
                type="text"
                value={formData.coreFeeling}
                onChange={(e) => setFormData({...formData, coreFeeling: e.target.value})}
                placeholder="e.g., deeply appreciated, truly valued, completely loved..."
                className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 placeholder-[#4D5563]/40 text-[#4D5563] shadow-lg ${
                  completedFields.includes('coreFeeling')
                    ? 'border-green-400 bg-green-50/50'
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                }`}
                required
              />
            </div>

            {/* Two Column Layout for Occasion and Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Occasion Field */}
              <div className="space-y-3">
                <label className="flex items-center text-lg font-semibold text-[#4D5563]">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Occasion</span>
                  {completedFields.includes('occasion') && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  )}
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                  className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 appearance-none cursor-pointer text-[#4D5563] shadow-lg ${
                    completedFields.includes('occasion')
                      ? 'border-green-400 bg-green-50/50'
                      : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                  }`}
                >
                  <option value="" className="bg-white text-[#4D5563]">Select occasion...</option>
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion} className="bg-white text-[#4D5563]">{occasion}</option>
                  ))}
                </select>
              </div>

              {/* Tone Field */}
              <div className="space-y-3">
                <label className="flex items-center text-lg font-semibold text-[#4D5563]">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Tone</span>
                  <span className="text-red-500 ml-1">*</span>
                  {completedFields.includes('tone') && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  )}
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 appearance-none cursor-pointer text-[#4D5563] shadow-lg ${
                    completedFields.includes('tone')
                      ? 'border-green-400 bg-green-50/50'
                      : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                  }`}
                  required
                >
                  <option value="" className="bg-white text-[#4D5563]">Select tone...</option>
                  {tones.map(tone => (
                    <option key={tone} value={tone} className="bg-white text-[#4D5563]">{tone}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8 text-center">
            <AnimatePresence>
              {!canProceed && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-600 mb-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl px-4 py-3 shadow-lg"
                >
                  Please fill in the required fields: feeling and tone
                </motion.p>
              )}
            </AnimatePresence>
            
            <Link href="/gather">
              <motion.button 
                onClick={handleContinue}
                disabled={!canProceed}
                whileHover={canProceed ? { scale: 1.05 } : {}}
                whileTap={canProceed ? { scale: 0.95 } : {}}
                className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl ${
                  canProceed
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-2xl'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                <span>Continue to Gather</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}