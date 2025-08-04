import React, { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface OptimizedAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
  priority?: boolean // Para avatares importantes como el navbar
  quality?: 'low' | 'medium' | 'high' // Calidad de compresión
  cacheKey?: string // Clave personalizada de cache
}

// Cache global para URLs optimizadas
const urlCache = new Map<string, string>()
const loadingStates = new Map<string, boolean>()

// Función para comprimir imagen usando Canvas
const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calcular dimensiones optimizadas (máximo 150px para avatares)
      const maxSize = 150
      let { width, height } = img
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width
          width = maxSize
        } else {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Dibujar imagen comprimida
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Convertir a blob con compresión
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            resolve(url)
          } else {
            reject(new Error('Error al comprimir imagen'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Error al cargar imagen'))
    img.src = file instanceof File ? URL.createObjectURL(file) : file
  })
}

// Función para optimizar URL de imagen
const optimizeImageUrl = async (
  originalUrl: string, 
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<string> => {
  const cacheKey = `${originalUrl}_${quality}`
  
  // Verificar cache primero
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }
  
  // Evitar múltiples procesamientos simultáneos
  if (loadingStates.get(cacheKey)) {
    return originalUrl
  }
  
  loadingStates.set(cacheKey, true)
  
  try {
    // Para imágenes de Google, usar parámetros de optimización
    if (originalUrl.includes('googleusercontent.com')) {
      const optimizedUrl = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}s=150-c`
      urlCache.set(cacheKey, optimizedUrl)
      loadingStates.delete(cacheKey)
      return optimizedUrl
    }
    
    // Para otras imágenes, usar fetch con compresión
    const qualityMap = { low: 0.6, medium: 0.8, high: 0.9 }
    const response = await fetch(originalUrl)
    const blob = await response.blob()
    
    if (blob.size > 500 * 1024) { // Si es mayor a 500KB
      const file = new File([blob], 'avatar', { type: blob.type })
      const compressedUrl = await compressImage(file, qualityMap[quality])
      urlCache.set(cacheKey, compressedUrl)
      loadingStates.delete(cacheKey)
      return compressedUrl
    }
    
    // Si la imagen ya es pequeña, usar URL original
    urlCache.set(cacheKey, originalUrl)
    loadingStates.delete(cacheKey)
    return originalUrl
    
  } catch (error) {
    console.warn('Error optimizando imagen:', error)
    loadingStates.delete(cacheKey)
    return originalUrl
  }
}

export function OptimizedAvatar({ 
  showName = false, 
  priority = false,
  quality = 'medium',
  cacheKey,
  ...props 
}: OptimizedAvatarProps) {
  const { user } = useAuth()
  const [optimizedUrl, setOptimizedUrl] = useState<string | undefined>(undefined)
  const [isOptimizing, setIsOptimizing] = useState(false)
  
  // Generar clave de cache única
  const finalCacheKey = useMemo(() => {
    return cacheKey || `${user?.id}_${user?.profileImage}_${quality}`
  }, [user?.id, user?.profileImage, quality, cacheKey])
  
  // Optimizar imagen cuando cambie
  useEffect(() => {
    if (!user?.profileImage) {
      setOptimizedUrl(undefined)
      return
    }
    
    // Usar cache si está disponible
    if (urlCache.has(finalCacheKey)) {
      setOptimizedUrl(urlCache.get(finalCacheKey))
      return
    }
    
    const optimizeImage = async () => {
      setIsOptimizing(true)
      try {
        const optimized = await optimizeImageUrl(user.profileImage!, quality)
        setOptimizedUrl(optimized)
        console.log(`🚀 Imagen optimizada (${quality}):`, {
          original: user.profileImage,
          optimized,
          cached: urlCache.size
        })
      } catch (error) {
        console.error('Error optimizando avatar:', error)
        setOptimizedUrl(user.profileImage)
      } finally {
        setIsOptimizing(false)
      }
    }
    
    // Priorizar optimización para avatares importantes
    if (priority) {
      optimizeImage()
    } else {
      // Pequeño delay para avatares no prioritarios
      const timer = setTimeout(optimizeImage, 100)
      return () => clearTimeout(timer)
    }
  }, [user?.profileImage, quality, finalCacheKey, priority])
  
  // Limpiar URLs de blob al desmontar
  useEffect(() => {
    return () => {
      if (optimizedUrl && optimizedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(optimizedUrl)
      }
    }
  }, [optimizedUrl])
  
  if (!user) {
    return <Avatar {...props} />
  }
  
  return (
    <Avatar 
      {...props} 
      src={optimizedUrl}
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
      className={props.className} // Asegurar que la className se pase correctamente
    />
  )
}

// Función para limpiar cache (útil para testing o memoria)
export const clearAvatarCache = () => {
  // Limpiar URLs de blob
  urlCache.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  
  urlCache.clear()
  loadingStates.clear()
  console.log('🧹 Cache de avatares limpiado')
}

// Hook para precargar avatares
export const usePreloadAvatar = (imageUrl?: string, quality: 'low' | 'medium' | 'high' = 'medium') => {
  useEffect(() => {
    if (!imageUrl) return
    
    const preload = async () => {
      try {
        await optimizeImageUrl(imageUrl, quality)
        console.log('🔄 Avatar precargado:', imageUrl)
      } catch (error) {
        console.warn('Error precargando avatar:', error)
      }
    }
    
    // Precargar después de un pequeño delay
    const timer = setTimeout(preload, 200)
    return () => clearTimeout(timer)
  }, [imageUrl, quality])
}
