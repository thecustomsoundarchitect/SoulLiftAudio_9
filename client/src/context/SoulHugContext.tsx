import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface SoulHug {
  id?: string
  recipient?: string
  coreFeeling?: string
  occasion?: string
  tone?: string
  ingredients?: string[]
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


import { useEffect } from 'react';

export const SoulHugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSoulHug, setCurrentSoulHug] = useState<SoulHug>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soullift-current-hug');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved Soul Hug data:', error);
        }
      }
    }
    return {
      recipient: '',
      coreFeeling: '',
      occasion: '',
      tone: '',
      stories: [],
      descriptors: [],
      message: '',
      customPrompts: []
    };
  });
  const [savedSoulHugs, setSavedSoulHugs] = useState<SoulHug[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('soullift-current-hug', JSON.stringify(currentSoulHug));
    }
  }, [currentSoulHug]);

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

  const clearForNewHug = () => {
    const freshData = {
      recipient: '',
      coreFeeling: '',
      occasion: '',
      tone: '',
      stories: [],
      descriptors: [],
      message: '',
      customPrompts: []
    };
    setCurrentSoulHug(freshData);
    localStorage.removeItem('soullift-current-hug');
  };

  return (
    <SoulHugContext.Provider value={{
      currentSoulHug,
      updateCurrentSoulHug,
      savedSoulHugs,
      saveCurrentSoulHug,
      loadSavedSoulHugs,
      deleteSoulHug,
      clearForNewHug
    }}>
      {children}
    </SoulHugContext.Provider>
  )
}