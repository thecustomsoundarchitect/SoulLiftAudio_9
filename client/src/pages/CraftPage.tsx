import { useEffect, useRef, useState } from 'react'
import { useSoulHug } from '../context/SoulHugContext'
import { motion } from 'framer-motion'

const LENGTH_OPTIONS = [
  { label: '30 SEC', value: '30s' },
  { label: '60 SEC', value: '1m' },
  { label: '90-120 SEC', value: '2m' }
]

function CraftPage() {
  const { currentSoulHug, updateCurrentSoulHug } = useSoulHug()
  // State for messageText, messageLength
  const [message, setMessage] = useState(currentSoulHug.message || '')
  const [selectedLength, setSelectedLength] = useState('1m')
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [pendingLength, setPendingLength] = useState(selectedLength)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontSizer, setShowFontSizer] = useState(false)
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
      if (showColorPicker) {
        setShowColorPicker(false)
      }
      if (showFontSizer) {
        setShowFontSizer(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showExportMenu, showColorPicker, showFontSizer])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    updateCurrentSoulHug({ message: e.target.value })
  }

  // Rich text editor functions
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        executeCommand('insertImage', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F59E0B', 
    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
    '#84CC16', '#06B6D4', '#8B5CF6', '#E11D48'
  ]

  const fontSizes = [
    { label: 'Small', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '5' },
    { label: 'Extra Large', value: '7' }
  ]

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

  // Utility to remove unwanted polish phrases
  const cleanPolishText = (input: string) => {
    // Remove all occurrences of unwanted phrases (case-insensitive, repeated, with/without brackets)
    return input
      .replace(/\(Polished\)/gi, '')
      .replace(/\[Clarity, flow, and warmth added by AI\]/gi, '')
      .replace(/\s{2,}/g, ' ') // collapse extra spaces
      .trim()
  }

  // Polish My Message
  const handlePolish = () => {
    // Extract text content from HTML for polishing
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = message
    let textContent = tempDiv.textContent || tempDiv.innerText || ''
    setPolishedMessage(textContent)
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
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
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
      <motion.div
        className="max-w-2xl mx-auto px-4 py-12 w-full pb-24 sm:pb-28"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Craft the Perfect Message
              </span>
            </h1>
            <div className="text-lg text-[#4D5563] mb-4 text-right pr-2" style={{lineHeight: '1.2'}}>
              {`"Let us help you shape your message"`}
            </div>
          </div>

          {/* Editable Text Box Area */}
          <div className="w-full flex justify-center items-start gap-4">
            {/* Editor */}
            <div className="flex-grow w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
              {/* Length Selector */}
              <div className="flex justify-start items-center gap-4 px-4 pt-3 pb-2">
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

              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                className="w-full p-5 text-base text-gray-700 bg-white rounded-t-2xl border-none shadow-none focus:ring-2 focus:ring-purple-400 focus:outline-none min-h-[180px] border-t border-gray-200"
                style={{ minHeight: '180px' }}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{ __html: message }}
              />
              
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl overflow-x-auto flex-nowrap scrollbar-hide">
                <button
                  onClick={() => executeCommand('undo')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Undo"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                
                <button
                  onClick={() => executeCommand('redo')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Redo"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button
                  onClick={() => executeCommand('bold')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Bold"
                >
                  <span className="font-bold text-gray-700">B</span>
                </button>
                
                <button
                  onClick={() => executeCommand('italic')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Italic"
                >
                  <span className="italic text-gray-700">I</span>
                </button>
                
                <button
                  onClick={() => executeCommand('underline')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Underline"
                >
                  <span className="underline text-gray-700">U</span>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowFontSizer(!showFontSizer)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Font Size"
                  >
                    <span className="text-gray-700 text-xs">Aa</span>
                  </button>
                  
                  {showFontSizer && (
                    <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                      <div className="flex flex-col gap-1">
                        {fontSizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => {
                              executeCommand('fontSize', size.value)
                              setShowFontSizer(false)
                            }}
                            className="px-3 py-1 text-left text-gray-700 hover:bg-gray-100 rounded text-sm"
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button
                  onClick={() => executeCommand('insertUnorderedList')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Bullet List"
                >
                  <span className="text-gray-700">•</span>
                </button>
                
                <button
                  onClick={() => executeCommand('insertOrderedList')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Numbered List"
                >
                  <span className="text-gray-700 text-sm">1.</span>
                </button>
                
                <button
                  onClick={() => executeCommand('formatBlock', 'blockquote')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Quote"
                >
                  <span className="text-gray-700">"</span>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Insert Image"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Text Color"
                  >
                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-gradient-to-r from-red-500 to-blue-500"></div>
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                      <div className="grid grid-cols-7 gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              executeCommand('foreColor', color)
                              setShowColorPicker(false)
                            }}
                            className="w-12 h-12 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              {/* End of editor/toolbar area */}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Est. Read 1 Min badge - always visible, prominent, and outside scroll/overflow */}
          <div className="w-full flex justify-center mt-4 mb-2">
            <span className="text-xs font-semibold text-white bg-purple-600 px-3 py-1 rounded-full shadow border border-purple-700" style={{fontSize: '12px', lineHeight: '1.2'}}>
              Est. Read 1 Min
            </span>
          </div>
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
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
          <div className="w-full mt-6">
            <button
              onClick={() => setShowPrompt(v => !v)}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-medium shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Original Collected Thoughts
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showPrompt ? 'max-h-96 mt-3' : 'max-h-0'}`}>
              <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                <ul className="list-disc list-inside space-y-1">
                  {(() => {
                    const allThoughts = [
                      ...(currentSoulHug.ingredients || []),
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
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default CraftPage;