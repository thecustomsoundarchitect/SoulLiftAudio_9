import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowRight, ArrowLeft, CheckCircle, User, Calendar, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'
import { PlaceholdersAndVanishInput } from '../components/ui/placeholders-and-vanish-input'

export default function DefinePage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [formData, setFormData] = useState({
    recipient: currentSoulHug.recipient || '',
    coreFeeling: currentSoulHug.coreFeeling || '',
    occasion: currentSoulHug.occasion || '',
    tone: currentSoulHug.tone || ''
  })

  const [completedFields, setCompletedFields] = useState<string[]>([])
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const occasions = [
    'Birthday', 'Anniversary', 'Graduation', 'New Job', 'Difficult Time',
    'Just Because', 'Thank You', 'Apology', 'Encouragement', 'Celebration'
  ]

  const tones = [
    'Warm & Loving', 'Playful & Fun', 'Deep & Meaningful', 'Gentle & Comforting',
    'Inspiring & Uplifting', 'Heartfelt & Sincere', 'Light & Cheerful',
    'Professional & Respectful', 'Serious & Thoughtful', 'Grateful & Appreciative'
  ]

  const feelingPlaceholders = [
    "deeply appreciated and valued",
    "completely loved and cherished",
    "truly understood and seen",
    "incredibly proud and accomplished",
    "genuinely supported and cared for",
    "absolutely amazing and special",
    "wonderfully unique and important",
    "perfectly loved just as they are"
  ]

  const canProceed = formData.coreFeeling.trim().length > 0 && formData.tone.length > 0

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

  const handleFeelingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, coreFeeling: e.target.value})
  }

  const handleFeelingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const toneSelect = document.querySelector('select[name="tone"]') as HTMLSelectElement
    if (toneSelect) {
      toneSelect.focus()
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] relative overflow-hidden pb-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <motion.div 
        className="fixed top-4 left-4 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/">
          <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 group hover:bg-white">
            <ArrowLeft className="w-5 h-5 text-[#4D5563] group-hover:text-purple-600 transition-colors" />
          </button>
        </Link>
      </motion.div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Define Your Message
            </span>
          </h1>
          
          <motion.p 
            className="text-lg text-[#4D5563] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Tell us about the heartfelt message you want to create
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ProgressIndicator className="mt-6" />
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/50 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          
          <div className="space-y-6">
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <label className="flex items-center text-lg font-bold text-[#4D5563] group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                  completedFields.includes('recipient') 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                    : focusedField === 'recipient'
                      ? 'bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg'
                      : 'bg-white/60 backdrop-blur-md border-2 border-white/40'
                }`}>
                  {completedFields.includes('recipient') ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-[#4D5563]" />
                  )}
                </div>
                <div className="flex-1">
                  <span>Who is this for?</span>
                  <span className="font-normal text-sm ml-2 text-[#4D5563]/60">(Optional)</span>
                </div>
              </label>
              
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                onFocus={() => setFocusedField('recipient')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter their name or leave blank..."
                className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 placeholder-[#4D5563]/40 text-[#4D5563] shadow-lg ${
                  completedFields.includes('recipient')
                    ? 'border-green-400 bg-green-50/50 shadow-green-200/50'
                    : focusedField === 'recipient'
                      ? 'border-purple-500 bg-purple-50/50 shadow-purple-200/50'
                      : 'border-white/40 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                }`}
              />
            </motion.div>

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <label className="flex items-center text-lg font-bold text-[#4D5563] group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                  completedFields.includes('coreFeeling') 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                    : focusedField === 'coreFeeling'
                      ? 'bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg'
                      : 'bg-white/60 backdrop-blur-md border-2 border-white/40'
                }`}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <span>How do you want them to feel?</span>
                  <span className="text-red-500 ml-2">*</span>
                </div>
              </label>
              
              <PlaceholdersAndVanishInput
                placeholders={feelingPlaceholders}
                onChange={handleFeelingChange}
                onSubmit={handleFeelingSubmit}
                value={formData.coreFeeling}
                className={`transition-all duration-300 ${
                  completedFields.includes('coreFeeling')
                    ? 'border-green-400 bg-green-50/50 shadow-green-200/50'
                    : focusedField === 'coreFeeling'
                      ? 'border-purple-500 bg-purple-50/50 shadow-purple-200/50'
                      : 'border-white/40 hover:border-purple-300 focus-within:border-purple-500'
                }`}
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <label className="flex items-center text-lg font-bold text-[#4D5563] group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    completedFields.includes('occasion') 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                      : focusedField === 'occasion'
                        ? 'bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg'
                        : 'bg-white/60 backdrop-blur-md border-2 border-white/40'
                  }`}>
                    {completedFields.includes('occasion') ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Calendar className="w-5 h-5 text-[#4D5563]" />
                    )}
                  </div>
                  <span>Occasion</span>
                </label>
                
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                  onFocus={() => setFocusedField('occasion')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 appearance-none cursor-pointer text-[#4D5563] shadow-lg ${
                    completedFields.includes('occasion')
                      ? 'border-green-400 bg-green-50/50 shadow-green-200/50'
                      : focusedField === 'occasion'
                        ? 'border-purple-500 bg-purple-50/50 shadow-purple-200/50'
                        : 'border-white/40 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                  }`}
                >
                  <option value="" className="bg-white text-[#4D5563]">Select occasion...</option>
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion} className="bg-white text-[#4D5563]">{occasion}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <label className="flex items-center text-lg font-bold text-[#4D5563] group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    completedFields.includes('tone') 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                      : focusedField === 'tone'
                        ? 'bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg'
                        : 'bg-white/60 backdrop-blur-md border-2 border-white/40'
                  }`}>
                    {completedFields.includes('tone') ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Palette className="w-5 h-5 text-[#4D5563]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span>Tone</span>
                    <span className="text-red-500 ml-2">*</span>
                  </div>
                </label>
                
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  onFocus={() => setFocusedField('tone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/70 backdrop-blur-md border-2 rounded-xl transition-all duration-300 appearance-none cursor-pointer text-[#4D5563] shadow-lg ${
                    completedFields.includes('tone')
                      ? 'border-green-400 bg-green-50/50 shadow-green-200/50'
                      : focusedField === 'tone'
                        ? 'border-purple-500 bg-purple-50/50 shadow-purple-200/50'
                        : 'border-white/40 hover:border-purple-300 focus:border-purple-500 focus:bg-white/90'
                  }`}
                  required
                >
                  <option value="" className="bg-white text-[#4D5563]">Select tone...</option>
                  {tones.map(tone => (
                    <option key={tone} value={tone} className="bg-white text-[#4D5563]">{tone}</option>
                  ))}
                </select>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xs">{completedFields.length}</span>
                </div>
                <span className="text-[#4D5563] font-medium text-sm">
                  {completedFields.length} of 4 fields completed
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step <= completedFields.length
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
                        : 'bg-white/60 border border-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}