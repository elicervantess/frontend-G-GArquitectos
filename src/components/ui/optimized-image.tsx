import Image from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  onLoad?: () => void
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  style?: React.CSSProperties
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  onLoad,
  placeholder = 'blur',
  blurDataURL,
  style
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Validar y normalizar la calidad (debe ser entero entre 1 y 100)
  const normalizedQuality = Math.round(Math.min(Math.max(quality, 1), 100))

  // Evitar hidratación diferente - esperar al montaje
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generar blur placeholder automático si no se proporciona
  const defaultBlurDataURL = blurDataURL || 
    `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>`
    ).toString('base64')}`

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    console.error(`❌ Error cargando imagen: ${src}`)
    // Intentar notificar al componente padre si hay callback onLoad
    onLoad?.()
  }

  // Detectar si es una imagen crítica - solo después del montaje para evitar hidratación
  const shouldPrioritize = priority // Usar directamente la prop priority

  // Durante SSR o antes del montaje, mostrar placeholder
  if (!isMounted) {
    return (
      <div 
        className={`relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
        style={{ 
          width: width || '100%', 
          height: height || '300px',
          ...style 
        }}
      >
        <div className="absolute inset-0 animate-pulse" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
        style={{ 
          width: width || '100%', 
          height: height || '300px',
          ...style 
        }}
      >
        <span className="text-gray-500 text-sm">Error cargando imagen</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={!width && !height}
        priority={shouldPrioritize}
        quality={normalizedQuality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={shouldPrioritize ? "eager" : "lazy"} // Explícito para evitar hidratación
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Hook para lazy loading inteligente
export function useImagePreload(imageSources: string[], priority: number = 2) {
  useEffect(() => {
    // Precargar solo las primeras imágenes prioritarias
    const priorityImages = imageSources.slice(0, priority)
    
    priorityImages.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })

    // Lazy load el resto después de un pequeño delay
    const timer = setTimeout(() => {
      const remainingImages = imageSources.slice(priority)
      remainingImages.forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [imageSources, priority])
}
