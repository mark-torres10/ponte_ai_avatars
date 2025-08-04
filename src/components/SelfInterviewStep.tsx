'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Mic, MicOff, Play, Square, AlertCircle } from 'lucide-react'

// Predefined interview questions
const INTERVIEW_QUESTIONS = [
  {
    id: 'background',
    question: 'Tell us about your background and experience.',
    placeholder: 'Share your professional background, education, and relevant experience...',
    required: true,
  },
  {
    id: 'interests',
    question: 'What are your main interests and hobbies?',
    placeholder: 'What do you enjoy doing in your free time? What are you passionate about?',
    required: false,
  },
  {
    id: 'communication_style',
    question: 'How would you describe your communication style?',
    placeholder: 'Are you more formal or casual? Do you prefer detailed explanations or brief summaries?',
    required: true,
  },
  {
    id: 'goals',
    question: 'What are your goals for working with AI avatars?',
    placeholder: 'What do you hope to achieve? What types of content would you like to create?',
    required: true,
  },
  {
    id: 'unique_qualities',
    question: 'What makes you unique? What special qualities do you bring?',
    placeholder: 'What sets you apart? What unique perspectives or experiences do you have?',
    required: false,
  },
]

interface RecordingState {
  isRecording: boolean
  isPlaying: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  duration: number
  error: string | null
}

