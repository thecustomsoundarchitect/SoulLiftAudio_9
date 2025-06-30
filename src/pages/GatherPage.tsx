import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowRight, ArrowLeft, X, Plus, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'

export default function GatherPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  
  const [ingredients, setIngredients] = useState<string[]>(currentSoulHug.ingredients || [])
  const [descriptors, setDescriptors] = useState<string[]>(currentSoulHug.descriptors || [])
  const [writingModal, setWritingModal] = useState({ isOpen: false, prompt: '', story: '' })

  const promptCards = [
    { 
      title: "When they showed unwavering kindness", 
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "How their smile lights up rooms", 
      image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "Their gift of making everyone feel welcome", 
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "The natural way they comfort others", 
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "What you see blossoming in them", 
      image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "That time they stood up bravely", 
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "The small ways they show care", 
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "Why they deserve all the love", 
      image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    { 
      title: "The real them that shines through", 
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ]

  const descriptorOptions = [
    'Smart', 'Caring', 'Loyal', 'Funny', 'Patient', 'Brave',
    'Creative', 'Thoughtful', 'Strong', 'Loving', 'Honest', 'Supportive'
  ]

  const openWritingModal = (prompt: string) => {
    setWritingModal({ isOpen: true, prompt, story: '' })
  }

  const closeWritingModal = () => {
    setWritingModal({ isOpen: false, prompt: '', story: '' })
  }

  const saveStory = () => {
    if (writingModal.story.trim()) {
      const storyIngredient = `${writingModal.prompt}: ${writingModal.story.trim()}`
      const newIngredients = [...ingredients, storyIngredient]
      setIngredients(newIngredients)
      updateCurrentSoulHug({ ingredients: newIngredients })
    }
    closeWritingModal()
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(item => item !== ingredient)
    setIngredients(newIngredients)
    updateCurrentSoulHug({ ingredients: newIngredients })
  }

  const toggleDescriptor = (descriptor: string) => {
    let newDescriptors: string[]
    if (descriptors.includes(descriptor)) {
      newDescriptors = descriptors.filter(item => item !== descriptor)
    } else {
      newDescriptors = [...descriptors, descriptor]
    }
    setDescriptors(newDescriptors)
    updateCurrentSoulHug({ descriptors: newDescriptors })
  }

  const canProceed = ingredients.length > 0 || descriptors.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5faff] via-[#e9f3ff] to-[#fdfdff] pb-20">
      <div className="max-w-6xl mx-auto px-6 py-8 page-content">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SoulLift
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-700 mt-2">Audio</span>
          </h1>
          
          <p className="text-lg text-secondary">
            Click prompts to write stories, select descriptors that fit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Story Prompts */}
          <div>
            <div className="glass-surface rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-6 pl-4 text-primary">Story Prompts</h3>
              
              <ul className="space-y-4 pl-4">
                {promptCards.map((prompt, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <button
                      onClick={() => openWritingModal(prompt.title)}
                      className="flex items-center gap-4 w-full text-left glass-hover rounded-xl p-3 transition-all duration-200"
                    >
                      <img
                        src={prompt.image}
                        alt={prompt.title}
                        className="w-12 h-12 rounded-full object-cover shadow-md"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[280px] text-primary">
                          {prompt.title}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Descriptors */}
            <div className="mt-6 glass-surface rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-primary">Choose Descriptors</h3>
              <div className="grid grid-cols-3 gap-3">
                {descriptorOptions.map((descriptor) => (
                  <button
                    key={descriptor}
                    onClick={() => toggleDescriptor(descriptor)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      descriptors.includes(descriptor)
                        ? 'bg-button-primary text-inverted shadow-lg'
                        : 'glass-surface glass-hover text-primary'
                    }`}
                  >
                    {descriptor}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Your Stories */}
          <div>
            <div className="glass-surface rounded-3xl shadow-xl p-6 min-h-[600px]">
              <h3 className="text-xl font-semibold mb-6 text-primary">
                Your Stories ({ingredients.length})
              </h3>
              
              {ingredients.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <div className="w-16 h-16 glass-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-muted" />
                  </div>
                  <p className="text-lg font-medium mb-2">Your stories will appear here</p>
                  <p className="text-sm">Click prompts on the left to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="glass-surface glass-hover rounded-xl p-4 group transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          {ingredient.includes(':') ? (
                            <>
                              <div className="font-semibold mb-2 text-sm text-primary">
                                {ingredient.split(':')[0]}:
                              </div>
                              <div className="text-sm leading-relaxed text-secondary">
                                {ingredient.split(':').slice(1).join(':').trim()}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold text-sm text-primary">{ingredient}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="p-2 glass-hover rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Descriptors */}
              {descriptors.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h4 className="text-sm font-medium mb-3 text-secondary">Selected Descriptors</h4>
                  <div className="flex flex-wrap gap-2">
                    {descriptors.map((descriptor) => (
                      <span
                        key={descriptor}
                        className="px-3 py-1 glass-surface rounded-full text-sm text-primary"
                      >
                        {descriptor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/define">
            <button className="flex items-center px-6 py-3 glass-surface glass-hover rounded-xl transition-all duration-200 text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Define
            </button>
          </Link>
          
          <Link href="/craft">
            <button
              disabled={!canProceed}
              className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                canProceed
                  ? 'glass-surface glass-hover shadow-lg text-primary'
                  : 'glass-surface cursor-not-allowed text-muted'
              }`}
            >
              Continue to Craft
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>

        <ProgressIndicator className="mt-8" />

        {/* Writing Modal */}
        <AnimatePresence>
          {writingModal.isOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-white pr-4">
                      {writingModal.prompt}
                    </h3>
                    <button
                      onClick={closeWritingModal}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <textarea
                    value={writingModal.story}
                    onChange={(e) => setWritingModal(prev => ({ ...prev, story: e.target.value }))}
                    placeholder="Share your story here..."
                    className="w-full h-48 p-4 bg-white/10 backdrop-blur-md text-white placeholder-white/60 border border-white/20 rounded-xl resize-none focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none"
                    autoFocus
                  />
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={closeWritingModal}
                      className="px-6 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveStory}
                      disabled={!writingModal.story.trim()}
                      className="px-6 py-2 bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-white/40 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      Save Story
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}