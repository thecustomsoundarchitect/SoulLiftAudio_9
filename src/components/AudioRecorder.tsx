import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob | null, audioUrl: string | null) => void
  className?: string
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        
        setAudioBlob(blob)
        setAudioUrl(url)
        onRecordingComplete(blob, url)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      setError('Unable to access microphone. Please check permissions.')
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
    onRecordingComplete(null, null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100/80 backdrop-blur-sm border border-red-300 rounded-lg text-red-700 text-sm shadow-lg">
          {error}
        </div>
      )}

      <div className="text-center mb-4">
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xl ${
          isRecording 
            ? 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse scale-110' 
            : audioBlob 
              ? 'bg-gradient-to-br from-green-400 to-green-600 hover:scale-105' 
              : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:scale-105'
        }`}>
          <Mic className="w-8 h-8 text-white" />
        </div>
        
        {isRecording && (
          <div className="text-red-600 font-mono text-lg mb-2 font-semibold">
            REC {formatTime(recordingTime)}
          </div>
        )}
        
        {audioBlob && !isRecording && (
          <div className="text-green-600 font-mono text-sm mb-2 font-medium">
            Recorded: {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-3 mb-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </button>
        )}
        
        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </button>
        )}
        
        {audioBlob && !isRecording && (
          <>
            <button
              onClick={isPlaying ? pauseRecording : playRecording}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={startRecording}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-xl text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-record
            </button>
            
            <button
              onClick={deleteRecording}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:shadow-xl text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}