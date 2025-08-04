import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UseNavbarAvatarOptions {
  enablePreload?: boolean
  compressionQuality?: 'low' | 'medium' | 'high'
  maxCacheSize?: number
}

interface NavbarAvatarState {
  imageUrl?: string
  isLoading: boolean
  isOptimized: boolean
  error?: string
  cacheHit: boolean
}

// Cache persistente para el navbar (localStorage)
const CACHE_KEY = 'navbar_avatar_cache'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas

interface CacheEntry {
  url: string
  optimizedUrl: string
  timestamp: number
  size?: number
}

class NavbarAvatarCache {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize: number

  constructor(maxSize = 10) {
    this.maxSize = maxSize
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        this.cache = new Map(Object.entries(data))
        
        // Limpiar entradas expiradas
        const now = Date.now()
        for (const [key, entry] of this.cache) {
          if (now - entry.timestamp > CACHE_EXPIRY) {
            this.cache.delete(key)
          }
        }
      }
    } catch (error) {
      console.warn('Error cargando cache de avatares:', error)
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache)
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Error guardando cache de avatares:', error)
    }
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key)
    if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY) {
      return entry
    }
    if (entry) {
      this.cache.delete(key)
    }
    return undefined
  }

  set(key: string, entry: CacheEntry) {
    // Limpiar cache si está lleno
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0]
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, { ...entry, timestamp: Date.now() })
    this.saveToStorage()
  }

  clear() {
    this.cache.clear()
    localStorage.removeItem(CACHE_KEY)
  }

  size() {
    return this.cache.size
  }
}

// Instancia global del cache
const avatarCache = new NavbarAvatarCache()

