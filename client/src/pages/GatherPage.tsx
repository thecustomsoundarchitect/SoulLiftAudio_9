import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSoulHug } from '../context/SoulHugContext';

function GatherPage() {
  const navigate = useNavigate();
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug();
  const [collectedThoughts, setCollectedThoughts] = useState<string[]>(currentSoulHug.collectedThoughts || []);
  const [descriptors, setDescriptors] = useState<string[]>(currentSoulHug.descriptors || []);
  const [writingModal, setWritingModal] = useState({ isOpen: false, prompt: '', story: '' });
  const [promptSeeds, setPromptSeeds] = useState<(string | { prompt: string; context?: string })[]>([]);
  const [loading, setLoading] = useState(false);

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

  const dummyDescriptors = [
    "brave", "gentle", "funny", "wise", "creative", "loyal", 
    "thoughtful", "adventurous", "caring", "resilient", "curious", "generous"
  ];

  useEffect(() => {
    const loadPrompts = async () => {
      if (!currentSoulHug.coreFeeling) return;
      setLoading(true);
      try {
        const res = await fetch('/api/prompt-seeds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coreFeeling: currentSoulHug.coreFeeling,
            tone: currentSoulHug.tone || '',
            recipient: currentSoulHug.recipient || '',
            occasion: currentSoulHug.occasion || '',
          }),
        });
        const prompts = await res.json();
        setPromptSeeds(prompts);
      } catch {
        setPromptSeeds([]);
      } finally {
        setLoading(false);
      }
    };
    loadPrompts();
  }, [currentSoulHug.coreFeeling, currentSoulHug.tone, currentSoulHug.recipient, currentSoulHug.occasion]);

  const openWritingModal = (prompt: string) => {
    setWritingModal({ isOpen: true, prompt, story: '' });
  };

  const closeWritingModal = () => {
    setWritingModal({ isOpen: false, prompt: '', story: '' });
  };

  const saveStory = () => {
    if (writingModal.story.trim()) {
      const newCollectedThoughts = [...collectedThoughts, writingModal.story.trim()];
      setCollectedThoughts(newCollectedThoughts);
      updateCurrentSoulHug({ collectedThoughts: newCollectedThoughts });
    }
    closeWritingModal();
  };

  const toggleDescriptor = (descriptor: string) => {
    let newDescriptors = descriptors.includes(descriptor)
      ? descriptors.filter(d => d !== descriptor)
      : [...descriptors, descriptor];
    setDescriptors(newDescriptors);
    updateCurrentSoulHug({ descriptors: newDescriptors });
  };

  const removeCollectedThought = (thought: string) => {
    const newCollectedThoughts = collectedThoughts.filter(i => i !== thought);
    setCollectedThoughts(newCollectedThoughts);
    updateCurrentSoulHug({ collectedThoughts: newCollectedThoughts });
  };

  const handlePromptToggle = (promptText: string) => {
    let newCollectedThoughts = [...collectedThoughts];
    if (collectedThoughts.includes(promptText)) {
      newCollectedThoughts = newCollectedThoughts.filter(item => item !== promptText);
    } else {
      newCollectedThoughts.push(promptText);
    }
    setCollectedThoughts(newCollectedThoughts);
    updateCurrentSoulHug({ collectedThoughts: newCollectedThoughts });
  };

  const handleCraftMessage = async () => {
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectedThoughts: currentSoulHug.collectedThoughts || [],
          descriptors: descriptors || [],
          coreFeeling: currentSoulHug.coreFeeling,
          tone: currentSoulHug.tone,
          recipient: currentSoulHug.recipient,
          occasion: currentSoulHug.occasion,
          length: '1m'
        })
      });

      const { message } = await res.json();
      updateCurrentSoulHug({ message });
      navigate('/transition');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans">
      <motion.div
        className="max-w-2xl mx-auto px-4 py-12 pb-24 sm:pb-28"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Header Image */}
          <img
            src="https://i.imgur.com/4aycdE8.png"
            alt="Gather Your Stories"
            className="w-full h-auto mb-4"
          />

          {/* Thought Prompts Section */}
          <div>
            <h2 className="text-pink-500 font-bold text-sm uppercase tracking-wide mb-4">
              THOUGHT PROMPTS
            </h2>
            <div className="space-y-4">
              <div className="text-xs text-slate-600 mb-2 leading-relaxed tracking-wide">
                Tap a prompt to open a text box and write your thoughts.<br />
                Or, turn on <span className="font-semibold">Save Prompt Directly</span> to add that specific prompt to your collected thoughts.
              </div>
              
              {/* Prompts Grid */}
              <div className="grid grid-cols-1 gap-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading personalized prompts...</div>
                  </div>
                ) : (
                  (promptSeeds.length > 0 ? promptSeeds : dummyPrompts).map((prompt, idx) => {
                    const promptText = typeof prompt === 'string' ? prompt : prompt.prompt;
                    const isToggled = collectedThoughts.includes(promptText);
                    
                    return (
                      <div key={idx} className="flex items-center bg-gray-200 rounded-xl px-3 py-2">
                        <button
                          onClick={() => openWritingModal(promptText)}
                          className="flex-1 text-left text-slate-600 font-medium text-xs hover:underline focus:outline-none leading-tight"
                        >
                          {promptText}
                        </button>
                        
                        {/* Toggle Switch */}
                        <button
                          onClick={() => handlePromptToggle(promptText)}
                          className={`ml-3 w-10 h-6 rounded-full flex items-center p-1 transition-colors duration-200 border-2 ${
                            isToggled
                              ? 'bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 border-purple-300'
                              : 'bg-gray-300 border-gray-300'
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full shadow transition-transform duration-200 ${
                              isToggled ? 'translate-x-4' : ''
                            } ${
                              isToggled
                                ? 'bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 shadow-purple-300'
                                : 'bg-white'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Descriptors and Collected Thoughts Row */}
          <div className="flex flex-row gap-2">
            {/* Descriptors Column */}
            <div className="w-1/2 bg-white rounded-2xl border border-gray-300 shadow-sm p-3">
              <h3 className="text-pink-500 font-bold text-xs uppercase tracking-wide mb-3 text-center">
                Descriptors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {dummyDescriptors.map((descriptor, idx) => {
                  const isSelected = descriptors.includes(descriptor);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDescriptor(descriptor)}
                      className={`text-xs leading-tight py-1 px-1 rounded-full border cursor-pointer transition-all duration-200 font-medium text-center h-6 flex items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-violet-200 text-gray-900 shadow-sm'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:text-gray-800'
                      }`}
                    >
                      {descriptor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collected Thoughts Column */}
            <div className="w-1/2 bg-white rounded-2xl border border-gray-300 shadow-sm p-3">
              <h3 className="text-pink-500 font-bold text-xs uppercase tracking-wide mb-3 text-center">
                Collected Thoughts
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 space-y-1 min-h-[200px]">
                {collectedThoughts.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center pt-1">
                    No thoughts yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {collectedThoughts.map((thought, idx) => (
                      <div key={idx}>
                        <div className="flex items-start gap-1">
                          <span className="text-xs text-gray-600 flex-1">{thought}</span>
                          <button
                            onClick={() => removeCollectedThought(thought)}
                            className="text-red-300 hover:text-red-500 flex-shrink-0"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {idx < collectedThoughts.length - 1 && (
                          <div className="h-px bg-gray-200 mx-3 my-1 rounded-full w-[90%]" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Craft Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCraftMessage}
              className="w-40 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-medium py-2 rounded-full flex items-center justify-center hover:shadow-md transition-shadow"
            >
              Craft <span className="ml-1">›</span>
            </button>
          </div>
        </div>

        {/* Writing Modal */}
        <AnimatePresence>
          {writingModal.isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
                <div className="flex flex-col">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {writingModal.prompt}
                    </h3>
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={writingModal.story}
                      onChange={(e) => setWritingModal({ ...writingModal, story: e.target.value })}
                      className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none resize-none h-24"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeWritingModal}
                      className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={saveStory}
                      className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      Save Thought
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default GatherPage;