import React, { useState } from 'react'
import { Download, Share2, QrCode, Mail, Copy, Check } from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface DeliveryOptionsProps {
  soulHug: {
    id?: string
    title?: string
    audioUrl?: string
    coverImage?: string
    message?: string
    recipient?: string
  }
  className?: string
}

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ 
  soulHug, 
  className = '' 
}) => {
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const shareUrl = `${window.location.origin}/hug/${soulHug.id || 'preview'}`

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const zip = new JSZip()
      
      // Add message as text file
      if (soulHug.message) {
        zip.file('soul-hug-message.txt', soulHug.message)
      }
      
      // Add audio file (mock for now)
      if (soulHug.audioUrl) {
        try {
          const audioResponse = await fetch(soulHug.audioUrl)
          const audioBlob = await audioResponse.blob()
          zip.file('soul-hug-audio.mp3', audioBlob)
        } catch (error) {
          console.log('Audio file not available for download')
        }
      }
      
      // Add cover image
      if (soulHug.coverImage) {
        try {
          const imageResponse = await fetch(soulHug.coverImage)
          const imageBlob = await imageResponse.blob()
          const extension = soulHug.coverImage.includes('.png') ? 'png' : 'jpg'
          zip.file(`cover-image.${extension}`, imageBlob)
        } catch (error) {
          console.log('Cover image not available for download')
        }
      }
      
      // Generate and save zip
      const content = await zip.generateAsync({ type: 'blob' })
      const filename = `soul-hug-${soulHug.recipient || 'package'}-${Date.now()}.zip`
      saveAs(content, filename)
      
    } catch (error) {
      console.error('Error creating download package:', error)
      alert('Error creating download package. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const handleQRCode = async () => {
    setIsGeneratingQR(true)
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8B5CF6',
          light: '#FFFFFF'
        }
      })
      
      // Create download link
      const link = document.createElement('a')
      link.href = qrCodeDataUrl
      link.download = `soul-hug-qr-${soulHug.id || Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Fallback: just copy the URL to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('QR code generation failed, but share link copied to clipboard!')
      } catch (clipboardError) {
        alert('Error generating QR code. Please try again.')
      }
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`A Soul Hug for You${soulHug.recipient ? ` - ${soulHug.recipient}` : ''}`)
    const body = encodeURIComponent(`I've created a special Soul Hug message for you. Listen to it here: ${shareUrl}

${soulHug.message ? `\n\nMessage preview:\n${soulHug.message.substring(0, 200)}${soulHug.message.length > 200 ? '...' : ''}` : ''}

With love`)
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-[#4D5563]">Delivery Options</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-md rounded-lg hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/30"
        >
          <Download className={`w-8 h-8 text-[#4D5563] mb-2 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span className="text-sm font-medium text-[#4D5563]">
            {isDownloading ? 'Creating...' : 'Download'}
          </span>
          <span className="text-xs text-[#4D5563]/60 mt-1">ZIP Package</span>
        </button>
        
        <button
          onClick={handleShareLink}
          className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-md rounded-lg hover:bg-white/80 transition-colors shadow-lg border border-white/30"
        >
          {linkCopied ? (
            <Check className="w-8 h-8 text-green-500 mb-2" />
          ) : (
            <Share2 className="w-8 h-8 text-[#4D5563] mb-2" />
          )}
          <span className="text-sm font-medium text-[#4D5563]">
            {linkCopied ? 'Copied!' : 'Copy Link'}
          </span>
          <span className="text-xs text-[#4D5563]/60 mt-1">Share URL</span>
        </button>
        
        <button
          onClick={handleQRCode}
          disabled={isGeneratingQR}
          className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-md rounded-lg hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/30"
        >
          <QrCode className={`w-8 h-8 text-[#4D5563] mb-2 ${isGeneratingQR ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium text-[#4D5563]">
            {isGeneratingQR ? 'Creating...' : 'QR Code'}
          </span>
          <span className="text-xs text-[#4D5563]/60 mt-1">Download PNG</span>
        </button>
        
        <button
          onClick={handleEmail}
          className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-md rounded-lg hover:bg-white/80 transition-colors shadow-lg border border-white/30"
        >
          <Mail className="w-8 h-8 text-green-500 mb-2" />
          <span className="text-sm font-medium text-[#4D5563]">Send Email</span>
          <span className="text-xs text-[#4D5563]/60 mt-1">Mail Client</span>
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-lg p-4 border border-white/40 shadow-lg">
        <h4 className="font-medium text-[#4D5563] mb-2">Share URL:</h4>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg text-sm text-[#4D5563] focus:outline-none shadow-lg"
          />
          <button
            onClick={handleShareLink}
            className="p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors shadow-lg"
            title="Copy to clipboard"
          >
            {linkCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[#4D5563]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}