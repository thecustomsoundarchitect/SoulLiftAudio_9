import { useState, useRef, useEffect } from 'react'
import { Link } from 'wouter'
import { Mic, Square, Play, Pause, Trash2, Download, Share2, ArrowLeft, Music, Image, Volume2, Wand2, RotateCcw } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'
import { AudioRecorder } from '../components/AudioRecorder'
import { AIVoiceSelector } from '../components/AIVoiceSelector'
import { BackgroundMusicSelector } from '../components/BackgroundMusicSelector'
import { CoverImageSelector } from '../components/CoverImageSelector'
import { DeliveryOptions } from '../components/DeliveryOptions'
import ProgressIndicator from '../components/ProgressIndicator'

export default function AudioHugPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  // Audio State
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string | null>(null)
  
  // Music and Image State
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [musicVolume, setMusicVolume] = useState(30)
  const [voiceVolume, setVoiceVolume] = useState(80)
  const [coverImage, setCoverImage] = useState<string | null>(null)

  // Audio Processing State
  const [isMixing, setIsMixing] = useState(false)
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (generatedVoiceUrl) {
        URL.revokeObjectURL(generatedVoiceUrl)
      }
      if (mixedAudioUrl) {
        URL.revokeObjectURL(mixedAudioUrl)
      }
      if (coverImage && coverImage.startsWith('blob:')) {
        URL.revokeObjectURL(coverImage)
      }
    }
  }, [audioUrl, generatedVoiceUrl, mixedAudioUrl, coverImage])

  // Generate message from current Soul Hug data
  const soulHugMessage = `Dear ${currentSoulHug.recipient || 'Beautiful Soul'},

I wanted to take a moment to remind you of something important - you are absolutely incredible, and here's why:

${currentSoulHug.ingredients?.map(ingredient => `• ${ingredient}`).join('\n') || '• Your amazing spirit shines through everything you do'}

${currentSoulHug.descriptors?.length ? `You are: ${currentSoulHug.descriptors.join(', ')}` : ''}

Never forget how much you mean to the people around you. Your presence makes the world a brighter place.

With gratitude and love`

  // Audio Recording Handlers
  const handleRecordingComplete = (blob: Blob | null, url: string | null) => {
    setAudioBlob(blob)
    setAudioUrl(url)
    if (url) {
      setGeneratedVoiceUrl(null) // Clear AI voice when recording
      updateCurrentSoulHug({ audioUrl: url })
    }
  }

  // AI Voice Handlers
  const handleVoiceGenerated = (url: string) => {
    setGeneratedVoiceUrl(url)
    setAudioUrl(null) // Clear recording when AI voice is generated
    setAudioBlob(null)
    updateCurrentSoulHug({ audioUrl: url })
  }

  // Audio Mixing Functions
  const mixAudio = async () => {
    const primaryAudio = audioUrl || generatedVoiceUrl
    if (!primaryAudio || !selectedMusic) return

    setIsMixing(true)
    
    try {
      // Mock audio mixing - in production, this would use Web Audio API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock mixed audio URL
      const mockMixedUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`
      setMixedAudioUrl(mockMixedUrl)
      
    } catch (error) {
      console.error('Error mixing audio:', error)
    } finally {
      setIsMixing(false)
    }
  }

  // Music Functions
  const handleMusicSelected = (musicUrl: string | null, volume: number) => {
    setSelectedMusic(musicUrl)
    setMusicVolume(volume)
    updateCurrentSoulHug({ backgroundMusic: musicUrl, musicVolume: volume })
  }

  const handleVolumeChange = (type: 'voice' | 'music', newVolume: number) => {
    if (type === 'voice') {
      setVoiceVolume(newVolume)
    } else {
      setMusicVolume(newVolume)
      updateCurrentSoulHug({ musicVolume: newVolume })
    }
  }

  // Image Functions
  const handleImageSelected = (imageUrl: string | null) => {
    if (coverImage && coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(coverImage)
    }
    setCoverImage(imageUrl)
    updateCurrentSoulHug({ coverImage: imageUrl })
  }

  // Delivery Functions
  const handleDownload = () => {
    const finalAudioUrl = mixedAudioUrl || audioUrl || generatedVoiceUrl
    if (finalAudioUrl) {
      const link = document.createElement('a')
      link.href = finalAudioUrl
      link.download = `soul-hug-${Date.now()}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/hug/${Date.now()}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const hasAudio = audioUrl || generatedVoiceUrl
  const canMix = hasAudio && selectedMusic

  // Create Soul Hug object for delivery options
  const soulHugForDelivery = {
    id: Date.now().toString(),
    title: currentSoulHug.recipient ? `Soul Hug for ${currentSoulHug.recipient}` : 'Soul Hug',
    audioUrl: mixedAudioUrl || audioUrl || generatedVoiceUrl,
    coverImage,
    message: soulHugMessage,
    recipient: currentSoulHug.recipient
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] pt-4 md:pt-8 pb-20 md:pb-16">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create Your Audio
              </span>
            </h1>
          </div>

          {/* Message Preview */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-xl border border-white/30">
            <h3 className="text-base md:text-lg font-semibold mb-3 text-[#4D5563]">Your Message Preview</h3>
            <div className="bg-white/60 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-4 leading-relaxed whitespace-pre-line text-xs md:text-sm max-h-32 md:max-h-48 overflow-y-auto text-[#4D5563] border border-white/30 shadow-lg">
              {soulHugMessage}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Left Column - Audio Creation */}
            <div className="space-y-4 md:space-y-6">
              {/* Voice Recording */}
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete}
              />

              {/* AI Voice Generation */}
              <AIVoiceSelector 
                message={soulHugMessage}
                onVoiceGenerated={handleVoiceGenerated}
              />

              {/* Background Music */}
              <BackgroundMusicSelector 
                onMusicSelected={handleMusicSelected}
              />
            </div>

            {/* Right Column - Mixer, Cover Image, and Delivery */}
            <div className="space-y-4 md:space-y-6">
              {/* Audio Mixer - Always Visible */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-white/30">
                <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center text-[#4D5563]">
                  Audio Mixer
                </h3>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#4D5563]">
                      Voice Volume: {voiceVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={voiceVolume}
                      onChange={(e) => handleVolumeChange('voice', Number(e.target.value))}
                      className="w-full h-2 bg-white/60 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider shadow-lg"
                      disabled={!hasAudio}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#4D5563]">
                      Music Volume: {musicVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                      className="w-full h-2 bg-white/60 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider shadow-lg"
                      disabled={!selectedMusic}
                    />
                  </div>
                </div>

                <button
                  onClick={mixAudio}
                  disabled={isMixing || !canMix}
                  className="w-full bg-white/60 hover:bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#4D5563] shadow-xl border border-white/30"
                >
                  <Music className="w-4 h-4 mr-2" />
                  {isMixing ? 'Mixing Audio...' : 'Mix Audio'}
                </button>

                {!canMix && (
                  <p className="text-xs md:text-sm mt-2 text-center text-[#4D5563]/60">
                    Add both voice and music to enable mixing
                  </p>
                )}

                {mixedAudioUrl && (
                  <div className="mt-4 p-3 bg-green-100/80 backdrop-blur-sm border border-green-300 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 text-xs md:text-sm font-medium">Audio mixed successfully!</span>
                    </div>
                    <audio controls src={mixedAudioUrl} className="w-full h-6 md:h-8" />
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <CoverImageSelector 
                onImageSelected={handleImageSelected}
              />

              {/* Delivery Options */}
              {hasAudio && (
                <DeliveryOptions 
                  soulHug={soulHugForDelivery}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/30 space-y-4 sm:space-y-0">
            <div className="flex justify-center space-x-2 md:space-x-3 w-full">
              <button
                onClick={handleDownload}
                disabled={!hasAudio}
                className="bg-white/60 hover:bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#4D5563] shadow-xl border border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Save</span>
              </button>
              
              <button
                onClick={handleShare}
                disabled={!hasAudio}
                className="bg-white/60 hover:bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#4D5563] shadow-xl border border-white/30"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          <ProgressIndicator className="mt-8" />
        </div>
      </div>
    </div>
  )
}