import { useState } from 'react'
import { Link } from 'wouter'
import { ArrowLeft, Download } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'

const targetLengthOptions = [
  '30s - Brief',
  '1m - Heartfelt', 
  '2m - Deep',
  'Custom'
]

export default function CraftPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [message, setMessage] = useState(currentSoulHug.message || '')
  const [targetLength, setTargetLength] = useState('1m - Heartfelt')
  const [isWeaving, setIsWeaving] = useState(false)
  const [isPolishing, setIsPolishing] = useState(false)

  const ingredients = currentSoulHug.ingredients || []
  const descriptors = currentSoulHug.descriptors || []

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage)
    updateCurrentSoulHug({ message: newMessage })
  }

  const handleDragStart = (e: React.DragEvent, ingredient: string) => {
    e.dataTransfer.setData('text/plain', ingredient)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedText = e.dataTransfer.getData('text/plain')
    const textArea = e.target as HTMLTextAreaElement
    const cursorPosition = textArea.selectionStart
    const newMessage = message.slice(0, cursorPosition) + '\n\n' + draggedText + '\n\n' + message.slice(cursorPosition)
    handleMessageChange(newMessage)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const moveAllDescriptors = () => {
    if (descriptors.length === 0) return
    
    const descriptorText = `\n\n${descriptors.join(', ')}\n\n`
    const newMessage = message + descriptorText
    handleMessageChange(newMessage)
  }

  const handleDescriptorDragStart = (e: React.DragEvent) => {
    const descriptorText = `${descriptors.join(', ')}`
    e.dataTransfer.setData('text/plain', descriptorText)
  }

  const aiWeave = () => {
    setIsWeaving(true)
    setTimeout(() => {
      const weavedMessage = `Dear ${currentSoulHug.recipient || 'friend'},

Your caring nature and thoughtful approach to everything you do truly sets you apart. When times get tough, you're always there with a warm smile and helping hand - that unwavering kindness you show makes such a difference in people's lives.

What I admire most is your gift of making everyone feel welcome. You create such an inclusive environment wherever you go, and it's beautiful to witness. The natural way you comfort others, knowing exactly what to say when someone needs support, shows just how wise and loving you are.

Your supportive spirit touches everyone around you. Thank you for being exactly who you are.

With gratitude and love`

      setMessage(weavedMessage)
      updateCurrentSoulHug({ message: weavedMessage })
      setIsWeaving(false)
    }, 2000)
  }

  const aiPolish = () => {
    if (!message.trim()) return
    
    setIsPolishing(true)
    setTimeout(() => {
      const polishedMessage = message
        .replace(/\n\n/g, '\n\n')
        .replace(/\. /g, '. ')
        .trim()
      setMessage(polishedMessage)
      updateCurrentSoulHug({ message: polishedMessage })
      setIsPolishing(false)
    }, 1500)
  }

  const exportHug = () => {
    const element = document.createElement('a')
    const file = new Blob([message], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `soul-hug-message.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const wordCount = message ? message.split(' ').filter(word => word.length > 0).length : 0

  return (
    <div className="min-h-screen bg-[#F3F7FF] pt-6 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Craft Your Message
            </span>
          </h1>
          
          <ProgressIndicator className="mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ingredients Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#4D5563]">Your Ingredients</h3>
            
            {ingredients.length === 0 ? (
              <div className="text-center py-6 bg-white/60 backdrop-blur-md rounded-xl border border-white/30">
                <p className="text-sm text-[#4D5563]/60">No ingredients available</p>
                <p className="text-xs mt-1 text-[#4D5563]/40">Go back to Gather to collect some!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ingredient)}
                    className="bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-lg p-3 shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 border border-white/30"
                  >
                    <p className="text-sm leading-relaxed text-[#4D5563]">
                      {ingredient.includes(':') ? (
                        <>
                          <span className="font-medium block mb-1 text-[#4D5563]">
                            {ingredient.split(':')[0]}
                          </span>
                          <span className="text-[#4D5563]/80">
                            {ingredient.split(':').slice(1).join(':').trim()}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-[#4D5563]">{ingredient}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Descriptors */}
            {descriptors.length > 0 && (
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#4D5563]">Selected Descriptors</h4>
                  <button
                    onClick={moveAllDescriptors}
                    className="text-xs bg-white/60 hover:bg-white/80 backdrop-blur-md px-2 py-1 rounded-full transition-colors text-[#4D5563] shadow-md border border-white/30"
                  >
                    Move All
                  </button>
                </div>
                <div 
                  draggable={descriptors.length > 0}
                  onDragStart={handleDescriptorDragStart}
                  className="bg-white/60 backdrop-blur-md rounded-lg p-2 shadow-lg border border-white/30 cursor-grab active:cursor-grabbing hover:bg-white/80 transition-all duration-200"
                >
                  <div className="flex flex-wrap gap-1">
                    {descriptors.map((descriptor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/60 backdrop-blur-md rounded-full text-xs font-medium text-[#4D5563] shadow-md border border-white/30"
                      >
                        {descriptor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#4D5563]">Your Soul Hug Message</h3>
              <div className="text-sm text-[#4D5563]/80">
                {wordCount} words
              </div>
            </div>

            <textarea
              id="message-input"
              name="message"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              placeholder="Begin crafting your Soul Hug here... Drag ingredients from the left or start typing your heart's message."
              className="w-full h-64 p-3 border-2 border-dashed border-white/40 bg-white/60 backdrop-blur-md rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/80 resize-none leading-relaxed text-[#4D5563] placeholder-[#4D5563]/40 shadow-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 pt-4 border-t border-white/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <label htmlFor="target-length" className="text-sm font-medium text-[#4D5563]">
                Target Length
              </label>
              <select
                id="target-length"
                name="targetLength"
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value)}
                className="px-2 py-1 border border-white/30 bg-white/60 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-[#4D5563] shadow-lg"
              >
                {targetLengthOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={aiWeave}
                disabled={isWeaving || ingredients.length === 0}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-gray-600 text-sm"
              >
                {isWeaving ? 'AI Weaving...' : 'AI Weave'}
              </button>
              
              <button
                onClick={aiPolish}
                disabled={isPolishing || !message.trim()}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-gray-600 text-sm"
              >
                {isPolishing ? 'AI Polishing...' : 'AI Polish'}
              </button>

              <button
                onClick={exportHug}
                disabled={!message.trim()}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-gray-600 text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>

          <p className="text-xs mt-3 text-[#4D5563]/60">
            Pro tip: Drag ingredients from the left to add them to your message. Use AI Weave to create from ingredients, or AI Polish to refine existing text.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/30">
          <Link href="/gather">
            <button className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 shadow-xl border border-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/audio-hug">
            <button
              disabled={!message.trim()}
              className={`flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-300 shadow-xl ${
                message.trim()
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}