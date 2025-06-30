import React, { useState } from 'react'
import { Image, Upload, X } from 'lucide-react'

interface CoverImageSelectorProps {
  onImageSelected: (imageUrl: string | null) => void
  className?: string
}

const presetImages = [
  { 
    id: 'sunset-heart', 
    name: 'Sunset Heart', 
    gradient: 'bg-gradient-to-br from-orange-400 to-pink-500',
    url: '/images/sunset-heart.jpg'
  },
  { 
    id: 'ocean-waves', 
    name: 'Ocean Waves', 
    gradient: 'bg-gradient-to-br from-blue-400 to-teal-500',
    url: '/images/ocean-waves.jpg'
  },
  { 
    id: 'forest-path', 
    name: 'Forest Path', 
    gradient: 'bg-gradient-to-br from-green-400 to-emerald-500',
    url: '/images/forest-path.jpg'
  },
  { 
    id: 'purple-dreams', 
    name: 'Purple Dreams', 
    gradient: 'bg-gradient-to-br from-purple-400 to-indigo-500',
    url: '/images/purple-dreams.jpg'
  },
  { 
    id: 'golden-light', 
    name: 'Golden Light', 
    gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    url: '/images/golden-light.jpg'
  },
  { 
    id: 'rose-garden', 
    name: 'Rose Garden', 
    gradient: 'bg-gradient-to-br from-pink-400 to-rose-500',
    url: '/images/rose-garden.jpg'
  }
]

export const CoverImageSelector: React.FC<CoverImageSelectorProps> = ({ 
  onImageSelected, 
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handlePresetSelect = (image: typeof presetImages[0]) => {
    setSelectedImage(image.id)
    setCustomImage(null)
    onImageSelected(image.url)
  }

  const handleCustomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomImage(result)
        setSelectedImage(null)
        onImageSelected(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelection = () => {
    setSelectedImage(null)
    setCustomImage(null)
    onImageSelected(null)
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {presetImages.map((image) => (
          <button
            key={image.id}
            onClick={() => handlePresetSelect(image)}
            className={`aspect-square rounded-lg ${image.gradient} flex items-center justify-center transition-all relative group shadow-lg ${
              selectedImage === image.id ? 'ring-4 ring-green-500 scale-105' : 'hover:scale-105'
            }`}
          >
            <Image className="w-6 h-6 text-white opacity-80" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {image.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {customImage && (
        <div className="mb-4 relative">
          <img 
            src={customImage} 
            alt="Custom cover" 
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={clearSelection}
            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Custom Image
          </div>
        </div>
      )}

      {selectedImage && !customImage && (
        <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[#4D5563] font-medium text-sm">
              Selected: {presetImages.find(img => img.id === selectedImage)?.name}
            </span>
            <button
              onClick={clearSelection}
              className="text-[#4D5563]/60 hover:text-[#4D5563] text-xs underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      
      <label className="w-full border-2 border-dashed border-white/40 rounded-lg p-4 text-center hover:border-white/60 transition-colors cursor-pointer block bg-white/30 backdrop-blur-md shadow-lg">
        <Upload className="w-6 h-6 text-[#4D5563]/60 mx-auto mb-2" />
        <span className="text-sm text-[#4D5563]/80">Upload Custom Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleCustomUpload}
          className="hidden"
        />
      </label>
    </div>
  )
}