import { useState } from 'react'
import { Link } from 'wouter'
import { ArrowLeft, Download } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'

export default function CraftPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [message, setMessage] = useState(currentSoulHug.message || '')
  const [targetLength, setTargetLength] = useState('1m - Heartfelt')
  const [isWeaving, setIsWeaving] = useState(false)
  const [isPolishing, setIsPolishing] = useState(false)

  // Mock data - in real app this would come from gathered ingredients
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
    <div className="min-h-screen bg-gradient-to-br from-[#f5faff] via-[#e9f3ff] to-[#fdfdff] pt-8 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-content">
        <div className="glass-surface rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SoulLift
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-700 mt-2">Audio</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Ingredients */}
            <div>
              <div className="glass-surface rounded-2xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 glass-surface rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-primary">✓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary">Your Ingredients</h3>
                </div>
                
                {ingredients.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-secondary">No ingredients available</p>
                    <p className="text-xs mt-1 text-muted">Go back to Gather to collect some!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ingredient)}
                        className="glass-surface glass-hover rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow"
                      >
                        <p className="text-sm leading-relaxed text-primary">
                          {ingredient.includes(':') ? (
                            <>
                              <span className="font-medium block mb-1 text-primary">
                                {ingredient.split(':')[0]}
                              </span>
                              <span className="text-secondary">
                                {ingredient.split(':').slice(1).join(':').trim()}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-primary">{ingredient}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descriptors */}
              {descriptors.length > 0 && (
                <div className="glass-surface rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-primary">Selected Descriptors</h4>
                    <button
                      onClick={moveAllDescriptors}
                      className="text-xs glass-surface glass-hover px-3 py-1 rounded-full transition-colors text-primary"
                    >
                      Move All to Message
                    </button>
                  </div>
                  <div 
                    draggable={descriptors.length > 0}
                    onDragStart={handleDescriptorDragStart}
                    className={`glass-surface rounded-lg p-3 shadow-sm ${
                      descriptors.length > 0 ? 'cursor-grab active:cursor-grabbing glass-hover' : ''
                    } transition-shadow`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {descriptors.map((descriptor, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 glass-surface rounded-full text-sm font-medium text-primary"
                        >
                          {descriptor}
                        </span>
                      ))}
                    </div>
                  </div>
                  {descriptors.length > 0 && (
                    <p className="text-xs mt-2 text-muted">
                      💡 Drag this box to your message or click "Move All"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Message */}
            <div>
              <div className="glass-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 glass-surface rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-primary">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-primary">Your Soul Hug Message</h3>
                  </div>
                  <div className="text-sm text-secondary">
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
                  placeholder="Begin crafting your Soul Hug here... Click on ingredients from the left panel to add them, or start typing your heart's message."
                  className="w-full h-80 p-4 border-2 border-dashed border-white/30 bg-white/10 backdrop-blur-md rounded-xl focus:outline-none focus:border-white/50 focus:bg-white/20 resize-none leading-relaxed text-primary placeholder-white/60"
                  style={{ color: '#4D1A77', fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Target Length */}
              <div className="flex items-center space-x-4">
                <label htmlFor="target-length" className="text-sm font-medium text-primary">Target Length</label>
                <select
                  id="target-length"
                  name="targetLength"
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value)}
                  className="px-3 py-2 border border-white/30 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  style={{ color: '#4D1A77' }}
                >
                  <option value="30s - Brief">30s - Brief</option>
                  <option value="1m - Heartfelt">1m - Heartfelt</option>
                  <option value="2m - Deep">2m - Deep</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={aiWeave}
                  disabled={isWeaving || ingredients.length === 0}
                  className="glass-surface glass-hover px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50 disabled:cursor-not-allowed text-primary"
                >
                  {isWeaving ? 'AI Weaving...' : 'AI Weave (1 Credit)'}
                </button>
                
                <button
                  onClick={aiPolish}
                  disabled={isPolishing || !message.trim()}
                  className="glass-surface glass-hover px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50 disabled:cursor-not-allowed text-primary"
                >
                  {isPolishing ? 'AI Polishing...' : 'AI Polish (1 Credit)'}
                </button>

                <button
                  onClick={exportHug}
                  disabled={!message.trim()}
                  className="glass-surface glass-hover px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50 disabled:cursor-not-allowed text-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Hug
                </button>
              </div>
            </div>

            {/* Pro tip */}
            <p className="text-xs mt-4" style={{ color: '#8A37EA', opacity: 0.7 }}>
              Pro tip: Click on ingredients from the left panel to add them to your message. Use AI Weave to create from ingredients, or AI Polish to refine existing text.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
            <Link href="/gather">
              <button className="flex items-center px-6 py-3 glass-surface glass-hover rounded-xl transition-all duration-200 text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gather
              </button>
            </Link>
            
            <Link href="/audio-hug">
              <button
                disabled={!message.trim()}
                className="glass-surface glass-hover px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50 disabled:cursor-not-allowed text-primary"
              >
                Continue to Audio
              </button>
            </Link>
          </div>

          <ProgressIndicator className="mt-8" />
        </div>
      </div>
    </div>
  )
}