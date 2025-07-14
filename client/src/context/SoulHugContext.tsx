import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface SoulHug {
  id?: string
  recipient?: string
  coreFeeling?: string
  occasion?: string
  tone?: string
  collectedThoughts?: string[]
  descriptors?: string[]
  message?: string
  audioUrl?: string
  coverImage?: string | null
  backgroundMusic?: string
  musicVolume?: number
  createdAt?: string
  duration?: string
}

interface SoulHugContextType {
  currentSoulHug: SoulHug
  updateCurrentSoulHug: (updates: Partial<SoulHug>) => void
  savedSoulHugs: SoulHug[]
  saveCurrentSoulHug: () => void
  loadSavedSoulHugs: () => void
  deleteSoulHug: (id: string) => void
}

const SoulHugContext = createContext<SoulHugContextType | undefined>(undefined)

export const useSoulHug = () => {
  const context = useContext(SoulHugContext)
  if (!context) {
    throw new Error('useSoulHug must be used within a SoulHugProvider')
  }
  return context
}

export const SoulHugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSoulHug, setCurrentSoulHug] = useState<SoulHug>({})
  const [savedSoulHugs, setSavedSoulHugs] = useState<SoulHug[]>([])

  const updateCurrentSoulHug = (updates: Partial<SoulHug>) => {
    setCurrentSoulHug(prev => ({ ...prev, ...updates }))
  }

  const saveCurrentSoulHug = () => {
    const hugToSave: SoulHug = {
      ...currentSoulHug,
      id: currentSoulHug.id || Date.now().toString(),
      createdAt: currentSoulHug.createdAt || new Date().toISOString()
    }

    const existingSoulHugs = JSON.parse(localStorage.getItem('soulHugs') || '[]')
    const updatedSoulHugs = [...existingSoulHugs, hugToSave]
    localStorage.setItem('soulHugs', JSON.stringify(updatedSoulHugs))
    setSavedSoulHugs(updatedSoulHugs)
  }

  const loadSavedSoulHugs = () => {
    const saved = JSON.parse(localStorage.getItem('soulHugs') || '[]')
    setSavedSoulHugs(saved)
  }

  const deleteSoulHug = (id: string) => {
    const updated = savedSoulHugs.filter(hug => hug.id !== id)
    localStorage.setItem('soulHugs', JSON.stringify(updated))
    setSavedSoulHugs(updated)
  }

  return (
    <SoulHugContext.Provider value={{
      currentSoulHug,
      updateCurrentSoulHug,
      savedSoulHugs,
      saveCurrentSoulHug,
      loadSavedSoulHugs,
      deleteSoulHug
    }}>
      {children}
    </SoulHugContext.Provider>
  )
}