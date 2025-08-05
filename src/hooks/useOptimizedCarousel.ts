import { useState, useCallback, useRef, useEffect } from 'react'

interface UseOptimizedCarouselOptions {
  totalItems: number
  autoPlayInterval?: number
  preloadRange?: number
}

export function useOptimizedCarousel({
  totalItems,
  autoPlayInterval = 4000,
  preloadRange = 1
}: UseOptimizedCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]))

  // Calcular qué imágenes precargar
  const getImagesToPreload = useCallback((index: number) => {
    const imagesToPreload = new Set<number>()
    
    // Imagen actual
    imagesToPreload.add(index)
    
    // Imágenes en el rango especificado
    for (let i = 1; i <= preloadRange; i++) {
      const prevIndex = (index - i + totalItems) % totalItems
      const nextIndex = (index + i) % totalItems
      imagesToPreload.add(prevIndex)
      imagesToPreload.add(nextIndex)
    }
    
    return imagesToPreload
  }, [totalItems, preloadRange])

  // Navegar a índice específico
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    const newPreloaded = getImagesToPreload(index)
    setPreloadedImages(prev => new Set([...prev, ...newPreloaded]))
  }, [getImagesToPreload])

  // Navegar siguiente
  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalItems
    goToSlide(nextIndex)
  }, [currentIndex, totalItems, goToSlide])

  // Navegar anterior
  const prevSlide = useCallback(() => {
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems
    goToSlide(prevIndex)
  }, [currentIndex, totalItems, goToSlide])

  // Control de autoplay
  const startAutoPlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Efecto para autoplay
  useEffect(() => {
    if (!isPlaying) return

    intervalRef.current = setInterval(nextSlide, autoPlayInterval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, nextSlide, autoPlayInterval])

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Precargar imágenes iniciales
  useEffect(() => {
    const initialPreload = getImagesToPreload(0)
    setPreloadedImages(initialPreload)
  }, [getImagesToPreload])

  return {
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoPlay,
    stopAutoPlay,
    isPlaying,
    preloadedImages,
    shouldPreload: (index: number) => preloadedImages.has(index)
  }
}