export function useNavbarAvatar(options: UseNavbarAvatarOptions = {}): NavbarAvatarState {
  const { 
    enablePreload = true, 
    compressionQuality = 'medium',
    maxCacheSize = 10 
  } = options

  const { user } = useAuth()
  const [state, setState] = useState<NavbarAvatarState>({
    isLoading: false,
    isOptimized: false,
    cacheHit: false
  })

  // Función para crear URL optimizada del servidor
  const getOptimizedAvatarUrl = useCallback((originalUrl: string): string => {
    if (!originalUrl) return ''
    
    // Si es una imagen de Google, usar parámetros de Google
    if (originalUrl.includes('googleusercontent.com')) {
      const sizeParam = compressionQuality === 'low' ? 's=64-c' : 
                       compressionQuality === 'high' ? 's=128-c' : 's=96-c'
      return `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}${sizeParam}`
    }
    
    // Para otras imágenes, crear URL del servidor con parámetros de optimización
    const size = compressionQuality === 'low' ? 64 : 
                compressionQuality === 'high' ? 128 : 96
    
    // Si ya tiene parámetros de optimización, devolverla tal como está
    if (originalUrl.includes('w=') || originalUrl.includes('size=')) {
      return originalUrl
    }
    
    // Agregar parámetros de optimización a la URL
    const separator = originalUrl.includes('?') ? '&' : '?'
    return `${originalUrl}${separator}w=${size}&h=${size}&fit=crop&quality=${compressionQuality === 'low' ? 60 : compressionQuality === 'high' ? 90 : 80}`
  }, [compressionQuality])

  // Función para optimizar imágenes de Google (mantener para compatibilidad)
  const optimizeGoogleImage = useCallback((url: string): string => {
    return getOptimizedAvatarUrl(url)
  }, [getOptimizedAvatarUrl])

  // Función para comprimir imágenes locales
  const compressLocalImage = useCallback(async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas'))
            return
          }
          
          // Tamaño optimizado para navbar (64px máximo)
          const maxSize = compressionQuality === 'low' ? 48 : 
                         compressionQuality === 'high' ? 80 : 64
          
          let { width, height } = img
          if (width > maxSize || height > maxSize) {
            const scale = Math.min(maxSize / width, maxSize / height)
            width *= scale
            height *= scale
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedUrl = URL.createObjectURL(blob)
                resolve(optimizedUrl)
              } else {
                reject(new Error('Error al comprimir la imagen'))
              }
            },
            'image/jpeg',
            compressionQuality === 'low' ? 0.6 : 
            compressionQuality === 'high' ? 0.9 : 0.8
          )
        } catch (error) {
          reject(new Error(`Error al procesar la imagen: ${error}`))
        }
      }
      
      img.onerror = (event) => {
        console.warn('Error al cargar imagen:', url)
        // En lugar de rechazar, devolvemos la URL original como fallback
        resolve(url)
      }
      
      // Validar que la URL es válida antes de asignarla
      try {
        if (!url || typeof url !== 'string') {
          reject(new Error('URL de imagen inválida'))
          return
        }
        img.src = url
      } catch (error) {
        reject(new Error(`Error al asignar URL: ${error}`))
      }
    })
  }, [compressionQuality])

  // Función principal de optimización
  const optimizeImage = useCallback(async (originalUrl: string): Promise<string> => {
    // Validaciones iniciales
    if (!originalUrl || typeof originalUrl !== 'string') {
      console.warn('URL de imagen inválida o vacía')
      return ''
    }

    const cacheKey = `${originalUrl}_${compressionQuality}`
    
    // Verificar cache primero
    const cached = avatarCache.get(cacheKey)
    if (cached) {
      setState(prev => ({ ...prev, cacheHit: true, isOptimized: true }))
      return cached.optimizedUrl
    }

    setState(prev => ({ ...prev, isLoading: true, cacheHit: false, error: undefined }))
    
    try {
      // PRIORIDAD 1: Usar URL optimizada del servidor (sin procesamiento local)
      const optimizedUrl = getOptimizedAvatarUrl(originalUrl)
      
      // Guardar en cache inmediatamente
      avatarCache.set(cacheKey, {
        url: originalUrl,
        optimizedUrl,
        timestamp: Date.now()
      })

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isOptimized: true,
        error: undefined
      }))

      console.log(`✅ Avatar optimizado: ${originalUrl.length > 50 ? originalUrl.substring(0, 50) + '...' : originalUrl} -> Tamaño reducido para navbar`)

      return optimizedUrl

    } catch (error) {
      console.error('Error optimizando imagen de navbar:', error)
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      }))
      // Devolver URL original como fallback
      return originalUrl
    }
  }, [compressionQuality, getOptimizedAvatarUrl])

  // Efecto principal
  useEffect(() => {
    if (!user?.profileImage) {
      setState({
        imageUrl: undefined,
        isLoading: false,
        isOptimized: false,
        cacheHit: false
      })
      return
    }

    const processImage = async () => {
      try {
        const optimizedUrl = await optimizeImage(user.profileImage!)
        setState(prev => ({ 
          ...prev, 
          imageUrl: optimizedUrl 
        }))
      } catch (error) {
        console.error('Error procesando imagen de navbar:', error)
        setState(prev => ({ 
          ...prev, 
          imageUrl: user.profileImage,
          error: 'Error al optimizar imagen'
        }))
      }
    }

    processImage()
  }, [user?.profileImage, optimizeImage])

  // Precargar imagen si está habilitado
  useEffect(() => {
    if (enablePreload && user?.profileImage && !state.imageUrl) {
      const img = new Image()
      img.src = user.profileImage
    }
  }, [enablePreload, user?.profileImage, state.imageUrl])

  return state
}

// Hook para limpiar cache cuando sea necesario
export function useClearAvatarCache() {
  return useCallback(() => {
    avatarCache.clear()
    console.log('🧹 Cache de navegación limpiado')
  }, [])
}

// Hook para estadísticas del cache
export function useAvatarCacheStats() {
  const [stats, setStats] = useState({
    size: avatarCache.size(),
    maxSize: 10
  })

  useEffect(() => {
    const updateStats = () => {
      setStats({
        size: avatarCache.size(),
        maxSize: 10
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 5000) // Actualizar cada 5s
    return () => clearInterval(interval)
  }, [])

  return stats
}
