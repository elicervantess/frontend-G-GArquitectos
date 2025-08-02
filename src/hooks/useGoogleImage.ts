import { useState, useCallback } from 'react'

interface GoogleImageState {
  isLoading: boolean
  hasError: boolean
}

export function useGoogleImage(imageUrl: string | undefined) {
  const [state, setState] = useState<GoogleImageState>({
    isLoading: false,
    hasError: false
  })

  const isGoogleImage = imageUrl?.includes('googleusercontent.com')

  // Force refresh the image - simplified
  const forceRefresh = useCallback(() => {
    setState({ isLoading: false, hasError: false })
  }, [])

  // Simplified hook - no delays, no retries, just immediate display
  return {
    ...state,
    retryCount: 0,
    nextRetryIn: 0,
    isGoogleImage,
    shouldShowPlaceholder: !imageUrl, // Only show placeholder if no URL
    forceRefresh,
    checkImage: () => {} // Empty function for compatibility
  }
}
