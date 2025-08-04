'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { Upload, X, Image, Video, AlertCircle, CheckCircle } from 'lucide-react'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
  size: number
  compressed?: boolean
  error?: string
}

const MediaUploadStep: React.FC = () => {
  const { setValue, getValues } = useFormContext()
  const [headshots, setHeadshots] = useState<UploadedFile[]>([])
  const [videoSample, setVideoSample] = useState<UploadedFile | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Initialize media field if not already set
  useEffect(() => {
    setValue('media', {
      headshots: [],
      videoSample: undefined,
    })
      }, [setValue, getValues])

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      // Cleanup headshot preview URLs
      headshots.forEach(headshot => {
        URL.revokeObjectURL(headshot.preview)
      })
      // Cleanup video preview URL
      if (videoSample) {
        URL.revokeObjectURL(videoSample.preview)
      }
    }
  }, [headshots, videoSample])

  // File validation constants
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
  const MAX_HEADSHOTS = 5

  // Compress image function
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      return compressedFile
    } catch (error) {
      console.error('Image compression failed:', error)
      return file // Return original file if compression fails
    }
  }

  // Validate file function
  const validateFile = useCallback((file: File, type: 'image' | 'video'): string | null => {
    const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES

    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${type === 'image' ? '10MB' : '50MB'}`
    }

    // Check file type more robustly
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const mimeType = file.type.toLowerCase()
    
    const isValidType = allowedTypes.some(allowedType => {
      const allowedMime = allowedType.toLowerCase()
      const allowedExt = allowedType.split('/')[1]?.toLowerCase()
      
      return mimeType === allowedMime || 
             (fileExtension && allowedExt && fileExtension === allowedExt) ||
             (type === 'image' && mimeType.startsWith('image/') && ['jpeg', 'jpg', 'png'].includes(fileExtension || '')) ||
             (type === 'video' && mimeType.startsWith('video/') && ['mp4', 'mov', 'webm'].includes(fileExtension || ''))
    })

    if (!isValidType) {
      return `File type not supported. Please use ${type === 'image' ? 'JPG, JPEG, or PNG' : 'MP4, MOV, or WebM'} files. Detected: ${file.name} (${mimeType})`
    }

    return null
  }, [])

  // Create uploaded file object
  const createUploadedFile = (file: File, type: 'image' | 'video'): UploadedFile => {
    const preview = type === 'image' 
      ? URL.createObjectURL(file)
      : URL.createObjectURL(file)
    
    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview,
      type,
      size: file.size,
    }
  }

  // Handle headshot uploads
  const onHeadshotsDrop = useCallback(async (acceptedFiles: File[]) => {
    if (headshots.length + acceptedFiles.length > MAX_HEADSHOTS) {
      alert(`You can only upload up to ${MAX_HEADSHOTS} headshots`)
      return
    }

    setIsCompressing(true)
    const newHeadshots: UploadedFile[] = []

    for (const file of acceptedFiles) {
      const error = validateFile(file, 'image')
      if (error) {
        const errorFile = createUploadedFile(file, 'image')
        errorFile.error = error
        newHeadshots.push(errorFile)
        continue
      }

      try {
        const compressedFile = await compressImage(file)
        const uploadedFile = createUploadedFile(compressedFile, 'image')
        uploadedFile.compressed = compressedFile.size < file.size
        newHeadshots.push(uploadedFile)
             } catch (error) {
         console.error('Image processing failed:', error)
         const errorFile = createUploadedFile(file, 'image')
         errorFile.error = 'Failed to process image'
         newHeadshots.push(errorFile)
       }
    }

    const updatedHeadshots = [...headshots, ...newHeadshots]
    setHeadshots(updatedHeadshots)
    setValue('media', {
      ...getValues('media'),
      headshots: updatedHeadshots.map(h => h.file)
    })
    setIsCompressing(false)
      }, [headshots, setValue, getValues, validateFile])

  // Handle video upload
  const onVideoDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const error = validateFile(file, 'video')
    
    if (error) {
      const errorFile = createUploadedFile(file, 'video')
      errorFile.error = error
      setVideoSample(errorFile)
      return
    }

    const uploadedFile = createUploadedFile(file, 'video')
    setVideoSample(uploadedFile)
    setValue('media', {
      ...getValues('media'),
      videoSample: file
    })
      }, [setValue, getValues, validateFile])

  // Remove headshot
  const removeHeadshot = (id: string) => {
    const headshotToRemove = headshots.find(h => h.id === id)
    if (headshotToRemove) {
      URL.revokeObjectURL(headshotToRemove.preview)
    }
    const updatedHeadshots = headshots.filter(h => h.id !== id)
    setHeadshots(updatedHeadshots)
    setValue('media', {
      ...getValues('media'),
      headshots: updatedHeadshots.map(h => h.file)
    })
  }

  // Remove video
  const removeVideo = () => {
    if (videoSample) {
      URL.revokeObjectURL(videoSample.preview)
    }
    setVideoSample(null)
    setValue('media', {
      ...getValues('media'),
      videoSample: null
    })
  }

  // Dropzone configurations
  const headshotsDropzone = useDropzone({
    onDrop: onHeadshotsDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true,
    disabled: isCompressing
  })

  const videoDropzone = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm']
    },
    multiple: false
  })

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Upload Your Media</h2>
        <p className="text-foreground/70">
          Upload professional headshots and a video sample to showcase your talent
        </p>
      </div>

      {/* Headshots Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Professional Headshots</h3>
          <span className="text-sm text-foreground/60">
            ({headshots.length}/{MAX_HEADSHOTS})
          </span>
        </div>
        
        <div className="card-ponte p-6 border-2 border-dashed border-white/20 rounded-lg">
          <div
            {...headshotsDropzone.getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              headshotsDropzone.isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'hover:bg-white/5'
            }`}
          >
            <input {...headshotsDropzone.getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-3 text-foreground/60" />
            <p className="text-sm text-foreground/70 mb-1">
              {isCompressing ? 'Processing images...' : 'Drag & drop headshots here, or click to select'}
            </p>
            <p className="text-xs text-foreground/50">
              JPG, JPEG, PNG up to 10MB each • Up to {MAX_HEADSHOTS} images
            </p>
          </div>
        </div>

        {/* Headshots Preview */}
        {headshots.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {headshots.map((headshot, index) => (
              <div key={headshot.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={headshot.preview}
                    alt={`Headshot preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {headshot.error && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                  {headshot.compressed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Compressed
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeHeadshot(headshot.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-2 text-xs text-foreground/60">
                  {formatFileSize(headshot.size)}
                </div>
                {headshot.error && (
                  <div className="mt-1 text-xs text-red-400">
                    {headshot.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Video Sample</h3>
          <span className="text-sm text-foreground/60">(Optional)</span>
        </div>
        
        <div className="card-ponte p-6 border-2 border-dashed border-white/20 rounded-lg">
          <div
            {...videoDropzone.getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              videoDropzone.isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'hover:bg-white/5'
            }`}
          >
            <input {...videoDropzone.getInputProps()} />
            <Video className="w-8 h-8 mx-auto mb-3 text-foreground/60" />
            <p className="text-sm text-foreground/70 mb-1">
              Drag & drop video here, or click to select
            </p>
            <p className="text-xs text-foreground/50">
              MP4, MOV, WebM up to 50MB • Video files only
            </p>
          </div>
        </div>

        {/* Video Preview */}
        {videoSample && (
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
              <video
                src={videoSample.preview}
                controls
                className="w-full h-full object-cover"
              />
              {videoSample.error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              )}
            </div>
            <button
              onClick={removeVideo}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-2 text-xs text-foreground/60">
              {formatFileSize(videoSample.size)}
            </div>
            {videoSample.error && (
              <div className="mt-1 text-xs text-red-400">
                {videoSample.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* File Type Requirements */}
      <div className="card-ponte p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          File Type Requirements
        </h4>
        <div className="text-sm text-foreground/70 space-y-2">
          <div>
            <strong>Headshots:</strong> Only JPG, JPEG, or PNG files up to 10MB each
          </div>
          <div>
            <strong>Video:</strong> Only MP4, MOV, or WebM files up to 50MB
          </div>
          <div className="text-xs text-foreground/50 mt-1">
            Other file types will be rejected automatically
          </div>
        </div>
      </div>

      {/* Upload Tips */}
      <div className="card-ponte p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Upload Tips
        </h4>
        <ul className="text-sm text-foreground/70 space-y-1">
          <li>• Use high-quality, well-lit headshots with a neutral background</li>
          <li>• Ensure your face is clearly visible and well-lit</li>
          <li>• Video should be 30-60 seconds of you speaking naturally</li>
          <li>• Good audio quality is important for video samples</li>
          <li>• Files will be automatically compressed to optimize upload speed</li>
        </ul>
      </div>
    </div>
  )
}

export default MediaUploadStep 