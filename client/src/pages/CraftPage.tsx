import { useEffect, useRef, useState } from 'react'
import { useSoulHug } from '../context/SoulHugContext'

const LENGTH_OPTIONS = [
  { label: '30 seconds', value: '30s' },
  { label: '1 minute', value: '1m' },
  { label: '1.5–2 minutes', value: '2m' }
]

function CraftPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  // State for messageText, messageLength
  const [message, setMessage] = useState(currentSoulHug.message || '')
  const [selectedLength, setSelectedLength] = useState('1m')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [pendingLength, setPendingLength] = useState(selectedLength)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [showPolishModal, setShowPolishModal] = useState(false)
  const [polishedMessage, setPolishedMessage] = useState('')
  const [showClearModal, setShowClearModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  // Save to context on change
  useEffect(() => {
    updateCurrentSoulHug({
      message: message
    })
  }, [message, selectedLength])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Save to Firestore on navigation (placeholder)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // TODO: Save to Firestore here
      // saveToFirestore({ message, messageLength: selectedLength })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [message, selectedLength])

  // Close export menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showExportMenu && exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showExportMenu])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    updateCurrentSoulHug({ message: e.target.value })
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingLength(e.target.value)
    setShowRegenerate(true)
    setRegeneratePrompt(
      `Would you like to regenerate your message for ${LENGTH_OPTIONS.find(o => o.value === e.target.value)?.label}? This will use your collected thoughts and may overwrite your current message.`
    )
  }

  const handleRegenerate = () => {
    setSelectedLength(pendingLength)
    setMessage(`[AI-generated message for ${pendingLength} using your collected thoughts...]`)
    updateCurrentSoulHug({ message: `[AI-generated message for ${pendingLength} using your collected thoughts...]` })
    setShowRegenerate(false)
  }

  const handleCancelRegenerate = () => {
    setPendingLength(selectedLength)
    setShowRegenerate(false)
  }

  // Polish My Message
  const handlePolish = () => {
    // Simulate OpenAI polish
    setPolishedMessage(`(Polished) ${message.trim()}\n\n[Clarity, flow, and warmth added by AI]`)
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
    // Simple PDF download using window.print (for demo)
    const win = window.open('', '', 'width=600,height=600')
    win!.document.write(`<pre style='font-family:sans-serif'>${message.replace(/</g, '&lt;')}</pre>`)
    win!.print()
    win!.close()
    setShowExportMenu(false)
  }
  const handleSaveForLater = () => {
    // Simulate Firestore save
    alert('Message saved for later! (Firestore integration needed)')
    setShowExportMenu(false)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F7FF] min-h-screen w-full overflow-x-hidden">
      {/* Modal Popup for Regenerate Confirmation */}
      {showRegenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-2 flex flex-col items-center">
            <span className="text-base text-gray-800 text-center mb-4">{regeneratePrompt}</span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition-all"
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
          </div>
        </div>
      )}
      {/* Modal Popup for Polish My Message */}
      {showPolishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-2 flex flex-col items-center">
            <span className="text-base text-gray-800 text-center mb-4">Approve this polished version?</span>
            <textarea
              className="w-full p-3 text-base text-gray-700 bg-gray-50 rounded border border-gray-200 mb-4"
              value={polishedMessage}
              readOnly
              rows={6}
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
      <div className="max-w-2xl mx-auto px-4 py-6 w-full">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Craft
              </span>
            </h1>
            <div className="text-lg text-[#4D5563] mb-4 text-right pr-2" style={{lineHeight: '1.2'}}>
              {`Let us help you shape your message`}
            </div>
          </div>

          {/* Length Selector */}
          <div className="flex flex-col items-center mb-2">
            <div className="flex gap-4">
              {LENGTH_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="length"
                    value={opt.value}
                    checked={pendingLength === opt.value}
                    onChange={handleLengthChange}
                    className="accent-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Editable Text Box */}
          <div className="w-full flex justify-center">
            <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-0.5 shadow-sm">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                className="w-full p-5 text-base text-gray-700 bg-gray-50 rounded-2xl border-none shadow-none focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none overflow-hidden min-h-[180px]"
                placeholder="Craft your message here..."
                rows={10}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <button
              onClick={handlePolish}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition-all"
            >
              Polish My Message
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow hover:bg-gray-300 transition-all"
            >
              Clear All
            </button>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(v => !v)}
                className="px-5 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold shadow hover:bg-blue-600 transition-all"
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

          {/* Collected Thoughts - Clean Collapsible Card */}
          <div className="flex flex-col items-center mt-6">
            <button
              onClick={() => setShowPrompt(v => !v)}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-medium shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              {showPrompt ? '−' : '+'} Collected Thoughts
            </button>
            {showPrompt && (
              <div className="mt-3 w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 transition-all">
                <div className="flex flex-wrap gap-2 justify-center">
                  {(() => {
                    const allThoughts = [
                      ...(currentSoulHug.ingredients || []),
                      ...(currentSoulHug.descriptors || [])
                    ];
                    const uniqueThoughts = [...new Set(allThoughts)];
                    return uniqueThoughts.map((thought, index) => (
                      <span
                        key={`thought-${index}`}
                        className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200"
                      >
                        {thought}
                      </span>
                    ));
                  })()}
                </div>
                
                {(!currentSoulHug.ingredients || currentSoulHug.ingredients.length === 0) && 
                 (!currentSoulHug.descriptors || currentSoulHug.descriptors.length === 0) && (
                  <div className="text-center text-sm text-gray-400 py-4">
                    Visit Define and Gather to collect thoughts
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CraftPage