import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowRight, ArrowLeft, X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoulHug } from '../context/SoulHugContext'
import ProgressIndicator from '../components/ProgressIndicator'

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

export default function GatherPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug();
  const [ingredients, setIngredients] = useState<string[]>(currentSoulHug.ingredients || []);
  const [descriptors, setDescriptors] = useState<string[]>(currentSoulHug.descriptors || []);
  const [writingModal, setWritingModal] = useState({ isOpen: false, prompt: '', story: '' });

  const openWritingModal = (prompt: string) => {
    setWritingModal({ isOpen: true, prompt, story: '' });
  };
  const closeWritingModal = () => {
    setWritingModal({ isOpen: false, prompt: '', story: '' });
  };
  const saveStory = () => {
    if (writingModal.story.trim()) {
      const storyIngredient = `${writingModal.prompt}: ${writingModal.story.trim()}`;
      const newIngredients = [...ingredients, storyIngredient];
      setIngredients(newIngredients);
      updateCurrentSoulHug({ ingredients: newIngredients });
    }
    closeWritingModal();
  };
  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(item => item !== ingredient);
    setIngredients(newIngredients);
    updateCurrentSoulHug({ ingredients: newIngredients });
  };
  const toggleDescriptor = (descriptor: string) => {
    let newDescriptors: string[];
    let newIngredients = [...ingredients];
    if (descriptors.includes(descriptor)) {
      newDescriptors = descriptors.filter(item => item !== descriptor);
      // Remove from collected thoughts if present
      newIngredients = newIngredients.filter(item => item !== descriptor);
    } else {
      newDescriptors = [...descriptors, descriptor];
      // Add to collected thoughts if not present
      if (!newIngredients.includes(descriptor)) {
        newIngredients.push(descriptor);
      }
    }
    setDescriptors(newDescriptors);
    setIngredients(newIngredients);
    updateCurrentSoulHug({ descriptors: newDescriptors, ingredients: newIngredients });
  };
  const canProceed = ingredients.length > 0 || descriptors.length > 0;

  // Dummy prompts for pill-style UI
  const dummyPrompts = [
    "When they showed unwavering kindness",
    "How their smile lights up rooms",
    "Their gift of making everyone feel welcome",
    "The natural way they comfort others",
    "What you see blossoming in them",
    "That time they stood up bravely",
    "The small ways they show care",
    "Why they deserve all the love"
  ];
  // Updated descriptors for pill-style UI
  const dummyDescriptors = [
    "Smart", "Caring", "Loyal", "Funny", "Patient", "Brave",
    "Creative", "Thoughtful", "Strong", "Loving", "Honest", "Supportive"
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F3F7FF] min-h-screen w-full overflow-x-hidden">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Title and Subtitle - match DefinePage */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Gather Your Stories
              </span>
            </h1>
            <div className="text-lg text-[#4D5563] mb-4 text-right" style={{lineHeight: '1.2'}}>
              {`"We'll help you get the`}<br/>{`thoughts out!"`}
            </div>
          </div>

          {/* Thought Prompts */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              THOUGHT PROMPTS
            </h2>
            
            <div className="space-y-4">
              <div className="text-xs text-[#4D5563] mb-2">
                Tap a prompt to open a text box and write your thoughts. Or, turn on 'Save Prompt Directly' to add that specific prompt to your thoughts.
              </div>
              <div className="grid grid-cols-1 gap-3">
                {dummyPrompts.map((prompt, idx) => {
                  const isToggled = ingredients.includes(prompt);
                  return (
                    <div key={idx} className="flex items-center bg-gray-200 rounded-xl px-3 py-2">
                      <button
                        onClick={() => openWritingModal(prompt)}
                        className="flex-1 text-left text-[#4D5563] font-medium text-xs hover:underline focus:outline-none"
                        style={{ fontSize: '0.78rem', lineHeight: 1.2 }}
                      >
                        {prompt}
                      </button>
                      {/* Toggle Button */}
                      <button
                        onClick={() => {
                          let newIngredients = [...ingredients];
                          if (isToggled) {
                            newIngredients = newIngredients.filter(item => item !== prompt);
                          } else {
                            newIngredients.push(prompt);
                          }
                          setIngredients(newIngredients);
                          updateCurrentSoulHug({ ...currentSoulHug, ingredients: newIngredients });
                        }}
                        className={`ml-3 w-10 h-6 rounded-full flex items-center p-1 transition-colors duration-200 ${isToggled ? 'bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400' : 'bg-gray-300'}`}
                        style={{ border: isToggled ? '2px solid #b39ddb' : '2px solid #e5e7eb' }}
                        aria-label="Toggle prompt in collected thoughts"
                      >
                        <span
                          className={`block w-4 h-4 rounded-full shadow transition-transform duration-200 ${isToggled ? 'translate-x-4' : ''}`}
                          style={{
                            background: isToggled
                              ? 'radial-gradient(circle at 60% 40%, #fff9c4 0%, #f5c6e7 60%, #b39ddb 100%)'
                              : '#fff',
                            boxShadow: isToggled ? '0 0 6px #b39ddb' : 'none',
                            transition: 'background 0.2s, transform 0.2s'
                          }}
                        ></span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Collected Thoughts & Descriptors */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl shadow-md p-4">
            {/* Collected Thoughts */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="text-pink-500 font-semibold text-sm mb-1">COLLECTED THOUGHTS</div>
              <div className="bg-white border border-gray-200 rounded-xl min-h-[100px] max-h-40 flex-1 p-2 mb-1 overflow-y-auto custom-scrollbar">
                {ingredients.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center">No thoughts yet</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-center justify-between py-2">
                        <span className="text-xs text-[#4D5563]">{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-2 text-red-300 hover:text-red-500 text-xs opacity-70 hover:opacity-100 transition"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link href="/weaving">
                <button className="mt-2 mb-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold py-2 rounded-full shadow-lg hover:scale-105 transition-all text-base">
                  <span>Weave</span>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14" r="14" fill="url(#paint0_linear_1_2)"/>
                    <path d="M11 9L17 14L11 19V9Z" fill="white"/>
                    <defs>
                      <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A259FF"/>
                        <stop offset="1" stopColor="#FF6F91"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </Link>
            </div>
            {/* Descriptors */}
            <div className="flex-1 flex flex-col min-w-0 mt-2 sm:mt-0">
              <div className="text-pink-500 font-semibold text-sm mb-1">DESCRIPTORS</div>
              <div className="flex flex-wrap gap-1">
                {dummyDescriptors.map((desc, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDescriptor(desc)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                      descriptors.includes(desc)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white border-none'
                        : 'bg-gray-100 text-[#4D5563] border-gray-200 hover:bg-purple-100'
                    }`}
                  >
                    {desc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        

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
                    placeholder="Share your thought here..."
                    className="w-full h-32 p-3 bg-white/70 backdrop-blur-md text-[#4D5563] placeholder-[#4D5563]/60 border border-white/30 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-lg"
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
                      Save Thought
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}