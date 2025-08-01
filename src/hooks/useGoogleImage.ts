import { useState, useEffect, useCallback } from 'react'

interface UseGoogleImageOptions {
  maxRetries?: number
  retryDelay?: number
  autoRefreshInterval?: number
}

interface GoogleImageState {
  isLoading: boolean
  hasError: boolean
  retryCount: number
  nextRetryIn: number
}

export function useGoogleImage(
  imageUrl: string | undefined,
  options: UseGoogleImageOptions = {}
) {
  const {
    maxRetries = 5,
    retryDelay = 30000, // 30 seconds
    autoRefreshInterval = 120000 // 2 minutes
  } = options

  const [state, setState] = useState<GoogleImageState>({
    isLoading: false,
    hasError: false,
    retryCount: 0,
    nextRetryIn: 0
  })

  const [imageKey, setImageKey] = useState(0)

  const isGoogleImage = imageUrl?.includes('googleusercontent.com')

  // Test if image loads successfully
  const testImage = useCallback((url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      
      // Add cache-busting parameter
      img.src = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`
    })
  }, [])

  // Force refresh the image
  const forceRefresh = useCallback(() => {
    setImageKey(prev => prev + 1)
    setState(prev => ({
      ...prev,
      retryCount: 0,
      hasError: false,
      isLoading: true
    }))
  }, [])

  // Check image availability
  const checkImage = useCallback(async () => {
    if (!imageUrl || !isGoogleImage) {
      setState(prev => ({ ...prev, isLoading: false, hasError: false }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    const isAvailable = await testImage(imageUrl)

    if (isAvailable) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        hasError: false, 
        retryCount: 0,
        nextRetryIn: 0
      }))
      return
    }

    // Image failed to load
    setState(prev => {
      const newRetryCount = prev.retryCount + 1
      
      if (newRetryCount >= maxRetries) {
        return {
          ...prev,
          isLoading: false,
          hasError: true,
          retryCount: newRetryCount,
          nextRetryIn: 0
        }
      }

      return {
        ...prev,
        isLoading: false,
        hasError: true,
        retryCount: newRetryCount,
        nextRetryIn: retryDelay / 1000
      }
    })
  }, [imageUrl, isGoogleImage, testImage, maxRetries, retryDelay])

  // Initial check and retries
  useEffect(() => {
    checkImage()
  }, [checkImage, imageKey])

  // Retry mechanism
  useEffect(() => {
    if (state.hasError && state.retryCount < maxRetries && state.nextRetryIn > 0) {
      const countdown = setInterval(() => {
        setState(prev => {
          if (prev.nextRetryIn <= 1) {
            clearInterval(countdown)
            setTimeout(checkImage, 1000)
            return { ...prev, nextRetryIn: 0 }
          }
          return { ...prev, nextRetryIn: prev.nextRetryIn - 1 }
        })
      }, 1000)

      return () => clearInterval(countdown)
    }
  }, [state.hasError, state.retryCount, state.nextRetryIn, maxRetries, checkImage])

  // Auto refresh for Google images
  useEffect(() => {
    if (isGoogleImage && !state.hasError && !state.isLoading) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refresh de imagen de Google')
        checkImage()
      }, autoRefreshInterval)

      return () => clearInterval(interval)
    }
  }, [isGoogleImage, state.hasError, state.isLoading, autoRefreshInterval, checkImage])

  return {
    ...state,
    isGoogleImage,
    shouldShowPlaceholder: !imageUrl || state.hasError || state.isLoading,
    forceRefresh,
    checkImage
  }
}
