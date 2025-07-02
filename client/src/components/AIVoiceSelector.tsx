import React, { useState } from 'react'
import { Volume2, Play, Wand2 } from 'lucide-react'

interface AIVoiceSelectorProps {
  message: string
  onVoiceGenerated: (audioUrl: string) => void
  className?: string
}

const voiceOptions = [
  { 
    value: 'female-warm', 
    label: 'Female - Warm & Caring', 
    description: 'Gentle, nurturing tone perfect for comfort',
    preview: '/audio/preview-female-warm.mp3' 
  },
  { 
    value: 'male-gentle', 
    label: 'Male - Gentle & Sincere', 
    description: 'Deep, reassuring voice for meaningful messages',
    preview: '/audio/preview-male-gentle.mp3' 
  },
  { 
    value: 'neutral-calm', 
    label: 'Neutral - Calm & Soothing', 
    description: 'Peaceful, meditative quality for relaxation',
    preview: '/audio/preview-neutral-calm.mp3' 
  },
]

export const AIVoiceSelector: React.FC<AIVoiceSelectorProps> = ({ 
  message, 
  onVoiceGenerated, 
  className = '' 
}) => {
  const [selectedVoice, setSelectedVoice] = useState('female-warm')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)

  const generateVoice = async () => {
    if (!message.trim()) return
    
    setIsGenerating(true)
    
    try {
      // Mock AI voice generation - replace with actual OpenAI TTS API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated audio URL
      const mockAudioUrl = `/audio/generated-${selectedVoice}-${Date.now()}.mp3`
      setGeneratedAudio(mockAudioUrl)
      onVoiceGenerated(mockAudioUrl)
      
    } catch (error) {
      console.error('Error generating voice:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const playPreview = (previewUrl: string) => {
    const audio = new Audio(previewUrl)
    audio.play().catch(err => console.log('Preview not available:', err))
  }

  return (
    <div className={`${className}`}>
      <p className="text-sm text-[#4D5563]/80 mb-4">
        Don't want to record? Let AI read your message with a warm, natural voice.
      </p>
      
      <div className="space-y-3 mb-6">
        {voiceOptions.map((voice) => (
          <div
            key={voice.value}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-lg ${
              selectedVoice === voice.value
                ? 'border-purple-500 bg-purple-50/80 backdrop-blur-md'
                : 'border-white/40 hover:border-purple-300 bg-white/60 backdrop-blur-md hover:bg-white/80'
            }`}
            onClick={() => setSelectedVoice(voice.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-[#4D5563]">{voice.label}</h4>
                <p className="text-sm text-[#4D5563]/80 mt-1">{voice.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  playPreview(voice.preview)
                }}
                className="ml-3 p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors shadow-md"
                title="Preview voice"
              >
                <Play className="w-4 h-4 text-[#4D5563]" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {generatedAudio && (
        <div className="mb-4 p-3 bg-green-100/80 backdrop-blur-sm border border-green-300 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-green-700 text-sm font-medium">Voice generated successfully!</span>
            <audio controls className="h-8">
              <source src={generatedAudio} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}
      
      <button
        onClick={generateVoice}
        disabled={isGenerating || !message.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating Voice...' : 'Generate AI Voice'}
      </button>
      
      {!message.trim() && (
        <p className="text-xs text-[#4D5563]/60 mt-2 text-center">
          Complete your message in the Craft step to generate AI voice
        </p>
      )}
    </div>
  )
}