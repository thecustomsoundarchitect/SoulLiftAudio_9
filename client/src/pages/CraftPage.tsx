import React, { useState, useRef, useEffect } from 'react';
import { useSoulHug } from '../context/SoulHugContext';

const LENGTH_OPTIONS = [
  { label: '30 SEC', value: '30s' },
  { label: '60 SEC', value: '1m' },
  { label: '90-120 SEC', value: '2m' }
]

function CraftPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  const [message, setMessage] = useState(currentSoulHug.message || '')
  const [selectedLength, setSelectedLength] = useState('1m')
  const editorRef = useRef(null)
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [pendingLength, setPendingLength] = useState(selectedLength)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [showPolishModal, setShowPolishModal] = useState(false)
  const [polishedMessage, setPolishedMessage] = useState('')
  const [showClearModal, setShowClearModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerateError, setRegenerateError] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Save to context on change
  useEffect(() => {
    updateCurrentSoulHug({
      message: message
    })
  }, [message, updateCurrentSoulHug])

  // Save to Firestore on navigation (placeholder)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // TODO: Save to Firestore here
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [message, selectedLength])

  // Close export menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        showExportMenu &&
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setShowExportMenu(false)
      }
      if (showColorPicker) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showExportMenu, showColorPicker])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    updateCurrentSoulHug({ message: e.target.value })
  }

  // Rich text editor functions
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = (editorRef.current as HTMLDivElement).innerHTML
      setMessage(content)
      updateCurrentSoulHug({ message: content })
    }
  }

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleEditorChange()
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingLength(e.target.value)
    setShowRegenerate(true)
    setRegeneratePrompt(
      `Would you like to regenerate your message for ${LENGTH_OPTIONS.find(o => o.value === e.target.value)?.label}? This will use your collected thoughts and may overwrite your current message.`
    )
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F59E0B', 
    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
    '#84CC16', '#06B6D4', '#8B5CF6', '#E11D48'
  ]

  const handleImageClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 4)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setRegenerateError('');
    setShowRegenerate(false);
    try {
      const lengthLabel = LENGTH_OPTIONS.find(opt => opt.value === pendingLength)?.label || pendingLength;
      const requestData = {
        feeling: (currentSoulHug as any).feeling || 'supportive',
        tone: (currentSoulHug as any).tone || 'warm',
        recipient: (currentSoulHug as any).recipient || 'friend',
        occasion: (currentSoulHug as any).occasion || 'encouragement',
        stories: currentSoulHug.collectedThoughts || [],
        descriptors: currentSoulHug.descriptors || [],
        length: lengthLabel
      };
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponses: Record<string, string> = {
        '30s': `Hey friend, I know tomorrow's interview feels overwhelming, but remember when you started something new before? You found your confidence by taking it step by step. You've got this! 💪`,
        '1m': `I can feel how anxious you are about tomorrow's job interview, and that's completely understandable. Remember that time when you felt overwhelmed starting something new? You discovered that taking small steps helped you build confidence, and having support from friends made all the difference. You have those same strengths now. Trust in your preparation, believe in your abilities, and know that this nervousness just shows how much this opportunity means to you. You're going to do amazing! 🌟`,
        '2m': `I want you to know that feeling anxious about tomorrow's job interview is completely normal and actually shows how much this opportunity means to you. I remember you telling me about that time when you felt overwhelmed when starting something new - but look how you handled it. You took small steps, built your confidence gradually, and leaned on the support of friends who believed in you. That same resilience is still within you now.\n\nThe preparation you've done, the experiences that brought you here, and the unique perspective you bring are all valuable. Those interview nerves? They're just your mind's way of saying this matters to you. Channel that energy into showing them who you really are - someone who faces challenges thoughtfully, grows from experiences, and brings warmth and dedication to everything they do.\n\nTomorrow, when you walk into that room, remember that you belong there. You've earned this opportunity. Take a deep breath, trust in your abilities, and let your authentic self shine through. No matter what happens, you're taking a brave step forward, and that's something to be proud of. I'm rooting for you every step of the way! 🌟✨`
      };
      const regeneratedMessage = mockResponses[pendingLength] || 'Regenerated message for your selected length...';
      setSelectedLength(pendingLength);
      setMessage(regeneratedMessage);
      updateCurrentSoulHug({ message: regeneratedMessage });
    } catch (error) {
      console.error('Regeneration failed:', error);
      setRegenerateError('Failed to regenerate message. Please try again.');
      setPendingLength(selectedLength);
    } finally {
      setIsRegenerating(false);
    }
  }

  const handleCancelRegenerate = () => {
    setPendingLength(selectedLength)
    setShowRegenerate(false)
  }

  // Polish My Message
  const handlePolish = () => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = message
    let textContent = tempDiv.textContent || tempDiv.innerText || ''
    setPolishedMessage(textContent + " [Polished version would appear here]")
    setShowPolishModal(true)
  }

  const handleApprovePolish = () => {
    setMessage(polishedMessage)
    updateCurrentSoulHug({ message: polishedMessage })
    setShowPolishModal(false)
  }

  const handleCancelPolish = () => setShowPolishModal(false)

  // Clear All
  const handleClear = () => setShowClearModal(true)
  const handleConfirmClear = () => {
    setMessage('')
    updateCurrentSoulHug({ message: '' })
    setShowClearModal(false)
  }
  const handleCancelClear = () => setShowClearModal(false)

  // Export
  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    setShowExportMenu(false)
  }

  const handleDownloadPDF = () => {
    const win = window.open('', '', 'width=600,height=600');
    if (win) {
      win.document.write(`<pre style='font-family:sans-serif'>${message.replace(/</g, '&lt;')}</pre>`);
      win.print();
      win.close();
    }
    setShowExportMenu(false);
  }

  const handleSaveForLater = () => {
    alert('Message saved for later! (Firestore integration needed)')
    setShowExportMenu(false)
  }

  return (
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF] min-h-screen"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <style>{`
        .toggle-cont {
          --primary: #54a8fc;
          --light: #d9d9d9;
          --dark: #121212;
          --gray: #414344;
          position: relative;
          z-index: 10;
          width: fit-content;
          height: 32px;
          border-radius: 9999px;
          transform: scale(0.45);
        }
        .toggle-cont .toggle-input {
          display: none;
        }
        .toggle-cont .toggle-label {
          --gap: 3px;
          --width: 32px;
          cursor: pointer;
          position: relative;
          display: inline-block;
          padding: 0.3rem;
          width: calc((var(--width) + var(--gap)) * 2);
          height: 100%;
          background-color: var(--dark);
          border: 1px solid #777777;
          border-bottom: 0;
          border-radius: 9999px;
          box-sizing: content-box;
          transition: all 0.3s ease-in-out;
        }
        .toggle-label::before {
          content: "";
          position: absolute;
          z-index: -10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% + 1rem);
          height: calc(100% + 1rem);
          background-color: var(--gray);
          border: 1px solid #777777;
          border-bottom: 0;
          border-radius: 9999px;
          transition: all 0.3s ease-in-out;
        }
        .toggle-label::after {
          content: "";
          position: absolute;
          z-index: -10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
            circle at 50% -100%,
            rgb(58, 155, 252) 0%,
            rgba(12, 12, 12, 1) 80%
          );
          border-radius: 9999px;
        }
        .toggle-cont .toggle-label .cont-icon {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: var(--width);
          height: 32px;
          background-image: radial-gradient(
            circle at 50% 0%,
            #666666 0%,
            var(--gray) 100%
          );
          border: 1px solid #aaaaaa;
          border-bottom: 0;
          border-radius: 9999px;
          box-shadow: inset 0 -0.1rem 0.1rem var(--primary),
            inset 0 0 0.3rem 0.5rem var(--second);
          transition: transform 0.3s ease-in-out;
        }
        .cont-icon {
          overflow: clip;
          position: relative;
        }
        .cont-icon .sparkle {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          width: calc(var(--width) * 0.6px);
          aspect-ratio: 1;
          background-color: var(--light);
          border-radius: 50%;
          transform-origin: 50% 50%;
          rotate: calc(1deg * var(--deg));
          transform: translate(-50%, -50%);
          animation: sparkle calc(100s / var(--duration)) linear
            calc(0s / var(--duration)) infinite;
        }
        @keyframes sparkle {
          to {
            width: calc(var(--width) * 0.3px);
            transform: translate(2000%, -50%);
          }
        }
        .cont-icon .icon {
          width: 0.8rem;
          fill: var(--light);
        }
        .toggle-cont:has(.toggle-input:checked) {
          --checked: true;
        }
        .toggle-cont:has(.toggle-input:checked) .toggle-label {
          background-color: #41434400;
          border: 1px solid #3d6970;
          border-bottom: 0;
        }
        .toggle-cont:has(.toggle-input:checked) .toggle-label::before {
          box-shadow: 0 0.6rem 1.5rem -1.2rem #0080ff;
        }
        .toggle-cont:has(.toggle-input:checked) .toggle-label .cont-icon {
          overflow: visible;
          background-image: radial-gradient(
            circle at 50% 0%,
            #045ab1 0%,
            var(--primary) 100%
          );
          border: 1px solid var(--primary);
          border-bottom: 0;
          transform: translateX(calc((var(--gap) * 2) + 100%)) rotate(-225deg);
        }
        .toggle-cont:has(.toggle-input:checked) .toggle-label .cont-icon .sparkle {
          z-index: -10;
          width: calc(var(--width) * 0.9px);
          background-color: #acacac;
          animation: sparkle calc(100s / var(--duration)) linear
            calc(10s / var(--duration)) infinite;
        }
      `}</style>

      {/* Modal Popup for Regenerate Confirmation */}
      {(showRegenerate || isRegenerating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-2 flex flex-col items-center">
            {isRegenerating ? (
              <>
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-base text-gray-800 text-center mb-4">
                  Regenerating your message for {LENGTH_OPTIONS.find(o => o.value === pendingLength)?.label}...
                </span>
                <button
                  onClick={() => {
                    setIsRegenerating(false)
                    setPendingLength(selectedLength)
                  }}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-base text-gray-800 text-center mb-4">{regeneratePrompt}</span>
                {regenerateError && (
                  <div className="text-red-600 text-sm text-center mb-4 p-2 bg-red-50 rounded-lg">
                    {regenerateError}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Yes, Regenerate
                  </button>
                  <button
                    onClick={handleCancelRegenerate}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
                  >
                    No, Keep Current
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Popup for Polish My Message */}
      {showPolishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-2 flex flex-col items-center">
            <span className="text-base text-gray-800 text-center mb-4">Approve this polished version?</span>
            <div
              className="w-full p-3 text-base text-gray-700 bg-gray-50 rounded border border-gray-200 mb-4 min-h-[80px]"
              style={{ minHeight: '80px' }}
              dangerouslySetInnerHTML={{ __html: polishedMessage }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleApprovePolish}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition-all"
              >
                Replace My Message
              </button>
              <button
                onClick={handleCancelPolish}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Clear All */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-2 flex flex-col items-center">
            <span className="text-base text-gray-800 text-center mb-4">Are you sure you want to clear your message? This cannot be undone.</span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition-all"
              >
                Yes, Clear All
              </button>
              <button
                onClick={handleCancelClear}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-12 w-full pb-24 sm:pb-28">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Craft the Perfect Message
              </span>
            </h1>
            <p className="text-lg text-[#4D5563] mb-4">
              "Let us help you shape your message"
            </p>
          </div>

          {/* Editable Text Box Area */}
          <div className="w-full flex justify-center items-start gap-4">
            <div className="flex-grow w-full relative"
                 style={{
                   padding: '9px',
                   backgroundColor: '#e8e8e8',
                   borderRadius: '35px',
                   boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                 }}>
              
              {/* Card Overlay */}
              <div style={{
                position: 'absolute',
                inset: '0',
                pointerEvents: 'none',
                background: 'repeating-conic-gradient(#e8e8e8 0.0000001%, #93a1a1 0.000104%) 60% 60%/600% 600%',
                filter: 'opacity(10%) contrast(105%)',
                borderRadius: '35px'
              }}></div>
              
              {/* Inner Card Container */}
              <div style={{
                backgroundColor: '#e2e0e0',
                borderRadius: '30px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                
                {/* Length Selector */}
                <div className="flex justify-between items-center px-4 pt-3 pb-2">
                  <div className="flex gap-4">
                    {LENGTH_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="length"
                          value={opt.value}
                          checked={pendingLength === opt.value}
                          onChange={handleLengthChange}
                          className="accent-purple-500 h-4 w-4"
                        />
                        <span className="text-xs font-medium text-gray-600">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Est. Read 1 Min</span>
                </div>

                {/* Rich Text Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorChange}
                  className="w-full p-5 text-base text-gray-700 border-none shadow-none focus:ring-2 focus:ring-purple-400 focus:outline-none min-h-[280px] border-t-2 border-gray-400"
                  style={{ 
                    minHeight: '280px',
                    backgroundColor: 'transparent'
                  }}
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: message }}
                />
                
                {/* Simple Clean Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => executeCommand('undo', undefined)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Undo"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => executeCommand('redo', undefined)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Redo"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="w-px h-5 bg-gray-300"></div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => executeCommand('bold', undefined)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Bold"
                      >
                        <span className="font-bold text-gray-600">B</span>
                      </button>
                      
                      <button
                        onClick={() => executeCommand('italic', undefined)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Italic"
                      >
                        <span className="italic text-gray-600">I</span>
                      </button>
                      
                      <button
                        onClick={() => executeCommand('underline', undefined)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Underline"
                      >
                        <span className="underline text-gray-600">U</span>
                      </button>
                    </div>
                    
                    <div className="w-px h-5 bg-gray-300"></div>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Text Color"
                      >
                        <span className="text-gray-600 font-bold">A</span>
                      </button>
                      {showColorPicker && (
                        <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                          <div className="grid grid-cols-7 gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  executeCommand('foreColor', color)
                                  setShowColorPicker(false)
                                }}
                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Original Thoughts Toggle */}
                    <div className="flex flex-col items-center gap-1" title="Show Original Thoughts">
                      <div className="toggle-cont">
                        <input 
                          type="checkbox" 
                          id="thoughts-toggle" 
                          className="toggle-input"
                          checked={showPrompt}
                          onChange={(e) => setShowPrompt(e.target.checked)}
                        />
                        <label htmlFor="thoughts-toggle" className="toggle-label">
                          <div className="cont-icon">
                            <div className="sparkle" style={{['--deg' as any]: 45, ['--duration' as any]: 1}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 90, ['--duration' as any]: 1.5}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 135, ['--duration' as any]: 2}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 180, ['--duration' as any]: 2.5}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 225, ['--duration' as any]: 3}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 270, ['--duration' as any]: 3.5}}></div>
                            <div className="sparkle" style={{['--deg' as any]: 315, ['--duration' as any]: 4}}></div>
                            <svg className="icon" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                        </label>
                      </div>
                      <div className="text-xs text-gray-500 font-medium text-center leading-tight">
                        <div>Show Original</div>
                        <div>Collected Thoughts</div>
                      </div>
                    </div>
                    
                    <div className="w-px h-5 bg-gray-300"></div>
                    
                    {/* Polish Message Button */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={handlePolish}
                        className="px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Polish My Story"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <div className="text-xs text-gray-500 font-medium text-center leading-tight">
                        <div>Polish My</div>
                        <div>Story</div>
                      </div>
                    </div>
                    
                    <div className="w-px h-5 bg-gray-300"></div>
                    
                    {/* Delete button - Far Right */}
                    <button
                      onClick={handleClear}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors"
                      title="Clear All"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Original Collected Thoughts - Shows under text box when toggled on */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showPrompt ? 'max-h-96 mt-6' : 'max-h-0'}`}>
            <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Original Collected Thoughts</h4>
              <ul className="list-disc list-inside space-y-1">
                {(() => {
                  const allThoughts = [
                    ...(currentSoulHug.collectedThoughts || []),
                    ...(currentSoulHug.descriptors || [])
                  ];
                  const uniqueThoughts = [...new Set(allThoughts)];

                  if (uniqueThoughts.length === 0) {
                    return (
                      <li className="text-sm text-gray-400 list-none">
                        Visit Define and Gather to collect thoughts
                      </li>
                    );
                  }
                  
                  return uniqueThoughts.map((thought, index) => (
                    <li
                      key={`thought-${index}`}
                      className="text-sm text-gray-700"
                    >
                      {thought}
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>

          {/* Add Photo Section */}
          <div className="w-full mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add a Photo (Optional)</h3>
          </div>

          {/* Export Message - Moved Down */}
          <div className="w-full mt-6">
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(v => !v)}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                Export Message
              </button>
              {showExportMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleDownloadPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={handleCopy}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleSaveForLater}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Save for later
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Continue to Audio Hug - Fixed at bottom */}
      <div className="w-full flex justify-center pb-8 pt-4 bg-[#F3F7FF]">
        <button
          onClick={() => {
            alert('Navigate to Audio Hug page!')
          }}
          className="w-52 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-medium py-2 rounded-full flex items-center justify-center"
        >
          Continue to Audio Hug
        </button>
      </div>
    </div>
  );
}

export default CraftPage;