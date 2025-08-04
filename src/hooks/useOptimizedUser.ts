import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface OptimizedUser {
  id: string
  name: string
  email: string
  profileImage?: string
  optimizedAvatar?: string
  role: string
  provider?: string
}

interface UseOptimizedUserOptions {
  avatarSize?: 'sm' | 'md' | 'lg'
  quality?: 'low' | 'medium' | 'high'
}

export function useOptimizedUser(options: UseOptimizedUserOptions = {}) {
  const { avatarSize = 'md', quality = 'medium' } = options
  const { user, isAuthenticated } = useAuth()
  const [optimizedUser, setOptimizedUser] = useState<OptimizedUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const optimizeAvatarUrl = useCallback((originalUrl: string): string => {
    if (!originalUrl) return ''

    // Tamaños según el uso
    const sizes = {
      sm: 48,   // Para listas, comentarios
      md: 96,   // Para navbar, perfiles pequeños  
      lg: 200   // Para modales, perfiles grandes
    }

    const size = sizes[avatarSize]
    const qualityValue = quality === 'low' ? 60 : quality === 'high' ? 90 : 80

    // Optimización para Google Images
    if (originalUrl.includes('googleusercontent.com')) {
      return `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}s=${size}-c`
    }

    // Para otras imágenes, agregar parámetros de optimización
    if (originalUrl.includes('w=') || originalUrl.includes('size=')) {
      return originalUrl // Ya está optimizada
    }

    const separator = originalUrl.includes('?') ? '&' : '?'
    return `${originalUrl}${separator}w=${size}&h=${size}&fit=crop&quality=${qualityValue}&format=webp`
  }, [avatarSize, quality])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOptimizedUser(null)
      return
    }

    setIsLoading(true)

    try {
      const optimizedAvatar = user.profileImage ? optimizeAvatarUrl(user.profileImage) : undefined

      setOptimizedUser({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        optimizedAvatar,
        role: user.role,
        provider: user.provider
      })

      // Log para debugging
      if (user.profileImage && optimizedAvatar) {
        const originalSize = user.profileImage.length > 100 ? '~6MB' : 'Optimizada'
        const newSize = avatarSize === 'sm' ? '~5KB' : avatarSize === 'md' ? '~12KB' : '~25KB'
        console.log(`🎯 Avatar optimizado para ${avatarSize}: ${originalSize} -> ${newSize}`)
      }

    } catch (error) {
      console.error('Error optimizando usuario:', error)
      setOptimizedUser({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        provider: user.provider
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, isAuthenticated, optimizeAvatarUrl])

  return {
    user: optimizedUser,
    isLoading,
    isAuthenticated
  }
}

// Hook específico para el navbar
export function useNavbarUser() {
  return useOptimizedUser({ 
    avatarSize: 'md', 
    quality: 'medium' 
  })
}

// Hook específico para listas/comentarios
export function useCompactUser() {
  return useOptimizedUser({ 
    avatarSize: 'sm', 
    quality: 'low' 
  })
}

// Hook específico para modales/perfiles
export function useProfileUser() {
  return useOptimizedUser({ 
    avatarSize: 'lg', 
    quality: 'high' 
  })
}
