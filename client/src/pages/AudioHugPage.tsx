import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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

  const soulHugMessage = currentSoulHug.message || 'Your message will appear here.'

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
    <motion.div
      className="flex-1 flex flex-col items-center bg-white p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-2xl">
        <div className="space-y-6">
          {/* Title and Subtitle - match Craft/GatherPage */}
          <div className="text-center">
            <img
              src="https://i.imgur.com/eVihwRi.png"
              alt="Create Your Audio Hug"
              className="w-full h-auto mb-6"
            />
          </div>

          {/* Message Preview Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              MESSAGE PREVIEW
            </h2>
            
            <div className="card-editor">
              <div className="card-editor-overlay"></div>
              <div className="card-editor-inner">
                <div 
                  className="editor-content w-full p-5 text-base rounded-2xl shadow-none min-h-[405px]"
                  style={{ minHeight: '405px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: soulHugMessage }}
                />
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
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center"
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              
              <button
                onClick={handleShare}
                disabled={!hasAudio}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center shadow-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>


          </div>
        </div>
      </div>
    </motion.div>
  )
}