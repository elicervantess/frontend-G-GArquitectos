import React, { useEffect, useState } from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface UserAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
  autoRefresh?: boolean // Nueva prop para refrescar automáticamente
}

export function UserAvatar({ showName = false, autoRefresh = true, ...props }: UserAvatarProps) {
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState(user?.profileImage)
  const [refreshCount, setRefreshCount] = useState(0)
  
  // Función para forzar el refresh de la imagen agregando un timestamp
  const refreshImage = (url: string | undefined) => {
    if (!url) return url
    
    // Si es una imagen de Google y no tiene timestamp, agregarlo
    if (url.includes('googleusercontent.com') && !url.includes('?')) {
      return `${url}?t=${Date.now()}`
    }
    
    // Si ya tiene timestamp, actualizarlo
    if (url.includes('?t=')) {
      return url.replace(/\?t=\d+/, `?t=${Date.now()}`)
    }
    
    return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
  }
  
  // Auto-refresh para imágenes de Google recién creadas
  useEffect(() => {
    if (autoRefresh && user?.profileImage && user.profileImage.includes('googleusercontent.com')) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refresh de imagen de Google (intento', refreshCount + 1, ')')
        setImageUrl(refreshImage(user.profileImage))
        setRefreshCount(prev => prev + 1)
        
        // Detener después de 5 intentos (10 minutos)
        if (refreshCount >= 5) {
          clearInterval(interval)
        }
      }, 2 * 60 * 1000) // Cada 2 minutos
      
      return () => clearInterval(interval)
    }
  }, [user?.profileImage, autoRefresh, refreshCount])
  
  // Actualizar URL cuando cambie el usuario
  useEffect(() => {
    setImageUrl(user?.profileImage)
    setRefreshCount(0)
  }, [user?.profileImage])
  
  // Debug para ver si el componente se re-renderiza con nuevos datos
  console.log('🖼️ UserAvatar render - Profile image:', imageUrl, 'Refresh count:', refreshCount)
  
  if (!user) {
    return <Avatar {...props} />
  }
  
  return (
    <Avatar 
      {...props} 
      src={imageUrl}
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
    />
  )
} 