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
  
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string | null>(null)
  
  const [voiceOption, setVoiceOption] = useState<'record' | 'ai'>('record')
  
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [musicVolume, setMusicVolume] = useState(30)
  const [voiceVolume, setVoiceVolume] = useState(80)
  const [coverImage, setCoverImage] = useState<string | null>(null)

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

  const soulHugMessage = `Dear ${currentSoulHug.recipient || 'Beautiful Soul'},

I wanted to take a moment to remind you of something important - you are absolutely incredible, and here's why:

${currentSoulHug.ingredients?.map(ingredient => `- ${ingredient}`).join('\n') || '- Your amazing spirit shines through everything you do'}

${currentSoulHug.descriptors?.length ? `You are: ${currentSoulHug.descriptors.join(', ')}` : ''}

Never forget how much you mean to the people around you. Your presence makes the world a brighter place.

With gratitude and love`

  const handleRecordingComplete = (blob: Blob | null, url: string | null) => {
    setAudioBlob(blob)
    setAudioUrl(url)
    if (url) {
      setGeneratedVoiceUrl(null)
      updateCurrentSoulHug({ audioUrl: url })
    }
  }

  const handleVoiceGenerated = (url: string) => {
    setGeneratedVoiceUrl(url)
    setAudioUrl(null)
    setAudioBlob(null)
    updateCurrentSoulHug({ audioUrl: url })
  }

  const mixAudio = async () => {
    const primaryAudio = audioUrl || generatedVoiceUrl
    if (!primaryAudio || !selectedMusic) return

    setIsMixing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockMixedUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`
      setMixedAudioUrl(mockMixedUrl)
      
    } catch (error) {
      console.error('Error mixing audio:', error)
    } finally {
      setIsMixing(false)
    }
  }

  const handleMusicSelected = (musicUrl: string | null, volume: number) => {
    setSelectedMusic(musicUrl)
    setMusicVolume(volume)
    updateCurrentSoulHug({ backgroundMusic: musicUrl || undefined, musicVolume: volume })
  }

  const handleVolumeChange = (type: 'voice' | 'music', newVolume: number) => {
    if (type === 'voice') {
      setVoiceVolume(newVolume)
    } else {
      setMusicVolume(newVolume)
      updateCurrentSoulHug({ musicVolume: newVolume })
    }
  }

  const handleImageSelected = (imageUrl: string | null) => {
    if (coverImage && coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(coverImage)
    }
    setCoverImage(imageUrl)
    updateCurrentSoulHug({ coverImage: imageUrl })
  }

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

  const soulHugForDelivery = {
    id: Date.now().toString(),
    title: currentSoulHug.recipient ? `Soul Hug for ${currentSoulHug.recipient}` : 'Soul Hug',
    audioUrl: (mixedAudioUrl || audioUrl || generatedVoiceUrl) || undefined,
    coverImage: coverImage || undefined,
    message: soulHugMessage,
    recipient: currentSoulHug.recipient
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#F3F7FF] font-['Poppins']">
      <div className="max-w-4xl mx-auto px-4 py-6 w-full">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create Your Audio
              </span>
            </h1>

          </div>

          {/* Message Preview Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              MESSAGE PREVIEW
            </h2>
            
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-3 border-2 border-dashed border-white/40 mb-6 w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#4D5563]">Your Message</h3>
                <div className="text-sm text-[#4D5563]/80">
                  {soulHugMessage.split(' ').length} words
                </div>
              </div>
              <div className="w-full h-64 p-3 bg-transparent resize-none leading-relaxed text-[#4D5563] placeholder-[#4D5563]/40">
                {soulHugMessage}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-[#4D5563]/70">
                <span>Estimated reading time: {Math.ceil(soulHugMessage.split(' ').length / 200)} min</span>
                <span>Character count: {soulHugMessage.length}</span>
              </div>
            </div>
          </div>

          {/* Voice Options Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              VOICE OPTIONS
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-full p-1 shadow-md border">
                  <div className="flex">
                    <button
                      onClick={() => setVoiceOption('record')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        voiceOption === 'record'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-[#4D5563] hover:bg-gray-100'
                      }`}
                    >
                      Record Voice
                    </button>
                    <button
                      onClick={() => setVoiceOption('ai')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        voiceOption === 'ai'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-[#4D5563] hover:bg-gray-100'
                      }`}
                    >
                      AI Voice
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                {voiceOption === 'record' ? (
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                ) : (
                  <AIVoiceSelector 
                    message={soulHugMessage}
                    onVoiceGenerated={handleVoiceGenerated}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Background Music Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              BACKGROUND MUSIC
            </h2>
            
            <div className="bg-white rounded-xl shadow-md p-4">
              <BackgroundMusicSelector onMusicSelected={handleMusicSelected} />
            </div>
          </div>

          {/* Audio Mixer Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              AUDIO MIXER
            </h2>
            
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="space-y-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4D5563]">
                    Voice Volume: {voiceVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceVolume}
                    onChange={(e) => handleVolumeChange('voice', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={!hasAudio}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4D5563]">
                    Music Volume: {musicVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={!selectedMusic}
                  />
                </div>
              </div>

              <button
                onClick={mixAudio}
                disabled={isMixing || !canMix}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <Music className="w-4 h-4 mr-2" />
                {isMixing ? 'Mixing Audio...' : 'Mix Audio'}
              </button>

              {!canMix && (
                <p className="text-xs mt-2 text-center text-[#4D5563]/60">
                  Add both voice and music to enable mixing
                </p>
              )}

              {mixedAudioUrl && (
                <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-green-700 text-xs font-medium">Audio mixed successfully!</span>
                  </div>
                  <audio controls src={mixedAudioUrl} className="w-full h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Cover Image Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              COVER IMAGE
            </h2>
            
            <div className="bg-white rounded-xl shadow-md p-2 max-w-xs mx-auto">
              <CoverImageSelector onImageSelected={handleImageSelected} className="!grid-cols-3 !gap-2" />
            </div>
          </div>

          {/* Delivery Options Section */}
          {hasAudio && (
            <div>
              <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
                DELIVERY OPTIONS
              </h2>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <DeliveryOptions soulHug={soulHugForDelivery} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleDownload}
                disabled={!hasAudio}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              
              <button
                onClick={handleShare}
                disabled={!hasAudio}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}