const SelfInterviewStep: React.FC = () => {
  const { register, setValue, watch } = useFormContext()
  const [recordingStates, setRecordingStates] = useState<Record<string, RecordingState>>({})
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [currentRecordingQuestion, setCurrentRecordingQuestion] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Watch current values
  const predefinedAnswers = watch('interview.predefinedAnswers') || {}
  const freeformText = watch('interview.freeformText')

  // Initialize recording states for each question
  useEffect(() => {
    const initialStates: Record<string, RecordingState> = {}
    INTERVIEW_QUESTIONS.forEach(question => {
      initialStates[question.id] = {
        isRecording: false,
        isPlaying: false,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
        error: null,
      }
    })
    setRecordingStates(initialStates)
  }, [])

  // Track created URLs using a ref to ensure proper cleanup
  const createdUrlsRef = useRef<Set<string>>(new Set())

  // Cleanup audio URLs on unmount only
  useEffect(() => {
    return () => {
      const urlsToCleanup = createdUrlsRef.current
      urlsToCleanup.forEach(url => {
        URL.revokeObjectURL(url)
      })
      urlsToCleanup.clear()
    }
  }, [])

  // Check browser support for media recording
  const isRecordingSupported = typeof MediaRecorder !== 'undefined' && 
    MediaRecorder.isTypeSupported('audio/webm') || 
    MediaRecorder.isTypeSupported('audio/mp4') ||
    MediaRecorder.isTypeSupported('audio/wav')

  // Get supported MIME type
  const getSupportedMimeType = () => {
    const types = ['audio/webm', 'audio/mp4', 'audio/wav']
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm'
  }

  // Start recording for a specific question
  const startRecording = useCallback(async (questionId: string) => {
    try {
      if (!isRecordingSupported) {
        throw new Error('Voice recording is not supported in your browser')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setCurrentRecordingQuestion(questionId)

      const mimeType = getSupportedMimeType()
      const recorder = new MediaRecorder(mediaStream, { mimeType })
      setMediaRecorder(recorder)

      const chunks: Blob[] = []
      const startTime = Date.now()

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType })
        const audioUrl = URL.createObjectURL(audioBlob)
        const duration = Math.round((Date.now() - startTime) / 1000)

        // Track the created URL for cleanup
        createdUrlsRef.current.add(audioUrl)

        setRecordingStates(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isRecording: false,
            audioBlob,
            audioUrl,
            duration,
            error: null,
          }
        }))

        // Update form value
        setValue(`interview.predefinedAnswers.${questionId}_audio`, audioUrl)
        
        // Cleanup
        setMediaRecorder(null)
        setCurrentRecordingQuestion(null)
        // Note: stream cleanup is handled within the callback scope
        // where stream is defined, so we don't need it in dependencies
      }

      recorder.start()
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: true,
          error: null,
        }
      }))

    } catch (error) {
      console.error('Recording error:', error)
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: false,
          error: error instanceof Error ? error.message : 'Failed to start recording',
        }
      }))
    }
  }, [isRecordingSupported, setValue])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
  }, [mediaRecorder])

  // Play recorded audio
  const playRecording = useCallback((questionId: string) => {
    const state = recordingStates[questionId]
    if (!state.audioUrl) return

    if (audioRef.current) {
      audioRef.current.src = state.audioUrl
      audioRef.current.play()
      
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isPlaying: true,
        }
      }))

      // Store the onended handler for cleanup
      const onEndedHandler = () => {
        setRecordingStates(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isPlaying: false,
          }
        }))
      }

      audioRef.current.onended = onEndedHandler

      // Cleanup function to remove the handler
      return () => {
        if (audioRef.current) {
          audioRef.current.onended = null
        }
      }
    }
  }, [recordingStates])

  // Delete recording
  const deleteRecording = useCallback((questionId: string) => {
    const state = recordingStates[questionId]
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
      createdUrlsRef.current.delete(state.audioUrl)
    }

    setRecordingStates(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        audioBlob: null,
        audioUrl: null,
        duration: 0,
        isPlaying: false,
      }
    }))

    setValue(`interview.predefinedAnswers.${questionId}_audio`, undefined)
  }, [recordingStates, setValue])

  // Handle text input change
  const handleTextChange = useCallback((questionId: string, value: string) => {
    setValue(`interview.predefinedAnswers.${questionId}`, value)
  }, [setValue])

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Tell Us About Yourself</h3>
        <p className="text-foreground/70">
          Answer these questions to help us understand your personality and create an authentic AI avatar.
        </p>
      </div>

      {/* Interview Questions */}
      <div className="space-y-6">
        {INTERVIEW_QUESTIONS.map((question) => {
          const recordingState = recordingStates[question.id] || {
            isRecording: false,
            isPlaying: false,
            audioBlob: null,
            audioUrl: null,
            duration: 0,
            error: null,
          }

          return (
            <div key={question.id} className="card-ponte p-6 rounded-lg">
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  {question.question}
                  {question.required && <span className="text-red-400 ml-1">*</span>}
                </h4>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <textarea
                  {...register(`interview.predefinedAnswers.${question.id}`)}
                  placeholder={question.placeholder}
                  className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/5 hover:border-white/40 focus:border-primary transition-colors duration-200 min-h-[100px] resize-none"
                  value={predefinedAnswers[question.id] || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                />
              </div>

              {/* Voice Recording Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice Recording (Optional)</span>
                  {!isRecordingSupported && (
                    <span className="text-xs text-amber-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Not supported in your browser
                    </span>
                  )}
                </div>

                {recordingState.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {recordingState.error}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Record Button */}
                  {!recordingState.audioUrl ? (
                    <button
                      type="button"
                      onClick={() => recordingState.isRecording ? stopRecording() : startRecording(question.id)}
                      disabled={!isRecordingSupported || (currentRecordingQuestion !== null && currentRecordingQuestion !== question.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        recordingState.isRecording
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {recordingState.isRecording ? (
                        <>
                          <Square size={16} />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic size={16} />
                          Start Recording
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* Play Button */}
                      <button
                        type="button"
                        onClick={() => playRecording(question.id)}
                        disabled={recordingState.isPlaying}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play size={16} />
                        {recordingState.isPlaying ? 'Playing...' : 'Play Recording'}
                      </button>

                      {/* Duration */}
                      <span className="text-sm text-foreground/60">
                        {formatDuration(recordingState.duration)}
                      </span>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteRecording(question.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-md font-medium hover:bg-red-500/20"
                      >
                        <MicOff size={16} />
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {recordingState.isRecording && (
                    <div className="flex items-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      Recording...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Information */}
      <div className="card-ponte p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-3">Additional Information</h4>
        <p className="text-sm text-foreground/60 mb-4">
          Share any additional information that might help us create a better AI avatar for you.
        </p>
        
        <textarea
          {...register('interview.freeformText')}
          placeholder="Is there anything else you'd like us to know about you, your communication style, or your goals?"
          className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/5 hover:border-white/40 focus:border-primary transition-colors duration-200 min-h-[100px] resize-none"
          value={freeformText || ''}
          onChange={(e) => setValue('interview.freeformText', e.target.value)}
        />
      </div>

      {/* Progress Indicator */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">
            Questions Answered: {Object.keys(predefinedAnswers).filter(key => !key.includes('_audio')).length}/{INTERVIEW_QUESTIONS.filter(q => q.required).length}
          </span>
          <span className="text-primary font-medium">
            {Object.keys(predefinedAnswers).filter(key => !key.includes('_audio')).length >= INTERVIEW_QUESTIONS.filter(q => q.required).length 
              ? 'Great! You have completed the required questions.' 
              : 'Please answer the required questions marked with *.'}
          </span>
        </div>
      </div>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}

export default SelfInterviewStep 