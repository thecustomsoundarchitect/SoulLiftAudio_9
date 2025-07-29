import { useEffect, useRef, useState } from 'react'
import { useSoulHug } from '../context/SoulHugContext'
import { motion } from 'framer-motion'
import './CraftPage.css'
import '../components/ui/toggle.css'

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
      className="flex-1 flex flex-col bg-[#F3F7FF] relative"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 z-0 pointer-events-none backdrop-img"
        style={{
          backgroundImage: "url('https://i.imgur.com/h2ei1kt.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          width: '100%',
          height: '100%'
        }}
      />
      {/* Modal Popup for Regenerate Confirmation */}
      {showRegenerate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p className="mb-4">{regeneratePrompt}</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleRegenerate} className="px-4 py-2 bg-purple-600 text-white rounded-md">Regenerate</button>
              <button onClick={handleCancelRegenerate} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
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
        className="max-w-2xl mx-auto px-4 py-12 w-full pb-24 sm:pb-28 relative z-10"
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
            <div className="card-editor flex-grow w-full">
              <div className="card-editor-overlay"></div>
              <div className="card-editor-inner">
                {/* Length Selector */}
                <div className="flex justify-between items-center gap-4 px-4 pt-3 pb-2">
                  <div className="flex items-center gap-4">
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
                  <div className="text-xs text-gray-500" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}}>
                    Est. Read 1 Min
                  </div>
                </div>

                {/* Rich Text Editor Container */}
                <div className="relative">
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorChange}
                    className="editor-content w-full p-5 text-base rounded-t-2xl shadow-none min-h-[180px]"
                    style={{ minHeight: '180px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </div>
                
                {/* Toolbar - New Clean Version */}
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    {/* Undo/Redo Buttons */}
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

                    <div className="w-px h-5 bg-gray-300"></div>

                    {/* Bold, Italic, Underline Buttons */}
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

                    <div className="w-px h-5 bg-gray-300"></div>

                    {/* Text Color Picker */}
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
                                  executeCommand('foreColor', color);
                                  setShowColorPicker(false);
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
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={showPrompt}
                          onChange={e => setShowPrompt(e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                      <div className="text-xs text-gray-500 font-medium text-center leading-tight" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}}>
                        <div>Show Original</div>
                        <div>Collected Thoughts</div>
                      </div>
                    </div>

                    <div className="w-px h-5 bg-gray-300"></div>

                    {/* Delete button - Far Right */}
                    <button
                      onClick={handleClear}
                      className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Clear All"
                    >
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* End of editor/toolbar area */}
                {/* End of editor/toolbar area */}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Control Buttons */}
          {/* Control Buttons removed as requested */}

          {/* Collected Thoughts - Clean Collapsible Card */}
          {/* Collected Thoughts box removed as requested */}

          {/* Show collected thoughts below toolbar if toggle is enabled */}
          {showPrompt && (
                <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 mt-2">
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
              )}
        </div>
      </motion.div>
    </div>
  );
}

export default CraftPage;