import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowRight, ArrowLeft, X, Plus } from 'lucide-react'
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
    <div className="min-h-screen bg-[#F3F7FF] pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gather Your Stories
            </span>
          </h1>
          
          <p className="text-lg text-[#4D5563] mb-4">
            Click prompts to write stories, select descriptors that fit
          </p>
          
          <ProgressIndicator className="mb-6" />
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/50">
            <h3 className="text-lg font-semibold mb-4 text-[#4D5563]">Story Prompts</h3>
            
            <div className="space-y-3">
              {promptCards.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => openWritingModal(prompt.title)}
                  className="flex items-center gap-3 w-full text-left bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-xl p-3 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
                >
                  <img
                    src={prompt.image}
                    alt={prompt.title}
                    className="w-10 h-10 rounded-full object-cover shadow-md"
                  />
                  <span className="text-sm font-medium text-[#4D5563] flex-1">
                    {prompt.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/50">
            <h3 className="text-lg font-semibold mb-4 text-[#4D5563]">Choose Descriptors</h3>
            <div className="grid grid-cols-3 gap-2">
              {descriptorOptions.map((descriptor) => (
                <button
                  key={descriptor}
                  onClick={() => toggleDescriptor(descriptor)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg ${
                    descriptors.includes(descriptor)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl'
                      : 'bg-white/60 hover:bg-white/80 backdrop-blur-md text-[#4D5563] border border-white/30'
                  }`}
                >
                  {descriptor}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 min-h-[400px] border border-white/50">
            <h3 className="text-lg font-semibold mb-4 text-[#4D5563]">
              Your Stories ({ingredients.length})
            </h3>
            
            {ingredients.length === 0 ? (
              <div className="text-center py-16 text-[#4D5563]/60">
                <div className="w-12 h-12 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30">
                  <Plus className="w-6 h-6 text-[#4D5563]/60" />
                </div>
                <p className="font-medium mb-1">Your stories will appear here</p>
                <p className="text-sm">Click prompts above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-xl p-3 group transition-all duration-200 shadow-lg border border-white/30"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        {ingredient.includes(':') ? (
                          <>
                            <div className="font-semibold mb-1 text-sm text-[#4D5563]">
                              {ingredient.split(':')[0]}:
                            </div>
                            <div className="text-sm leading-relaxed text-[#4D5563]/80">
                              {ingredient.split(':').slice(1).join(':').trim()}
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-sm text-[#4D5563]">{ingredient}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="p-1 bg-white/60 hover:bg-red-100 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 text-[#4D5563]/60 hover:text-red-600 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {descriptors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/30">
                <h4 className="text-sm font-medium mb-2 text-[#4D5563]/80">Selected Descriptors</h4>
                <div className="flex flex-wrap gap-2">
                  {descriptors.map((descriptor) => (
                    <span
                      key={descriptor}
                      className="px-2 py-1 bg-white/60 backdrop-blur-md rounded-full text-xs text-[#4D5563] shadow-md border border-white/30"
                    >
                      {descriptor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Link href="/define">
            <button className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 shadow-xl border border-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/craft">
            <button
              disabled={!canProceed}
              className={`flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-300 shadow-xl ${
                canProceed
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <AnimatePresence>
          {writingModal.isOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/50 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-[#4D5563] pr-3">
                      {writingModal.prompt}
                    </h3>
                    <button
                      onClick={closeWritingModal}
                      className="p-1 text-[#4D5563]/60 hover:text-[#4D5563] hover:bg-white/60 rounded-lg transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <textarea
                    value={writingModal.story}
                    onChange={(e) => setWritingModal(prev => ({ ...prev, story: e.target.value }))}
                    placeholder="Share your story here..."
                    className="w-full h-40 p-3 bg-white/70 backdrop-blur-md text-[#4D5563] placeholder-[#4D5563]/60 border border-white/30 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-lg"
                    autoFocus
                  />
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={closeWritingModal}
                      className="px-4 py-2 text-[#4D5563]/80 hover:text-[#4D5563] hover:bg-white/60 rounded-xl transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveStory}
                      disabled={!writingModal.story.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
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